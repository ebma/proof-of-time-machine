pragma solidity >=0.5.0 <0.7.0;

contract IdentityService {

    event ClaimVerification (uint claim_id, uint _verifiedCount);

    bool claimAlreadyVerified;

    struct Claim {
        address pubkey;
        string name;
        string email;
    }

    Claim[] public claims;

    mapping(uint256 => address) public claimToUser;
    mapping(uint256 => uint) public claimToCount;
    mapping(uint256 => address[]) public claimToVerifier;//Maps a claim to its verifiers.

    function _createClaim(string memory _name, string memory _email) internal {
        claims.push(Claim(msg.sender, _name, _email));
        uint256 id = claims.length - 1;
        claimToUser[id] = msg.sender;
    }

    function _isVerified (bool _condition) internal {
        claimAlreadyVerified = _condition;
    }

//Function ensures that the user can verify the a claim just once.
    function verifierCheck(uint _claimId, address _verifierAddress) external  {
        for(uint i = 0; i < claimToVerifier[_claimId].length - 1; i++){
           if (claimToVerifier[_claimId][i] == _verifierAddress){
               _isVerified(true);
           }
        }
        _isVerified(false);
    }

    function _verifyClaim(uint _claimId, address _verifierAddress) external {
        require(claimAlreadyVerified == false,'You already verified the claim');
        claimToCount[_claimId]++;
        claimToVerifier[_claimId].push(_verifierAddress);
        emit ClaimVerification(_claimId,claimToCount[_claimId]);
    }

}
