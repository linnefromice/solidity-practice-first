contract MyContract1 {
  uint public number = 123; // storage
  string public message = "Hello World"; // storage

  function setString(string memory input) public {
    string memory newMessage = input; // memory
    message = newMessage;
  }

  function setNumber(uint input) public {
    uint newNumber = input; // memory
    number = newNumber;
  }
}

contract MyContract2 {
  struct Kitty {
    string name;
    address owner;
  }

  Kitty[] public kitties;

  function newKitty(string memory _name) public {
    Kitty memory kitty = Kitty(_name, msg.sender);
    kitties.push(kitty);
  }

  function sGetKitty(uint _id) public view returns(string memory) {
    Kitty storage kitty = kitties[_id];
    return kitty.name;
  }

  function mGetKitty(uint _id) public view returns(string memory) {
    Kitty memory kitty = kitties[_id];
    return kitty.name;
  }

  function sChangeKitty(uint _id, string memory _name) public {
    Kitty storage kitty = kitties[_id];
    kitty.name = _name;
  }
}