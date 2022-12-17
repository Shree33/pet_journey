import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";

export default async function handler(req, res) {
  const { body } = req;
  console.log ("body", body);
  try {
    const decoded = atob(body.body);
    await redis.set(body.sourceMessageId, decoded);
    return res.status(200).send(decoded);
  } catch (error) {
    return res.status(500).json({ error });
  }
}