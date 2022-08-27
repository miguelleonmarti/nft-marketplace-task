import type { NextPage } from "next";
import { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.scss";
import { Table, Button } from "@web3uikit/core";
import { Web3Context } from "@/contexts/Web3Context";
import { useAccount } from "wagmi";
import { SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";
import useNotifications from "@/hooks/notifications";
import { truncateEthAddress } from "@/utils/address";
import useOrderAPI from "@/hooks/useOrderAPI";
import { Order } from "@/interfaces/index";

const BuyButton = ({ handleOnClick, signedOrder }) => {
  return <Button onClick={() => handleOnClick(signedOrder)} theme="secondary" size="large" text="Buy"></Button>;
};

const Home: NextPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { swapSdk } = useContext(Web3Context);
  const { address } = useAccount();
  const { notifyOrderFilled, notifyError } = useNotifications();
  const { getOrders } = useOrderAPI();

  async function handleBuy(signedOrder: any) {
    try {
      const token: SwappableAssetV4 = { tokenAddress: signedOrder.erc20Token, type: "ERC20", amount: signedOrder.erc20TokenAmount };
      const approvalStatus = await swapSdk.loadApprovalStatus(token, address);

      if (!approvalStatus.contractApproved) {
        const approvalTx = await swapSdk.approveTokenOrNftByAsset(token, address);
        const approvalTxReceipt = await approvalTx.wait();
        console.log(`Approved ${token.tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`);
      }

      delete signedOrder.createdAt;
      delete signedOrder.updatedAt;
      delete signedOrder.id;
      delete signedOrder.verifyingContract;

      const fillTx = await swapSdk.fillSignedOrder(
        {
          ...signedOrder,
          expiry: String(signedOrder.expiry),
          erc721TokenId: String(signedOrder.erc721TokenId),
          erc20TokenAmount: String(signedOrder.erc20TokenAmount),
          nonce: BigInt(signedOrder.nonce),
        },
        {},
        { gasLimit: BigInt(300000) }
      );
      const fillTxReceipt = await swapSdk.awaitTransactionHash(fillTx.hash);
      console.log({ fillTxReceipt });
      console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);
      notifyOrderFilled();
    } catch (error) {
      console.log({ error });
      notifyError(error.reason ?? error.message);
    }
  }

  function formatOrderData() {
    if (!address) return;
    return orders
      .filter(({ maker }) => address.toLowerCase() !== maker)
      .map((order) => [
        truncateEthAddress(order.erc721Token),
        order.erc721TokenId,
        truncateEthAddress(order.erc20Token),
        order.erc20TokenAmount,
        <BuyButton key={order.nonce} handleOnClick={handleBuy} signedOrder={order} />,
      ]);
  }

  useEffect(() => {
    if (!address) return;

    async function getOrdersData() {
      const orders: Order[] = await getOrders();
      setOrders(orders);
    }

    getOrdersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <section className={styles.main}>
      <Table
        columnsConfig="2fr 2fr 2fr 2fr 2fr"
        isLoading={!orders}
        data={formatOrderData()}
        header={["NFT Address", "NFT ID", "Token Address", "Token Amount", "Actions"]}
        isColumnSortable={[true, true, true, true, false]}
        maxPages={3}
        onPageNumberChanged={function noRefCheck() {}}
        onRowClick={function noRefCheck() {}}
        pageSize={2}
      ></Table>
    </section>
  );
};

export default Home;
