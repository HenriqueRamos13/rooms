import { NextApiRequest, NextApiResponse } from "next";
import getIp from "../../../src/utils/get_ip";
import rateLimit from "../../../src/utils/lib/rate_limit";
import { prisma } from "../../../src/utils/lib/prisma";
import { uuid } from "uuidv4";
import SGRID from "../../../src/utils/mail";

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
        body: { email, name },
      } = req;

      const exist = await prisma.user.findFirst({
        where: { email },
      });

      if (exist) {
        return res.status(400).json({
          message: "Usuário já cadastrado.",
        });
      }

      const token = uuid();
      const expires = new Date(Date.now() + 15 * 60 * 1000);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          access_token: token,
          token_expires: expires,
        },
      });

      await SGRID(
        `Olá ${name}! Seu link de acesso é: <a href="${process.env.SITE_URL}/publicar?token=${token}">${process.env.SITE_URL}/publicar?token=${token}</a>`,
        {
          to: email,
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
