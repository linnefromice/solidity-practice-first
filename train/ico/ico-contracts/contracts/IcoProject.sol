// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IcoToken.sol";

contract IcoProject is Ownable {
  event Contributed(address _address, uint _amount, uint _total);
  event ProceededPhase(Phase _newPhase);
  event AddedWhiteList(address _address);
  event SettedTokenAddress(address _address);

  enum Phase {
    Seed,
    General,
    Open
  }

  address public tokenAddress;

  mapping (address => uint256) public contributions;
  address[] public whiteLists;

  uint256 public totalAmount;
  uint256 public targetAmount;
  
  bool public isContributable;
  Phase private currentPhase;

  modifier contributable {
    require(isContributable, "This ico is suspended.");
    _;
  }

  modifier notContributable {
    require(!isContributable, "This ico is suspended.");
    _;
  }

  constructor () {
    targetAmount = 30000 ether;
    currentPhase = Phase.Seed;
    isContributable = true;
  }

  function contribute() external payable {
    // require(tokenAddress == address(0), "cannot publish token"); // about Token

    uint256 _value = msg.value;
    uint256 _newContribution = contributions[msg.sender] + _value;
    
    if (currentPhase == Phase.Seed) {
      require(_newContribution <= 1500 ether, "Individual total amount added is over 1,500 ether");
      require(totalAmount + _newContribution <= 15000 ether, "Overall amount added is over 15,000 ether");
    } else if (currentPhase == Phase.General) {
      require(_newContribution <= 1000 ether, "Individual total amount added is over 1,000 ether");
      require(totalAmount + _newContribution <= 30000 ether, "Overall amount added is over 15,000 ether");
    }

    contributions[msg.sender] = _newContribution;
    totalAmount += _value;
    // IcoToken(tokenAddress).mint(msg.sender, _value); // about Token
    // event
    emit Contributed(msg.sender, _value, _newContribution);
  }

  function refund() external {
    // TODO
  }

  function proceedPhase() external onlyOwner contributable {
    require(currentPhase != Phase.Open, "cannot proceed phase");
    // TODO: reset contribution limit?
    if (currentPhase == Phase.Seed) {
      currentPhase = Phase.General;
    } else if (currentPhase == Phase.General) {
      currentPhase = Phase.Open;
    } else {
      revert("cannot proceed phase");
    }
    emit ProceededPhase(currentPhase);
  }

  function suspend() external onlyOwner contributable {
    isContributable = false;
  }

  function resume() external onlyOwner notContributable {
    isContributable = true;
  }

  function addWhiteList(address _address) external onlyOwner {
    whiteLists.push(_address);
    emit AddedWhiteList(_address);
  }

  function setTokenAddress(address _address) external onlyOwner {
    tokenAddress = _address;
    emit SettedTokenAddress(_address);
  }
}