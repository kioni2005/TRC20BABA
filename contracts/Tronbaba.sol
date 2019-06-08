pragma solidity ^0.4.25;

import './tokens/TRC20/TRC20.sol';
import './tokens/TRC20/TRC20Detailed.sol';
import './tokens/TRC20/TRC20Burnable.sol';
import './tokens/TRC20/TRC20Mintable.sol';

/**
 * @title Tronbaba Token Contract
 * @dev Responsible for receiving the token's details at deployment
    and creating the token with the TRC20 token standard. BABA token
    also has the burn feature, but not minting
 * @author @wafflemakr
 */

contract Tronbaba is TRC20, TRC20Detailed, TRC20Burnable, TRC20Mintable{

    /**
     * @notice Token Deployment
     * @param name Name of the token (Tronbaba)
     * @param symbol Symbol of the token (BABA)
     * @param decimals Amount of decimals of the token (6)
     * @param supply Max supply of the token (27 Billion)
     * @param initialOwner Address of the person that will receive
        the total supply when deploying the token
     */
    constructor
    (
        string name, string symbol,
        uint8 decimals, uint256 supply,
        address initialOwner
    )
        // Call the TRC20 contract with constructor parameters

        public TRC20Detailed(name, symbol, decimals)
    {
        //Working with decimals for token amounts
        uint total = supply * (10 ** uint256(decimals));

        //Mint total supply of tokens to initial owner's address
        mint(initialOwner, total);
    }
}