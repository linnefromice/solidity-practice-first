pragma solidity 0.8.10;

contract SimpleBank {
  function deposit() public payable{}

  function withdraw() public {
    payable(msg.sender).transfer(address(this).balance);
  }
}

contract Bank {
  mapping(address => uint) balance;

  function getBalance() public view returns(uint) {
    return balance[msg.sender];
  }

  function deposit() public payable {
    balance[msg.sender] += msg.value;
  }

  function withdraw(uint _amount) public {
    balance[msg.sender] -= _amount;
    payable(msg.sender).transfer(_amount);
  }

  function transfer(address _to, uint _amount) public {
    balance[msg.sender] -= _amount;
    balance[_to] += _amount;
  }
}