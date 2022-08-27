import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Order } from "@/interfaces/index";

// POST /api/order
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const order: Order = JSON.parse(req.body);
  if (req.method !== "POST") return;
  const result = await prisma.order.create({
    data: { ...order },
  });
  res.json(result);
}
