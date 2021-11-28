pragma solidity 0.8.10;

contract A {
  string public msgA = "hello world";

  constructor(string memory _msg) {
    msgA = _msg;
  }

  function print() public virtual view returns(string memory) {
    return msgA;
  }

  function helloA() public pure returns(string memory) {
    return "Hello A";
  }
}

contract B {
  string public msgB = "HELLO WORLD";

  constructor(string memory _msg) {
    msgB = _msg;
  }

  function print() public virtual view returns(string memory) {
    return msgB;
  }

  function helloB() public pure returns(string memory) {
    return "Hello B";
  }
}

contract C is A, B { // C > B > A という順番で読んでいることになる
  constructor(string memory _msg) A(_msg) B("Message B") {

  }

  function print() public override(A, B) view returns(string memory) {
    return super.print(); // A.print();
  }
}