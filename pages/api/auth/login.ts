import { NextApiRequest, NextApiResponse } from "next";
import getIp from "../../../src/utils/get_ip";
import rateLimit from "../../../src/utils/lib/rate_limit";
import { prisma } from "../../../src/utils/lib/prisma";
import SGRID from "../../../src/utils/mail";
import { uuid } from "uuidv4";

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

      const {
        body: { email },
      } = req;

      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({
          message: "Credenciais incorretas.",
        });
      }

      const token = uuid();

      await prisma.user.update({
        where: { email },
        data: {
          access_token: token,
          token_expires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      await SGRID(
        `Olá ${user.name}! Seu link de acesso é: <a href="${process.env.SITE_URL}/publicar?token=${token}">${process.env.SITE_URL}/publicar?token=${token}</a>`,
        {
          to: user.email,
          subject: "Link de acesso",
        }
      );

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      res
        .status(error.status || 401)
        .json({ message: error?.message || "Error" });
    }
  }
}
