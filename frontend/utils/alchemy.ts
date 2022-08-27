import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_ROPSTEN,
};

const alchemy = new Alchemy(settings);

export const getNftsForOwner = (address: string) => alchemy.nft.getNftsForOwner(address);
