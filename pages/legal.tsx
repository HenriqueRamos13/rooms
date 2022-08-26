import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Content from "../src/components/Contents/DefaultContent/Content";
import FullWContent from "../src/components/Contents/DefaultContent/FullWContent";
import LeftContent from "../src/components/Contents/DefaultContent/LeftContent";
import ParentDefaultContent from "../src/components/Contents/DefaultContent/ParentDefaultContent";
import RightContent from "../src/components/Contents/DefaultContent/RightContent";
import RoomCard from "../src/components/RoomCard";
import Select from "../src/components/Select";
import { BENEFITS } from "../src/utils/benefits";
import { classNames } from "../src/utils/classNames";
import { COUNTRIES } from "../src/utils/Countries";
import { prisma } from "../src/utils/lib/prisma";

export async function getServerSideProps(context: NextPageContext) {
  // const room = {
  //   images: ["/quarto.jpeg", "/quarto2.jpeg"],
  //   title: "Rua da Saudade 79A - Covilhã, Portugal",
  //   number: "5531984094790",
  //   price: "160",
  //   url: "YDK4Hj",
  //   expenses: true,
  //   free: true,
  //   description:
  //     "Loren ipsum dolor sit amet Loren ipsum dolor sit amet Loren ipsum dolor sit amet Loren ipsum dolor sit amet Loren ipsum dolor sit amet Loren ipsum dolor sit amet",
  // };

  // const rooms = Array(100).fill(room);

  const rooms = await prisma.room.findMany({
    where: {
      can_post: true,
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
      created_at: "desc",
    },
    take: 100,
  });

  return {
    props: {
      rooms: rooms.map((room) => ({
        images: room.images
          .map((image) => image.url)
          .concat(room.house.images.map((image) => image.url)),
        title: room.title,
        description: room.description,
        price: Number(room.price),
        url: room.url,
        free: room.free,
        expenses: room.expenses,
        number: room.number,
        whatsapp: room.whatsapp,
      })),
    },
  };
}

export interface RoomInterface {
  images: string[];
  title: string;
  description: string;
  number: string;
  whatsapp: string;
  url: string;
  price: string;
  free: boolean;
  expenses: boolean;
  clicks?: number;
  benefits?: string[];
}

interface Props {
  rooms: RoomInterface[];
}

const Legal: NextPage<Props> = ({ rooms: serverRooms }) => {
  return (
    <>
      <ParentDefaultContent>
        <FullWContent>
          <Content title={`Políticas de privacidade`} boldTitle h1>
            Em construção
          </Content>
        </FullWContent>
      </ParentDefaultContent>
    </>
  );
};

export default Legal;
