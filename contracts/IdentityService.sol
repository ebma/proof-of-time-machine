pragma solidity >=0.5.0 <0.7.0;

contract IdentityService {

    event ClaimVerification (uint claim_id, uint _verifiedCount);

    struct Claim {
        address pubkey;
        string name;
        string email;
    }

    Claim[] public claims;

    mapping(uint256 => address) public claimToUser;
    mapping(uint256 => uint) public claimToCount;

    function _createClaim(string memory _name, string memory _email) internal {
        claims.push(Claim(msg.sender, _name, _email));
        uint256 id = claims.length - 1;
        claimToUser[id] = msg.sender;
    }

    function _verifyClaim(uint _claimId) internal {
        claimToCount[_claimId]++;
        emit ClaimVerification(_claimId,claimToCount[_claimId]);
    }
}
