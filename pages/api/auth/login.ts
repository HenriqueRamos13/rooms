import { NextApiRequest, NextApiResponse } from "next";
import getIp from "../../../src/utils/get_ip";
import rateLimit from "../../../src/utils/lib/rate_limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const ip = getIp(req);
      await limiter.check(res, 2, ip);
      console.log("AAAAAAAAAAAA", ip);
      const {
        body: { email },
      } = req;
      res.status(200).json({ email, ip });
    } catch (error) {
      console.log(error);
      res.status(429).json({ error: "Rate limit exceeded" });
    }
  }
}
