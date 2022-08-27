import { createContext, useState, useEffect } from "react";
import { MyToken, MyToken__factory, MyNFT, MyNFT__factory } from "@/lib/typechain-types";
import { useSigner, useProvider } from "wagmi";
import { app } from "../config";
import { NftSwapV4 } from "@traderxyz/nft-swap-sdk";

export interface Web3 {
  myTokenContract: MyToken;
  myNFTContract: MyNFT;
  swapSdk: NftSwapV4;
}

export const Web3Context = createContext<Partial<Web3>>({});

export default function Web3ContextProvider({ children }) {
  const [{ myTokenContract, myNFTContract, swapSdk }, setWeb3] = useState<Web3>({} as Web3);
  const { data } = useSigner();
  const provider = useProvider();

  useEffect(() => {
    if (!data) return;

    async function initSwapSdk() {
      const sdk = new NftSwapV4(provider, data, 3, {
        zeroExExchangeProxyContractAddress: app.zeroExExchangeProxyContractAddress,
      });
      setWeb3((prev: Web3) => ({ ...prev, swapSdk: sdk }));
    }

    async function setContracts() {
      setWeb3((prev) => ({
        ...prev,
        myTokenContract: MyToken__factory.connect(app.tokenAddress, data),
        myNFTContract: MyNFT__factory.connect(app.nftAddress, data),
      }));
    }

    initSwapSdk();
    setContracts();
  }, [data, provider]);

  return <Web3Context.Provider value={{ myTokenContract, myNFTContract, swapSdk }}>{children}</Web3Context.Provider>;
}
