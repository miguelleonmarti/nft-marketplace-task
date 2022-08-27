import styles from "./style.module.scss";
import { useState, useEffect, useContext } from "react";
import { Table, Button, Typography, Modal, useNotification } from "@web3uikit/core";
import { getNftsForOwner } from "../../utils/alchemy";
import { useAccount } from "wagmi";
import { app } from "../../config";
import { Web3Context } from "../../contexts/Web3Context";
import SellModal from "../../components/SellModal";
import { SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";

const header: string[] = ["Address", "Token ID", "Actions"];

const SellButton = ({ handleOnClick, tokenAddress, tokenId }) => {
  return <Button onClick={() => handleOnClick(tokenAddress, tokenId)} theme="secondary" size="large" text="Sell"></Button>;
};

const CancelButton = ({ handleOnClick, nonce }) => {
  return <Button onClick={() => handleOnClick(nonce)} theme="secondary" size="large" text="Cancel"></Button>;
};

export default function Profile() {
  const [nfts, setNfts] = useState<{ address: string; tokenId: string }[]>();
  const [orders, setOrders] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedNft, setSelectedNft] = useState<{ address: string; tokenId: string }>();
  const { address } = useAccount();
  const { swapSdk } = useContext(Web3Context);
  const dispatch = useNotification();

  function truncateEthAddress(address: string) {
    const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  }

  function formatNftData() {
    return nfts?.map(({ address, tokenId }) => {
      return [address, tokenId, <SellButton key={address + tokenId} handleOnClick={openModal} tokenId={tokenId} tokenAddress={address} />];
    });
  }

  function formatOrderData() {
    return orders
      .filter(({ maker }) => address.toLowerCase() === maker)
      .map(({ erc20Token, erc20TokenAmount, erc721Token, erc721TokenId, nonce }) => [
        truncateEthAddress(erc721Token),
        erc721TokenId,
        truncateEthAddress(erc20Token),
        erc20TokenAmount,
        <CancelButton key={nonce} handleOnClick={handleCancel} nonce={nonce} />,
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
      // console.log({ order });
      // console.log("Going to sign order");
      const signedOrder = await swapSdk.signOrder(order);
      // console.log("Sell order signed:", signedOrder);
      // delete signedOrder.fees;
      // delete signedOrder["erc721TokenProperties"];
      const response = await fetch("/api/order", {
        method: "POST",
        body: JSON.stringify({
          ...signedOrder,
          erc721TokenId: Number(signedOrder["erc721TokenId"]),
          erc20TokenAmount: Number(signedOrder.erc20TokenAmount),
          expiry: Number(signedOrder.expiry),
        }),
      });
      if (!response.ok) throw new Error("Database error");
      dispatch({
        type: "success",
        message: "Order created!",
        title: "New Notification",
        position: "topL",
      });
    } catch (error) {
      dispatch({
        type: "error",
        message: error.message,
        title: "New Notification",
        position: "topL",
      });
    }
  }

  async function handleCancel(nonce: string) {
    try {
      const cancelTx = await swapSdk.cancelOrder(BigInt(nonce), "ERC721");
      // console.log("Cancel transaction:", tx.hash);
      await cancelTx.wait();

      setOrders((prev: any[]) => prev.filter((order) => order.nonce !== nonce));
      dispatch({
        type: "success",
        message: "Order cancelled!",
        title: "New Notification",
        position: "topL",
      });
    } catch (error) {
      console.log({ error });
      dispatch({
        type: "error",
        message: error.reason ?? error.message,
        title: "New Notification",
        position: "topL",
      });
    }
  }

  useEffect(() => {
    if (!address) return;

    async function getNfts() {
      const onlyAddressAndTokenId = ({ contract: { address }, tokenId }) => ({ address, tokenId });
      const sameContract = ({ address }) => address === app.nftAddress.toLowerCase();
      const { ownedNfts } = await getNftsForOwner(address);
      console.log(ownedNfts);
      const validNfts = ownedNfts.map(onlyAddressAndTokenId).filter(sameContract);
      setNfts(validNfts);
    }

    async function getOrders() {
      const response = await fetch("/api/orders");
      const orders = await response.json();
      setOrders(orders);
    }

    getNfts();
    getOrders();
  }, [address]);

  return (
    <section className={styles.profile}>
      <Typography variant="h2" style={{ margin: "1rem" }}>
        My NFTs
      </Typography>
      <Table
        columnsConfig="4fr 1fr 1fr"
        isLoading={!nfts}
        data={formatNftData()}
        header={header}
        isColumnSortable={[true, true, false]}
        maxPages={3}
        pageSize={5}
      ></Table>
      <Typography variant="h2" style={{ margin: "1rem" }}>
        My Orders
      </Typography>
      <Table
        columnsConfig="2fr 2fr 2fr 2fr 2fr"
        isLoading={!orders}
        data={formatOrderData()}
        header={["NFT Address", "NFT ID", "Token Address", "Token Amount", "Actions"]}
        isColumnSortable={[true, true, true, true, false]}
        maxPages={3}
        pageSize={2}
      ></Table>
      <SellModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        tokenAddress={selectedNft?.address}
        tokenId={selectedNft?.tokenId}
        onSell={handleSell}
      />
    </section>
  );
}
