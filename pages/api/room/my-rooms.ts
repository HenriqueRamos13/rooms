import { NextApiRequest, NextApiResponse } from "next";
import getIp from "../../../src/utils/get_ip";
import rateLimit from "../../../src/utils/lib/rate_limit";
import { prisma } from "../../../src/utils/lib/prisma";
import SGRID from "../../../src/utils/mail";
import { uuid } from "uuidv4";
import { AUTH } from "../../../src/utils/middlewares/auth";
import { Role } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      return AUTH(req, res, [Role.Senhorio])
        .then(async (user) => {
          const rooms = await prisma.room.findMany({
            where: {
              user_id: user.id,
              can_post: true,
            },
            include: {
              images: true,
              house: {
                include: {
                  images: true,
                },
              },
            },
          });

          return res.status(200).json({
            success: true,
            data: {
              rooms,
            },
          });
        })
        .catch((error) => {
          return res
            .status(error.status || 401)
            .json({ message: error?.message || "Error" });
        });
      // const {
      //   body: { email },
      // } = req;

      // const user = await prisma.user.findFirst({
      //   where: { email },
      // });

      // if (!user) {
      //   return res.status(400).json({
      //     message: "Credenciais incorretas.",
      //   });
      // }

      // const token = uuid();

      // await prisma.user.update({
      //   where: { email },
      //   data: {
      //     access_token: token,
      //     token_expires: new Date(Date.now() + 15 * 60 * 1000),
      //   },
      // });

      // await SGRID(
      //   `Olá ${user.name}! Seu link de acesso é: <a href="${process.env.SITE_URL}/publicar?token=${token}">${process.env.SITE_URL}/publicar?token=${token}</a>`,
      //   {
      //     to: user.email,
      //     subject: "Link de acesso",
      //   }
      // );
    } catch (error: any) {
      res
        .status(error.status || 401)
        .json({ message: error?.message || "Error" });
    }
  }
}
