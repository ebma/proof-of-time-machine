pragma solidity >=0.5.0 <0.7.0;

contract IdentityService {
    event newClaimCreated(uint256 id, address owner, string name, string email, uint256 count);

    struct Claim {
        address ownerAddress;
        string name;
        string email;
        uint256 verifiedCount;
    }

    Claim[] public claims;

    mapping(address => bool) public userToClaimCreated;
    mapping(address => uint256) public userToClaim;
    mapping(address => uint256) public claimOwnerVerifiedCount;
    mapping(uint256 => mapping(address => bool)) public verifiersToClaim;

    function createClaim(string memory _name, string memory _email) public {
        require(
            userToClaimCreated[msg.sender] == false,
            "Claim already Created"
        );
        uint256 count = 0;
        Claim memory newClaim = Claim(msg.sender, _name, _email, count);
        claims.push(newClaim);
        uint256 id = claims.length - 1;
        userToClaim[msg.sender] = id;
        userToClaimCreated[msg.sender] = true;
        emit newClaimCreated(id, msg.sender, _name, _email, count);
    }

    function verifyClaim(address _owner) public {
        uint256 claimId = userToClaim[_owner];
        require(
            verifiersToClaim[claimId][msg.sender] == false,
            "This account already verified the claim"
        );
        claims[claimId].verifiedCount++;
        verifiersToClaim[claimId][msg.sender] = true;
    }

    function getUserClaimId(address _claimOwner)
        external
        view
        returns (uint256)
    {
        return userToClaim[_claimOwner];
    }

    function getClaimVerifiedCount(address _claimOwner)
        external
        view
        returns (uint256)
    {
        return claimOwnerVerifiedCount[_claimOwner];
    }

    function getVerifiersToClaim(uint256 _id, address _verifier)
        external
        view
        returns (bool)
    {
        return verifiersToClaim[_id][_verifier];
    }

    function searchClaims(string memory _name_or_email)
        public
        view
        returns (int256)
    {
        for (uint256 i = 0; i < claims.length; i++) {
            if (
                keccak256(abi.encodePacked(claims[i].name)) ==
                keccak256(abi.encodePacked(_name_or_email)) ||
                keccak256(abi.encodePacked(claims[i].email)) ==
                keccak256(abi.encodePacked(_name_or_email))
            ) {
                return int256(i);
            }
        }
        return -1;
    }

    function getClaimCount() public view returns (uint256 count) {
        return claims.length;
    }
}
