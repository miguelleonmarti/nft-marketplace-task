import { Order } from "@/interfaces/index";

export default function useOrderAPI(): {
  getOrders: () => Promise<Order[]>;
  createOrder: (order: Order) => Promise<Response>;
  deleteOrder: (id: number) => Promise<Response>;
} {
  return {
    getOrders: async (): Promise<Order[]> => {
      const response = await fetch("/api/orders", { headers: { Authorization: process.env.NEXT_PUBLIC_API_TOKEN } });
      return response.json();
    },
    createOrder: async (order: Order): Promise<Response> => {
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
    deleteOrder: async (id: number): Promise<Response> => {
      return fetch(`/api/order/${id}`, {
        method: "DELETE",
        headers: { Authorization: process.env.NEXT_PUBLIC_API_TOKEN },
      });
    },
  };
}
