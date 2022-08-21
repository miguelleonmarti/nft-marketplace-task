import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
console.log(ETHERSCAN_API_KEY);

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
