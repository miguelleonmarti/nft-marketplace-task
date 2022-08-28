import { useState, useEffect, useContext } from "react";
import { Web3Context } from "@/contexts/Web3Context";
import useNotifications from "@/hooks/notifications";
import { useAccount } from "wagmi";
import { SwappableAssetV4 } from "@traderxyz/nft-swap-sdk";
import { Order } from "@/interfaces/index";
import useOrderAPI from "./useOrderAPI";
import { Button } from "@web3uikit/core";
import { truncateEthAddress } from "@/utils/address";

const BuyButton = ({ handleOnClick, signedOrder }) => {
  return <Button onClick={() => handleOnClick(signedOrder)} theme="secondary" size="large" text="Buy"></Button>;
};

export default function useHome() {
  const [orders, setOrders] = useState<Order[]>();
  const { address } = useAccount();
  const { swapSdk } = useContext(Web3Context);
  const { notifyOrderFilled, notifyError } = useNotifications();
  const { getOrders } = useOrderAPI();

  async function handleBuy(signedOrder: any) {
    try {
      const token: SwappableAssetV4 = { tokenAddress: signedOrder.erc20Token, type: "ERC20", amount: signedOrder.erc20TokenAmount };
      const approvalStatus = await swapSdk.loadApprovalStatus(token, address);

      if (!approvalStatus.contractApproved) {
        const approvalTx = await swapSdk.approveTokenOrNftByAsset(token, address);
        const approvalTxReceipt = await approvalTx.wait();
        console.log(`🎉🥳 Approved ${token.tokenAddress} contract to swap with 0x. TxHash: ${approvalTxReceipt.transactionHash})`);
      }

      ["createdAt", "updatedAt", "id", "verifyingContract"].forEach((k) => delete signedOrder[k]);

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
      console.log(`🎉🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`);
      notifyOrderFilled();
    } catch (error) {
      console.log({ error });
      notifyError(error.reason ?? error.message);
    }
  }

  function formatOrderData() {
    return orders
      ?.filter(({ maker }) => (address ? address.toLowerCase() !== maker : true))
      .map((order) => [
        truncateEthAddress(order.erc721Token),
        order.erc721TokenId,
        truncateEthAddress(order.erc20Token),
        order.erc20TokenAmount,
        <BuyButton key={order.nonce} handleOnClick={handleBuy} signedOrder={order} />,
      ]);
  }

  useEffect(() => {
    async function getOrdersData() {
      const orders: Order[] = await getOrders();
      setOrders(orders);
    }

    getOrdersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { orders, formatOrderData };
}
