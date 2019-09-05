/**
 * @title Tronbaba Market Contract
 * @dev This contract will act as escrow service for Tronbaba market
 * @author @wafflemakr
 */

pragma solidity ^0.4.25;

import './Admin.sol';
import './Baba.sol';

contract Exchanger is Admin{

    event NewMigration(address indexed user, uint amount, uint time);

    // TRC20 BABA Token Contract
    Baba public baba;

    // TRC10 BABA token 
    trcToken public trc10; 

    bool public swapPaused = false;
    bool public exchangePaused = false;

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

    function migrateTokens() 
        public 
        payable 
        swapNotPaused
    {
        require(msg.tokenvalue > 0, "you must send a value greater than zero");
        require(msg.tokenid == trc10, "invalid token id sent");
        require(baba.balanceOf(address(this)) > msg.tokenvalue, "not enought balance for migration");
        baba.transfer(msg.sender, msg.tokenvalue);
    }

    function getTrc10Balance(address account) public view returns(uint balance){
       return account.tokenBalance(trc10);
    }
    
    function getContractBalances() public view returns(uint trxBalance, uint trc10Balance, uint trc20Balance){
        trxBalance = address(this).balance;
        trc10Balance = getTrc10Balance(address(this));
        trc20Balance = baba.balanceOf(address(this));
    }

    function pauseSwap() public onlyOwner{
        swapPaused = true;
    }

    function unPauseSwap() public onlyOwner{
        swapPaused = false;
    }

    function() public payable{}

    /**
     * @dev withdraw all tokens to owner address
     */
    function _withdraw() public onlyOwner{		
        (uint trxValue, uint trc10Value,  uint babaValue) = getContractBalances();
        owner.transfer(trxValue);
        baba.transfer(owner, babaValue);
        owner.transferToken(trc10Value, trc10);
	}

}