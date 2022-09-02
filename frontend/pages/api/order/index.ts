import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { Order } from "@/interfaces/index";

// POST /api/order
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== process.env.NEXT_PUBLIC_API_TOKEN) return res.status(401).send("Unauthorized");
  const order: Order = JSON.parse(req.body);
  if (req.method !== "POST") return;
  const alreadyCreated = await prisma.order.count({ where: { erc721TokenId: order.erc721TokenId } });
  if (alreadyCreated) return res.status(409).send("Already exists");
  const result = await prisma.order.create({
    data: { ...order },
  });
  res.json(result);
}
