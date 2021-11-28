pragma solidity 0.8.10;

contract Bank {

  event balanceUpdate(string _txType, address _owner, uint _amount);

  mapping(address => uint) balance;

  function getBalance() public view returns(uint) {
    return balance[msg.sender];
  }

  function deposit() public payable {
    balance[msg.sender] += msg.value;
    emit balanceUpdate("Deposit", msg.sender, balance[msg.sender]);
  }

  function withdraw(uint _amount) public {
    require(balance[msg.sender] >= _amount, "Insufficient balance");
    balance[msg.sender] -= _amount;
    payable(msg.sender).transfer(_amount);
    emit balanceUpdate("Withdraw", msg.sender, balance[msg.sender]);
  }

  function transfer(address _to, uint _amount) public {
    require(balance[msg.sender] >= _amount, "Insufficient balance");
    require(msg.sender != _to, "Invalid recipient");
    balance[msg.sender] -= _amount;
    balance[_to] += _amount;
    emit balanceUpdate("Outgoing Transfer", msg.sender, balance[msg.sender]);
    emit balanceUpdate("Incoming Transfer", _to, balance[_to]);
  }
}
