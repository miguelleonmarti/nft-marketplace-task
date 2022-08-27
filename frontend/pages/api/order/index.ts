import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

interface Order {
  verifyingContract: string;
  direction?: number;
  erc20Token: string;
  erc20TokenAmount: number;
  erc721Token: string;
  erc721TokenId: number;
  maker: string;
  taker?: string;
  nonce: string;
  expiry: number;
  signature: any;
  fees: any[];
  erc721TokenProperties: any[];
}

// POST /api/order
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const order: Order = JSON.parse(req.body);
  if (req.method !== "POST") return;
  const result = await prisma.order.create({
    data: { ...order },
  });
  res.json(result);
}
