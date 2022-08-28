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
      await myTokenContract.mint(1);
      notifyTokenMinted();
    },
    [MintOption.ERC721]: async () => {
      await myNFTContract.mint(1);
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
