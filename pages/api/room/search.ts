import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/utils/lib/prisma";
import { AUTH } from "../../../src/utils/middlewares/auth";
import { Role } from "@prisma/client";
import Stripe from "stripe";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { body } = req;

      const { benefits, city, neighborhood, orderBy } = body;

      const [element, order] = orderBy ? orderBy.split("/") : [null, null];

      const rooms = await prisma.room.findMany({
        where: {
          can_post: true,
          free: true,
          ...(city || neighborhood
            ? {
                house: {
                  ...(city && { city }),
                  ...(neighborhood && { neighborhood }),
                },
              }
            : {}),
          // ...(benefits.length > 0 && {
          benefits: {
            hasEvery: benefits,
          },
          // }),
        },
        include: {
          house: {
            include: {
              images: true,
            },
          },
          images: true,
        },
        orderBy: {
          ...(element && order
            ? {
                [element]: order,
              }
            : { created_at: "desc" }),
        },
      });

      return res.status(200).json({
        rooms: rooms.map((room) => ({
          images: room.house.images
            .map((image) => image.url)
            .concat(room.house.images.map((image) => image.url)),
          title: `${room.house.street}, ${room.house.neighborhood} - ${room.house.city}`,
          description: room.description,
          price: Number(room.price),
          url: room.url,
          free: room.free,
          expenses: room.expenses,
          size: room.size,
          number: room.number,
          whatsapp: room.whatsapp,
        })),
      });
    } catch (error: any) {
      // res
      //   .status(error.status || 401)
      //   .json({ message: error?.message || "Error" });
      res.status(error.status || 401).json({ rooms: [] });
    }
  }
}
