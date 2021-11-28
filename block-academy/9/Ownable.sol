pragma solidity 0.8.10;

contract Ownable {
  mapping(address => uint) balance;
  address owner = 0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF; // example

  modifier onlyOwner {
    require(msg.sender == owner, "You are not the owner");
    _; // ↑が完了したら設定されているメソッドを読む
  }
}
