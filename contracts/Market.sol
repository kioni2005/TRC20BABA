/**
 * @title Tronbaba Market Contract
 * @dev This contract will act as escrow service for Tronbaba market
 * @author @wafflemakr
 */

pragma solidity ^0.4.25;

import './Admin.sol';
import './Baba.sol';

import "./utils/SafeMath.sol";

contract Market is Admin{

    using SafeMath for uint256;

    event NewUser(uint indexed userId, address indexed userAddress, uint registerDate);

    event NewTrade(uint indexed tradeId, address indexed buyer, address indexed seller, uint amount);

    event TradeReleased(uint indexed tradeId, address seller, uint amount, bool byAdmin);

    // TRC20 BABA Token Contract
    Baba public baba;

    // TRC10 BABA token 
    trcToken public trc10; 

    struct Trade{
        uint id;
        address buyer;
        address seller;
        address admin;
        uint tradeAmount;
        string currency;
        uint8 confirmations;
        bool released;
        bool cancelled;
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

    uint public babaFee = 2;

    address public tronBabaWallet;

    /**
     * @notice Token Deployment
     * @param tokenAddress address of TRC20 baba token
     * @param tokenId token id of baba TRC10 token
     */
    constructor(address tokenAddress, uint tokenId, address _tronBabaWallet) public {
        setTokensAddress(tokenAddress, tokenId);
        tronBabaWallet = _tronBabaWallet;        
    }

    function setBabaFee(uint _fee) public onlyOwner{
        babaFee = _fee;
    }

    function setTokensAddress(address _tokenAddress, uint _tokenId) public onlyOwner{
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

    modifier onlyTradeAdmin(uint _tradeId){
        require(msg.sender == trades[_tradeId].admin, "you are not the admin of this trade");
        _;
    }

    modifier onlyExistingTrade(uint _tradeId){
        require(trades[_tradeId].id != 0, "trade does not exist");
        _;
    }

    modifier notReleased(uint _tradeId){
        require(!trades[_tradeId].released, "trade was released");
        _;
    }

    modifier notCancelled(uint _tradeId){
        require(!trades[_tradeId].cancelled, "trade was cancelled");
        _;
    }

    function openTrade
    (
        uint tradeId, uint amountBaba, 
        address seller, string currency,
        address admin
    ) 
        public 
        onlyNewTrade(tradeId)
    {        
        //Expect the token transfer from buyer to this contract to go through
        require(baba.transferFrom(msg.sender, address(this), amountBaba));

        //Create the trade
        Trade memory _trade = Trade(tradeId, msg.sender, seller, admin, amountBaba, currency, 0, false, false);

        //Add the trade to the user trades array
        users[msg.sender].trades.push(tradeId);
        trades[tradeId] = _trade;

        emit NewTrade(tradeId, msg.sender, seller, amountBaba);

    }

    function confirmTrade(uint tradeId) 
        public 
        onlyExistingTrade(tradeId)
        notReleased(tradeId)
    {
        //Only 3 addresses can interact to confirm a trade
        //Once it receives 2 confirmations, funds will be released
        require(msg.sender == trades[tradeId].buyer || 
                msg.sender == trades[tradeId].seller ||
                msg.sender == trades[tradeId].admin);
        
        trades[tradeId].confirmations++;

        //If trade gets 2 or more confirmation, release escrow
        // buyer + seller, buyer + admin,  seller & admin, or all of them
        if (trades[tradeId].confirmations == 2){
            uint tronBabaFee = trades[tradeId].tradeAmount.mul(babaFee).div(100);
            baba.transfer(trades[tradeId].seller, trades[tradeId].tradeAmount.sub(tronBabaFee));
            baba.transfer(tronBabaWallet, tronBabaFee);
            trades[tradeId].released = true;

            bool byAdmin = (msg.sender == trades[tradeId].admin);

            emit TradeReleased(tradeId, trades[tradeId].seller, trades[tradeId].tradeAmount.sub(tronBabaFee), byAdmin);
        }
    }

    function cancelTrade(uint tradeId) 
        public 
        onlyTradeAdmin(tradeId)
        notReleased(tradeId)
    {        
        baba.transfer(trades[tradeId].buyer, trades[tradeId].tradeAmount);
        trades[tradeId].cancelled = true;
    }

    function getTrc10Balance(address account) public view returns(uint balance){
       return account.tokenBalance(trc10);
    }

    function getUsersTrades(address user) public view returns(uint[] memory){
        return users[user].trades;
    }

    function getEscrowTotal() public view returns(uint){
        return baba.balanceOf(address(this));
    }

    function() public payable{}

}