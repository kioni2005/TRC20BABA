pragma solidity ^0.4.25;

contract Admin {
  address public owner;
  mapping(address => bool) public isAdmin;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyAdmin() {
    require(isAdmin[msg.sender]);
    _;
  }

  constructor() public {
    owner = msg.sender;
    addAdmin(owner);
  }

  function addAdmin(address _admin) public onlyOwner {
    isAdmin[_admin] = true;
  }

  function removeAdmin(address _admin) public onlyOwner {
    isAdmin[_admin] = false;
  }
}