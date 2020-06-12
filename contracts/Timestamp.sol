// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.7.0;

contract TimestampFactory {
    event NewTimestamp(uint256 timestampId, string signedHash);

    struct Timestamp {
        string signedHash;
        bool ipfs;
    }

    mapping(uint256 => address) public timestampToOwner;
    mapping(address => uint256) ownerTimestampCount;

    Timestamp[] public timestamps;

    function createTimestamp(string memory _signedHash, bool _ipfs) public {
        Timestamp memory newTimestamp = Timestamp(_signedHash, _ipfs);
        timestamps.push(newTimestamp);
        uint256 id = timestamps.length - 1;
        timestampToOwner[id] = msg.sender;
        ownerTimestampCount[msg.sender]++;
        emit NewTimestamp(id, _signedHash);
    }

    function timestampCountOf(address _owner) external view returns (uint256) {
        return ownerTimestampCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return timestampToOwner[_tokenId];
    }

    function getTimestampsByOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](ownerTimestampCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < timestamps.length; i++) {
            if (timestampToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
