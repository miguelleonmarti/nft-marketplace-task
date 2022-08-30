import { Order } from "@/interfaces/index";

export default function useOrderAPI(): {
  getOrders: () => Promise<any>;
  createOrder: (order: Order) => Promise<any>;
  deleteOrder: (id: number) => Promise<any>;
} {
  return {
    getOrders: async () => {
      const response = await fetch("/api/orders", { headers: { Authorization: process.env.NEXT_PUBLIC_API_TOKEN } });
      return response.json();
    },
    createOrder: async (order: Order) => {
      return fetch("/api/order", {
        method: "POST",
        body: JSON.stringify({
          ...order,
          erc721TokenId: Number(order["erc721TokenId"]),
          erc20TokenAmount: Number(order.erc20TokenAmount),
          expiry: Number(order.expiry),
        }),
        headers: { Authorization: process.env.NEXT_PUBLIC_API_TOKEN },
      });
    },
    deleteOrder: async (id: number) => {
      return fetch(`/api/order/${id}`, {
        method: "DELETE",
        headers: { Authorization: process.env.NEXT_PUBLIC_API_TOKEN },
      });
    },
  };
}
