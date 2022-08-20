// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";

contract MyNFT is ERC721A {
    constructor(string memory tokenName, string memory tokenSymbol)
        ERC721A(tokenName, tokenSymbol)
    {}

    function mint(uint256 quantity) public {
        _mint(msg.sender, quantity);
    }
}
