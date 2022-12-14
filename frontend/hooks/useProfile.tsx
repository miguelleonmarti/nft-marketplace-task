import styles from "./style.module.scss";
import { useState, useEffect, useContext } from "react";
import { Table, Button, Typography } from "@web3uikit/core";
import { getNftsForOwner } from "@/utils/alchemy";
import { useAccount } from "wagmi";
import { app } from "../config";
import { Web3Context } from "@/contexts/Web3Context";
import { SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";
import { truncateEthAddress } from "@/utils/address";
import useNotifications from "@/hooks/useNotifications";
import useOrderAPI from "@/hooks/useOrderAPI";
import { Order } from "@/interfaces/index";

const SellButton = ({ handleOnClick, tokenAddress, tokenId }) => {
  return <Button onClick={() => handleOnClick(tokenAddress, tokenId)} theme="secondary" size="large" text="Sell"></Button>;
};

const CancelButton = ({ handleOnClick, nonce, id }) => {
  return <Button onClick={() => handleOnClick(nonce, id)} theme="secondary" size="large" text="Cancel"></Button>;
};

export default function useProfile() {
  const [nfts, setNfts] = useState<{ address: string; tokenId: string }[]>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedNft, setSelectedNft] = useState<{ address: string; tokenId: string }>();
  const { address } = useAccount();
  const { swapSdk } = useContext(Web3Context);
  const { notifyOrderCreated, notifyOrderCancelled, notifyError } = useNotifications();
  const { createOrder, getOrders, deleteOrder } = useOrderAPI();

  function formatNftData() {
    return nfts
      ?.filter(({ tokenId }) => {
        return !orders.some((order) => order.erc721TokenId === Number(tokenId));
      })
      .map(({ address, tokenId }) => {
        return [
          address,
          tokenId,
          <SellButton key={address + tokenId} handleOnClick={openModal} tokenId={tokenId} tokenAddress={address} />,
        ];
      });
  }

  function formatOrderData() {
    return orders
      .filter(({ maker }) => address.toLowerCase() === maker)
      .map(({ erc20Token, erc20TokenAmount, erc721Token, erc721TokenId, nonce, id }) => [
        truncateEthAddress(erc721Token),
        erc721TokenId,
        truncateEthAddress(erc20Token),
        erc20TokenAmount,
        <CancelButton key={nonce} handleOnClick={handleCancel} nonce={nonce} id={id} />,
      ]);
  }

  async function openModal(tokenAddress: string, tokenId: string) {
    setSelectedNft({ address: tokenAddress, tokenId });
    setIsVisible(true);
  }

  async function handleSell(tokenAddress: string, tokenId: string, price: number) {
    try {
      setSelectedNft(null);
      const nft: SwappableAssetV4 = { tokenAddress, tokenId, type: "ERC721" };
      const token: SwappableAssetV4 = { tokenAddress: app.tokenAddress, amount: price.toString(), type: "ERC20" };
      const approvalStatus = await swapSdk.loadApprovalStatus(nft, address);

      if (!approvalStatus.contractApproved) {
        const approvalTx = await swapSdk.approveTokenOrNftByAsset(nft, address);
        const approvalTxReceipt = await approvalTx.wait();
        console.log(`Approved ${nft.tokenAddress} contract to swap with 0x (txHash: ${approvalTxReceipt.transactionHash})`);
      }

      const order = swapSdk.buildOrder(nft, token, address, { expiry: Math.floor(Date.now() / 1000 + 3600 * 24) });
      const signedOrder = await swapSdk.signOrder(order);

      const response = await createOrder(signedOrder as Order);
      if (!response.ok) throw new Error("Database error");

      setNfts((prev) => prev.filter((n) => n.tokenId !== tokenId));
      const newOrder = await response.json();
      setOrders((prev) => [...prev, newOrder]);
      notifyOrderCreated();
    } catch (error) {
      notifyError(error.message);
    }
  }

  async function handleCancel(nonce: string, id: number) {
    try {
      const cancelTx = await swapSdk.cancelOrder(BigInt(nonce), "ERC721");
      await cancelTx.wait();

      const response = await deleteOrder(id);
      if (!response.ok) throw new Error("Database error");

      setOrders((prev: any[]) => prev.filter((order) => order.nonce !== nonce));
      notifyOrderCancelled();
    } catch (error) {
      notifyError(error.reason);
    }
  }

  useEffect(() => {
    if (!address) return;

    async function getNfts() {
      const onlyAddressAndTokenId = ({ contract: { address }, tokenId }) => ({ address, tokenId });
      const sameContract = ({ address }) => address === app.nftAddress.toLowerCase();
      const { ownedNfts } = await getNftsForOwner(address);
      const validNfts = ownedNfts.map(onlyAddressAndTokenId).filter(sameContract);
      setNfts(validNfts);
    }

    async function getOrdersData() {
      const orders: Order[] = await getOrders();
      setOrders(orders);
    }

    getNfts();
    getOrdersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return { address, nfts, formatNftData, orders, formatOrderData, isVisible, setIsVisible, selectedNft, handleSell };
}
