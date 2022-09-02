import { useContext, useState } from "react";
import { Web3Context } from "@/contexts/Web3Context";
import useNotifications from "./useNotifications";
import { MintOption } from "../enums";

export default function useMint() {
  const [selected, setSelected] = useState<MintOption>(MintOption.NONE);
  const { myTokenContract, myNFTContract } = useContext(Web3Context);
  const { notifyTokenMinted, notifyNFTMinted, notifyError } = useNotifications();

  const onMint = {
    [MintOption.ERC20]: async () => {
      const { type, hash } = await myTokenContract.mint(1);
      if (!type) throw new Error("Transaction failure");
      console.log(`🎉🥳 Token minted. TxHash: ${hash}`);
      notifyTokenMinted();
    },
    [MintOption.ERC721]: async () => {
      const { type, hash } = await myNFTContract.mint(1);
      if (!type) throw new Error("Transaction failure");
      console.log(`🎉🥳 NFT minted. TxHash: ${hash}`);
      notifyNFTMinted();
    },
  };

  async function handleMint() {
    try {
      await onMint[selected]();
    } catch (error) {
      notifyError(error.message);
    } finally {
      setSelected(MintOption.NONE);
    }
  }

  return { selected, setSelected, handleMint };
}
