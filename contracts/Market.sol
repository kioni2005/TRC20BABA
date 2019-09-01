/**
 * @title Tronbaba Market Contract
 * @dev This contract will act as escrow service for Tronbaba market
 * @author @wafflemakr
 */

pragma solidity ^0.4.25;

import './Admin.sol';
import './Baba.sol';

contract Market is Admin{

    event NewUser(uint indexed userId, address indexed userAddress, uint registerDate);

    // TRC20 BABA Token Contract
    Baba public baba;

    // TRC10 BABA token 
    trcToken public trc10; 

    struct Trade{
        uint id;
        address buyer;
        address seller;
        uint tradeAmount;
        string currency;
        uint8 confirmations;
        bool released;
    }

    struct User{
        uint userId;
        bool registered;
        //Array of trades
        uint[] trades;
    }

    mapping(address => User) public users;
    mapping(uint => Trade) public trades;

    uint public totalUsers;

    /**
     * @notice Token Deployment
     * @param tokenAddress address of TRC20 baba token
     * @param tokenId token id of baba TRC10 token
     */
    constructor(address tokenAddress, uint tokenId) public {
        setTokenAddress(tokenAddress, tokenId);        
    }

    function setTokenAddress(address _tokenAddress, uint _tokenId) public onlyOwner{
        baba = Baba(_tokenAddress);
        trc10 = trcToken(_tokenId);
    }

    function registerUser(address user) public onlyOwner{
        //check that the user is not registered
        require(!users[user].registered);
        totalUsers++;
        uint[] memory array;
        User memory _user = User(totalUsers, true, array);
        users[user] = _user;
        emit NewUser(totalUsers, user, now);
    }

    function isRegistered(address user) public view returns(bool){
        return users[user].registered;
    }

    modifier onlyRegistered(){
        require(isRegistered(msg.sender), "sender is not a registered user");
        _;
    }
    
    modifier onlyNewTrade(uint _tradeId){
        require(trades[_tradeId].id == 0);
        _;
    }

    modifier onlyExistingTrade(uint _tradeId){
        require(trades[_tradeId].id != 0);
        _;
    }

    function openTrade
    (
        uint tradeId, uint amountBaba, 
        address seller, string currency
    ) 
        public 
        onlyNewTrade(tradeId)
    {        
        //Expect the token transfer from buyer to this contract to go through
        require(baba.transferFrom(msg.sender, address(this), amountBaba));

        //Create the trade
        Trade memory _trade = Trade(tradeId, msg.sender, seller, amountBaba, currency, 0, false);

        //Add the trade to the user trades array
        users[msg.sender].trades.push(tradeId);
        trades[tradeId] = _trade;

    }

    function confirmTrade(uint tradeId) public onlyExistingTrade(tradeId){
        //Check that the trade has not been released yet
        require(!trades[tradeId].released);
        //Only 3 addresses can interact to confirm a trade
        //Once it receives 2 confirmations, funds will be released
        require(msg.sender == trades[tradeId].buyer || 
                msg.sender == trades[tradeId].seller ||
                isAdmin[msg.sender]);
        
        trades[tradeId].confirmations++;

        //If trade gets 2 or more confirmation, release escrow
        // buyer + seller, buyer + admin,  seller & admin, or all of them
        if (trades[tradeId].confirmations >= 2){
            baba.transfer(trades[tradeId].seller, trades[tradeId].tradeAmount);
            trades[tradeId].released = true;
        }
    }

    function depositBaba(uint amount) public{
        require(baba.transferFrom(msg.sender, address(this), amount));
    }

    function migrateTokens() public payable onlyRegistered{
        require(msg.tokenvalue > 0, "you must send a value greater than zero");
        require(msg.tokenid == trc10, "invalid token id sent");
        require(baba.balanceOf(address(this)) > msg.tokenvalue, "not enought balance for migration");
        baba.transfer(msg.sender, msg.tokenvalue);
    }

    function getTrc10Balance(address account) public view returns(uint balance){
       return account.tokenBalance(trc10);
    }

    function getUsersTrades(address user) public view returns(uint[] memory){
        return users[user].trades;
    }

    function getTotalEscrow() public view returns(uint){
        return baba.balanceOf(address(this));
    }

    function() public payable{}

}