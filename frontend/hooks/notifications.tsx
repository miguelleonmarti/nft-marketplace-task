import { useNotification } from "@web3uikit/core";

export default function useNotifications(): {
  notifyOrderCreated: () => void;
  notifyOrderCancelled: () => void;
  notifyOrderFilled: () => void;
  notifyError: (message: string) => void;
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
  };
}
