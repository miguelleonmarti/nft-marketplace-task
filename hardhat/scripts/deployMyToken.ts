import { ethers } from "hardhat";

async function main() {
  const name = "MyToken";
  const symbol = "MT";
  const initialSupply = 100;
  const MyToken = await ethers.getContractFactory(name);
  const { address } = await MyToken.deploy(initialSupply, name, symbol);
  console.log(`${name} deployed at ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
