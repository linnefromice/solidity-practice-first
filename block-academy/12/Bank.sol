pragma solidity 0.8.10;

contract Bank {

  event balanceUpdate(string _txType, address _owner, uint _amount);

  mapping(address => uint) balance;

  function getBalance() external view returns(uint) {
    return balance[msg.sender];
  }

  function deposit() external payable {
    balance[msg.sender] += msg.value;
    emit balanceUpdate("Deposit", msg.sender, balance[msg.sender]);
  }

  function withdraw(uint _amount) external {
    require(balance[msg.sender] >= _amount, "Insufficient balance");
    balance[msg.sender] -= _amount;
    payable(msg.sender).transfer(_amount);
    emit balanceUpdate("Withdraw", msg.sender, balance[msg.sender]);
  }

  function transferFrom(address _from, address _to, uint _amount) external {
    require(balance[_from] >= _amount, "Insufficient balance");
    require(_from != _to, "Invalid recipient");
    balance[_from] -= _amount;
    balance[_to] += _amount;
    emit balanceUpdate("Outgoing Transfer", _from, balance[_from]);
    emit balanceUpdate("Incoming Transfer", _to, balance[_to]);
  }
}
