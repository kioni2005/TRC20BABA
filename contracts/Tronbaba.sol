pragma solidity ^0.4.25;

import './tokens/TRC20/TRC20Detailed.sol';

/**
 * @title Tronbaba
 * @dev Responsible for receiving the token's details at deployment
    and creating the token with the TRC20 token standard. BABA token
    also has the burn feature, but minting
 * @author @wafflemakr
 */

contract Tronbaba is TRC20Detailed{

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
        _mint(initialOwner, total);
    }


    /**
     * @dev Burns a specific amount of tokens.
     * @param value The amount of token to be burned
        (must be greater than msg.sender 's balance)
     */
    function burn(uint256 value) public {
        require(balanceOf(msg.sender) >= value, 'You do not own that amount of tokens');
        _burn(msg.sender, value);
    }

}