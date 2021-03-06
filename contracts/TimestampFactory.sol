// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.7.0;

contract TimestampFactory {
    event NewTimestamp(uint256 timestampId, string signature);

    struct Timestamp {
        uint256 timestamp;
        string signature;
        string cid;
        string extra;
    }

    mapping(uint256 => address) public timestampToOwner;
    mapping(address => uint256) ownerTimestampCount;

    Timestamp[] public timestamps;

    function createTimestamp(
        string memory _signature,
        string memory _cid,
        string memory _extra
    ) public {
        require(bytes(_signature).length >= 132, "Invalid signature length");
        Timestamp memory newTimestamp = Timestamp(
            now,
            _signature,
            _cid,
            _extra
        );
        timestamps.push(newTimestamp);
        uint256 id = timestamps.length - 1;
        timestampToOwner[id] = msg.sender;
        ownerTimestampCount[msg.sender]++;
        emit NewTimestamp(id, _signature);
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

    function getTimestampCount() external view returns (uint256 count) {
        return timestamps.length;
    }
}
