pragma solidity ^0.4.25;

import './tokens/TRC20/TRC20Detailed.sol';

contract Tronbaba is TRC20Detailed{

    constructor
    (
        string name, string symbol,
        uint8 decimals, uint256 supply,
        address initialOwner
    )
        public TRC20Detailed(name, symbol, decimals)
    {
        uint total = supply * (10 ** uint256(decimals));
        _mint(initialOwner, total);
    }


    /**
     * @dev Burns a specific amount of tokens.
     * @param value The amount of token to be burned.
     */
    function burn(uint256 value) public {
        require(balanceOf(msg.sender) >= value, 'You do not own that amount of tokens');
        _burn(msg.sender, value);
    }

}