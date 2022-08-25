import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/utils/lib/prisma";
import { AUTH } from "../../../src/utils/middlewares/auth";
import { Role } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      return AUTH(req, res, [Role.Senhorio])
        .then(async (user) => {
          const { body } = req;

          const { street, neighborhood, city, country, name, photos } = body;

          const newHouse = await prisma.house.create({
            data: {
              city,
              country: "Portugal",
              name,
              street,
              neighborhood,
              city_formatted: city.toLowerCase().replace(/ /g, "-"),
              neighborhood_formatted: neighborhood
                .toLowerCase()
                .replace(/ /g, "-"),
              images: {
                create: photos.map((url: string) => ({ url: url })),
              },
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });

          return res.status(200).json({
            success: true,

            data: {
              house: newHouse.id,
            },
          });
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
