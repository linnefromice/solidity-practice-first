// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;


contract ProjectFactory {
  Project[] public projectAddresses;

  function createProject(uint _goalAmount) external {
    Project project = new Project(_goalAmount);
    projectAddresses.push(project);
  }
}

/// @author arata.haruyama
/// @title Crowdfunding project
contract Project {
  address payable public owner;
  uint256 public currentTotalAmount; // current donation amount
  uint256 public goalTotalAmount; // donation amount goal
  uint256 public scheduledEndTime; // project's expected end date
  bool public isClosed; // project status

  address[] public addressIndexes; // addresses who did contributed this project.
  mapping(address => uint256) public donations;

  modifier onlyOwner {
    require(msg.sender == owner, "Only owner can call this.");
    _;
  }

  modifier activePj {
    require(!isClosed && block.timestamp < scheduledEndTime, "This project is already closed.");
    _;
  }

  modifier closedPj {
    require(isClosed || block.timestamp >= scheduledEndTime, "This project is active.");
    _;
  }

  modifier successedPj {
    require(currentTotalAmount >= goalTotalAmount, "This project failed.");
    _;
  }

  modifier failedPj {
    require(currentTotalAmount < goalTotalAmount, "This project was successful.");
    _;
  }

  constructor(uint _goalAmount) {
    owner = payable(msg.sender);
    currentTotalAmount = 0;
    goalTotalAmount = _goalAmount;
    scheduledEndTime = block.timestamp + 30 days; // Linter: Avoid to make time-based decisions in your business logic [not-rely-on-time]
    isClosed = false;
  }

  // Contribute to this project.
  function contribute() public payable activePj {
    require(msg.value >= 0.01 ether, "Need over 0.01 ETH for contribution.");

    uint256 _value = msg.value;
    uint256 _donation = donations[msg.sender];
    if (_donation == 0) {
      addressIndexes.push(msg.sender);
    }
    _donation += _value;
    currentTotalAmount += _value;
    // action for badge

    if (currentTotalAmount >= goalTotalAmount) {
      isClosed = true;
    }
  }

  // Close project.
  function close() public payable onlyOwner activePj {
    isClosed = true;

    uint _len = addressIndexes.length;
    for (uint i=0; i<_len; i++) {
      address _addr = addressIndexes[i];
      if (_addr != address(0)) {
        uint256 _donation = donations[_addr];
        if (_donation != 0) {
          payable(msg.sender).transfer(_donation);
          donations[msg.sender] = 0;
        }
      }
    }
  }

  // Refund to msg.sender.
  function refund() public payable closedPj failedPj {
    uint256 _donation = donations[msg.sender];
    if (_donation != 0) {
      // refund
      payable(msg.sender).transfer(_donation);
      donations[msg.sender] = 0;
      
      // remove from addressIndexes
      // uint _len = addressIndexes.length;
      // for (uint i=0; i<_len; i++) {
      //   if (msg.sender == addressIndexes[i]) {
      //     delete addressIndexes[i];
      //     break;
      //   }
      // }
    }
  }

  // Withdraw successed project donations.
  function withdraw() public payable onlyOwner closedPj successedPj {
    owner.transfer(currentTotalAmount);
  }
}