import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === "GET") return handleGET(Number(id), res);
  else if (req.method === "DELETE") return handleDELETE(Number(id), res);

  throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
}

// GET /api/order/:id
async function handleGET(id: number, res: NextApiResponse) {
  const order = await prisma.order.findUnique({ where: { id } });
  res.json(order);
}

// DELETE /api/order/:id
async function handleDELETE(id: number, res: NextApiResponse) {
  const order = await prisma.order.delete({ where: { id } });
  res.json(order);
}
