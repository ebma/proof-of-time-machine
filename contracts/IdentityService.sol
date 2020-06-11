pragma solidity >=0.5.0 <0.7.0;

contract IdentityService {
    struct Claim {
        address pubkey;
        string name;
        string email;
    }

    Claim[] public claims;

    mapping(uint256 => address) public claimToUser;

    function _createClaim(string memory _name, string memory _email) internal {
        claims.push(Claim(msg.sender, _name, _email));
        uint256 id = claims.length - 1;
        claimToUser[id] = msg.sender;
    }
}
