import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MyToken, MyToken__factory } from "../typechain-types";

describe("MyToken", function () {
  const INITIAL_SUPPLY = 100;
  const TOKEN_NAME = "MyToken";
  const TOKEN_SYMBOL = "MT";

  let owner: SignerWithAddress, otherAccounts: SignerWithAddress[], contract: MyToken;

  before(async function () {
    const Contract = (await ethers.getContractFactory(TOKEN_NAME)) as MyToken__factory;
    contract = await Contract.deploy(INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL);
    [owner, ...otherAccounts] = await ethers.getSigners();
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the name and symbol of the token", async function () {
      expect(await contract.name()).to.equal(TOKEN_NAME);
      expect(await contract.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should set the initial supply", async function () {
      expect(await contract.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("Should mint the initial supply", async function () {
      expect(await contract.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens to other account", async function () {
      await contract.transfer(otherAccounts[0].address, 1);
      expect(await contract.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY - 1);
      expect(await contract.balanceOf(otherAccounts[0].address)).to.equal(1);
    });
  });
});
