/**
 * @title Tronbaba Market Contract
 * @dev This contract will act as escrow service for Tronbaba market
 * @author @wafflemakr
 */

pragma solidity ^0.4.25;

import './Admin.sol';
import './Baba.sol';
import './Market.sol';

contract Exchanger is Admin{

    event NewMigration(address indexed user, uint amount, uint time);

    // TRC20 BABA Token Contract
    Baba public baba;

    // TRC10 BABA token 
    trcToken public trc10; 

    //Market contract
    Market public market;

    bool public swapPaused = false;
    bool public exchangePaused = false;

    /**
     * @notice Token Deployment
     * @param tokenAddress address of TRC20 baba token
     * @param tokenId token id of baba TRC10 token
     */
    constructor(address tokenAddress, uint tokenId, address _market) public {
        setTokenAddress(tokenAddress, tokenId); 
        setMarketAddress(_market);   
    }

    function setTokenAddress(address _tokenAddress, uint _tokenId) public onlyOwner{
        baba = Baba(_tokenAddress);
        trc10 = trcToken(_tokenId);
    }

    function setMarketAddress(address _market) public onlyOwner{
        market = Market(_market);
    }

    modifier onlyRegistered(){
        require(market.isRegistered(msg.sender), "sender is not a registered user");
        _;
    }

    modifier swapNotPaused(){
        require(!swapPaused, "Token swap is paused");
        _;
    }

    modifier exchangeNotPaused(){
        require(!exchangePaused, "Token exchange is paused");
        _;
    }

    function depositBaba(uint amount) public{
        require(baba.transferFrom(msg.sender, address(this), amount));
    }

    function migrateTokens() public payable swapNotPaused{
        require(msg.tokenvalue > 0, "you must send a value greater than zero");
        require(msg.tokenid == trc10, "invalid token id sent");
        //require(baba.allowance(owner, address(this)) > msg.tokenvalue, "not enought balance for migration");
        require(baba.balanceOf(address(this)) > msg.tokenvalue, "not enought balance for migration");
        baba.transfer(msg.sender, msg.tokenvalue);
    }

    function getTrc10Balance(address account) public view returns(uint balance){
       return account.tokenBalance(trc10);
    }
    
    function getContractBalances() external view returns(uint trc10Balance, uint trc20Balance){
        trc10Balance = getTrc10Balance(address(this));
        trc20Balance = baba.balanceOf(address(this));
    }

    function() public payable{}

}