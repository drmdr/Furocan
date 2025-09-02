// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ShampooTracker {
    struct ShampooEvent {
        address user;
        uint256 timestamp;
        uint256 blockNumber;
    }
    
    mapping(address => ShampooEvent[]) public userShampooHistory;
    mapping(address => uint256) public userShampooCount;
    
    event ShampooRecorded(address indexed user, uint256 timestamp);
    
    function recordShampoo() external {
        ShampooEvent memory newEvent = ShampooEvent({
            user: msg.sender,
            timestamp: block.timestamp,
            blockNumber: block.number
        });
        
        userShampooHistory[msg.sender].push(newEvent);
        userShampooCount[msg.sender]++;
        
        emit ShampooRecorded(msg.sender, block.timestamp);
    }
    
    function getShampooHistory(address user) external view returns (ShampooEvent[] memory) {
        return userShampooHistory[user];
    }
    
    function getShampooCount(address user) external view returns (uint256) {
        return userShampooCount[user];
    }
    
    function getLatestShampoo(address user) external view returns (ShampooEvent memory) {
        require(userShampooCount[user] > 0, "No shampoo records found");
        uint256 lastIndex = userShampooHistory[user].length - 1;
        return userShampooHistory[user][lastIndex];
    }
}