import type { GetStaticPropsContext, NextPage, NextPageContext } from "next";
import Head from "next/head";
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
        url: `${process.env.URL}/quarto/${room.url}`,
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
          images: room?.images
            ?.map((e) => e.url)
            ?.concat(room?.house?.images?.map((e) => e.url)),
          description: room?.description,
          number: room?.number,
          whatsapp: room?.whatsapp,
          url: room?.url,
          price: Number(room?.price),
          free: room?.free,
          expenses: room?.expences,
          home: {
            city: room?.house?.city,
            country: room?.house?.country,
            street: room?.house?.street,
            neighborhood: room?.house?.neighborhood,
          },
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

interface Room {
  images: string[];
  description: string;
  number: string;
  url: string;
  price: string;
  free: boolean;
  expences: boolean;
  home: {
    city: string;
    country: string;
    street: string;
    neighborhood: string;
  };
}

interface Props {
  room: Room;
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
