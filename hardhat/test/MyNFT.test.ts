import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MyNFT, MyNFT__factory } from "../typechain-types";

describe("MyNFT", function () {
  const TOKEN_NAME = "MyNFT";
  const TOKEN_SYMBOL = "MNFT";

  let owner: SignerWithAddress, otherAccounts: SignerWithAddress[], contract: MyNFT;

  before(async function () {
    const Contract = (await ethers.getContractFactory(TOKEN_NAME)) as MyNFT__factory;
    contract = await Contract.deploy(TOKEN_NAME, TOKEN_SYMBOL);
    [owner, ...otherAccounts] = await ethers.getSigners();
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the name and symbol of the token", async function () {
      expect(await contract.name()).to.equal(TOKEN_NAME);
      expect(await contract.symbol()).to.equal(TOKEN_SYMBOL);
    });
    it("Should be no tokens yet", async function () {
      expect(await contract.totalSupply()).to.equal(0);
    });
  });

  describe("Mint", function () {
    it("Should mint one token", async function () {
      expect(await contract.balanceOf(owner.address)).to.equal(0);
      await contract.mint(1);
      expect(await contract.totalSupply()).to.equal(1);
      expect(await contract.ownerOf(0)).to.equal(owner.address);
      expect(await contract.balanceOf(owner.address)).to.equal(1);
    });
  });
});
