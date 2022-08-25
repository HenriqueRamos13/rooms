import type { GetStaticPropsContext, NextPage, NextPageContext } from "next";
import Head from "next/head";
import { RoomInterface } from "..";
import FullWContent from "../../src/components/Contents/DefaultContent/FullWContent";
import ParentDefaultContent from "../../src/components/Contents/DefaultContent/ParentDefaultContent";
import { prisma } from "../../src/utils/lib/prisma";

export async function getStaticPaths(context: NextPageContext) {
  const rooms = await prisma.room.findMany({
    where: {
      can_post: true,
    },
  });

  const paths = rooms.map((room) => {
    return {
      params: {
        // url: `${process.env.URL}/quarto/${room.url}`,
        url: `${room.url}`,
      },
    };
  });

  return {
    paths: paths,
    fallback: "blocking",
  };
}

type PageParams = {
  url: string;
};

export async function getStaticProps({
  params,
}: GetStaticPropsContext<PageParams>) {
  const url = params?.url;

  const room = await prisma.room.findFirst({
    where: {
      url: url,
    },
    include: {
      house: {
        include: {
          images: true,
        },
      },
      images: true,
    },
  });

  if (room) {
    return {
      props: {
        room: {
          images: room.house.images
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
        },
      },
    };
  } else {
    return {
      props: {
        room: null,
      },
    };
  }
}

interface Props {
  room: RoomInterface;
}

const Quarto: NextPage<Props> = ({ room }) => {
  return (
    <>
      <Head>
        <title>{room?.url}</title>
      </Head>
      <ParentDefaultContent>
        <FullWContent>{room?.price}</FullWContent>
      </ParentDefaultContent>
    </>
  );
};

export default Quarto;
