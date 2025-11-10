// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISoleNFT {
    function mint(address to, string memory tokenURI) external payable returns (uint256);
    function totalSupply() external view returns (uint256);
    function getCreator(uint256 tokenId) external view returns (address);
    function mintingFee() external view returns (uint256);
}


