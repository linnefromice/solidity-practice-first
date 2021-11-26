pragma solidity 0.8.10;

import "./Ownable.sol"; // <- ファイル名

contract Bank is Ownable { // <- コントラクト名
  modifier balanceCheck(uint _amount) {
    require(balance[msg.sender] >= _amount, "nsufficient balance");
    _;
  }

  constructor() {
    owner = msg.sender; // deploy する人が owner になる
  }

  function getBalance() public view returns(uint) {
    return balance[msg.sender];
  }

  function deposit() public payable onlyOwner {
    balance[msg.sender] += msg.value;
  }

  function withdraw(uint _amount) public balanceCheck(_amount) {
    uint beforeWithdraw = balance[msg.sender];
    balance[msg.sender] -= _amount;
    payable(msg.sender).transfer(_amount);
    uint afterWithdraw = balance[msg.sender];
    assert(afterWithdraw == beforeWithdraw - _amount);
  }

  function transfer(address _to, uint _amount) public balanceCheck(_amount) {
    require(msg.sender != _to, "Invalid recipient");
    balance[msg.sender] -= _amount;
    balance[_to] += _amount;
  }
}