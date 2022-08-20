import { ethers } from "hardhat";

async function main() {
  const name = "MyNFT";
  const symbol = "MNFT";
  const MyNFT = await ethers.getContractFactory(name);
  const { address } = await MyNFT.deploy(name, symbol);
  console.log(`${name} deployed at ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
