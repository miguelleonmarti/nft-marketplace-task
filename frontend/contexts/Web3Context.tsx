import { createContext, useState, useEffect } from "react";
import { MyToken, MyToken__factory, MyNFT, MyNFT__factory } from "../lib/typechain-types";
import { useSigner } from "wagmi";
import { app } from "../config";

export interface Web3 {
  myTokenContract: MyToken;
  myNFTContract: MyNFT;
}

export const Web3Context = createContext<Partial<Web3>>({});

export default function Web3ContextProvider({ children }) {
  const [{ myTokenContract, myNFTContract }, setWeb3] = useState<Web3>({} as Web3);
  const { data } = useSigner();

  useEffect(() => {
    if (!data) return;

    async function setContracts() {
      setWeb3((prev) => ({
        ...prev,
        myTokenContract: MyToken__factory.connect(app.tokenAddress, data),
        myNFTContract: MyNFT__factory.connect(app.nftAddress, data),
      }));
    }

    setContracts();
  }, [data]);

  return <Web3Context.Provider value={{ myTokenContract, myNFTContract }}>{children}</Web3Context.Provider>;
}
