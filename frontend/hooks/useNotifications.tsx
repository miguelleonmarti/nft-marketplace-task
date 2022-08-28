import { useNotification } from "@web3uikit/core";

export default function useNotifications(): {
  notifyOrderCreated: () => void;
  notifyOrderCancelled: () => void;
  notifyOrderFilled: () => void;
  notifyError: (message: string) => void;
  notifyNoWalletConnection: () => void;
  notifyTokenMinted: () => void;
  notifyNFTMinted: () => void;
} {
  const dispatch = useNotification();

  return {
    notifyOrderCreated: () =>
      dispatch({
        type: "success",
        message: "Order created!",
        title: "New Notification",
        position: "topL",
      }),
    notifyOrderCancelled: () =>
      dispatch({
        type: "success",
        message: "Order cancelled!",
        title: "New Notification",
        position: "topL",
      }),
    notifyOrderFilled: () =>
      dispatch({
        type: "success",
        message: "Item bought!",
        title: "New Notification",
        position: "topL",
      }),
    notifyError: (message: string) =>
      dispatch({
        type: "error",
        message: message,
        title: "New Notification",
        position: "topL",
      }),
    notifyNoWalletConnection: () =>
      dispatch({ type: "info", message: "You have to connect your wallet", title: "New Notification", position: "topL" }),
    notifyTokenMinted: () => dispatch({ type: "info", message: "Token minted!", title: "New Notification", position: "topL" }),
    notifyNFTMinted: () => dispatch({ type: "info", message: "NFT minted!", title: "New Notification", position: "topL" }),
  };
}
