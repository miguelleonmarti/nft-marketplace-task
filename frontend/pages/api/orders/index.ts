import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== process.env.API_TOKEN) return res.status(401).send("Unauthorized");
  if (req.method !== "GET") return;
  const orders = await prisma.order.findMany();
  res.json(orders);
}
