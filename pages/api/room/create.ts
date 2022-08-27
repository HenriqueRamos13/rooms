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
      return AUTH(req, res, [Role.Senhorio])
        .then(async (user) => {
          const { body } = req;

          const {
            name,
            price,
            description,
            size,
            number,
            whatsapp,
            expenses,
            benefits,
            photos,
            house_id,
          } = body;

          const house = await prisma.house.findFirst({
            where: { id: house_id },
          });

          if (!house) {
            return res.status(400).json({
              message: "Casa não encontrada.",
            });
          }

          const url = `arrendo-quarto-em-${house.neighborhood
            .toLowerCase()
            .replace(/ /g, "-")}-${house.city
            .toLowerCase()
            .replace(/ /g, "-")}-${Math.floor(
            Math.random() * 100000
          )}-${house.street.toLowerCase().replace(/ /g, "-")}`;

          const newRoom = await prisma.room.create({
            data: {
              name,
              price,
              description,
              size,
              number,
              whatsapp,
              expenses,
              free: true,
              benefits,
              url,
              updated_at: new Date(),
              title: `${house.street}, ${house.neighborhood} - ${house.city}`,
              images: {
                create: photos.map((url: string) => ({ url: url })),
              },
              house: {
                connect: {
                  id: house_id,
                },
              },
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });

          const alreadyHaveRooms = await prisma.room.findFirst({
            where: {
              user: {
                id: user.id,
              },
            },
          });

          // if (!alreadyHaveRooms) {
          if (true) {
            await prisma.room.update({
              where: {
                id: newRoom.id,
              },
              data: {
                can_post: true,
              },
            });

            return res.status(200).json({
              success: true,

              data: {
                url: newRoom.url,
              },
            });
          }

          // const userData = await prisma.user.findFirst({
          //   where: { id: user.id },
          // })

          const params: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "eur",
                  product_data: {
                    name: `Postar um quarto: ${house?.neighborhood} - ${house?.city}`,
                  },
                  unit_amount: 50 * 100,
                },
                // description: `Post new job on MyJobDev.`,
                quantity: 1,
              },
            ],
            metadata: {
              user: user.id,
              room: newRoom.id,
            },
            // customer_email: userData?.email,
            mode: "payment",
            success_url: `${process.env.SITE_URL}/quarto/${url}?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.SITE_URL}/publicar?status=cancel&session_id={CHECKOUT_SESSION_ID}`,
          };

          const session: Stripe.Checkout.Session =
            await stripe.checkout.sessions.create(params);

          return res.status(200).json({ success: true, id: session.id });
        })
        .catch((error) => {
          return res
            .status(error.status || 401)
            .json({ message: error?.message || "Error" });
        });
    } catch (error: any) {
      res
        .status(error.status || 401)
        .json({ message: error?.message || "Error" });
    }
  }
}
