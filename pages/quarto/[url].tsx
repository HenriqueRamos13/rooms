import type { GetStaticPropsContext, NextPage, NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";
import { RoomInterface } from "..";
import Content from "../../src/components/Contents/DefaultContent/Content";
import FullWContent from "../../src/components/Contents/DefaultContent/FullWContent";
import ParentDefaultContent from "../../src/components/Contents/DefaultContent/ParentDefaultContent";
import WhatsappButton from "../../src/components/WhatsappButton";
import { BENEFITS } from "../../src/utils/benefits";
import { classNames } from "../../src/utils/classNames";
import { prisma } from "../../src/utils/lib/prisma";
import { URL } from "../../src/utils/URL";

export async function getStaticPaths(context: NextPageContext) {
  const rooms = await prisma.room.findMany({
    where: {
      can_post: true,
      free: true,
    },
  });

  const paths = rooms.map((room) => {
    return {
      params: {
        // url: `${process.env.SITE_URL}/quarto/${room.url}`,
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
      free: true,
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
          benefits: room.benefits,
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
        {/* <title>{room?.url}</title> */}
        <title>Quarto</title>
      </Head>
      <ParentDefaultContent>
        <FullWContent>
          <Content>
            <h2 className="text-black font-bold text-3xl">{room.title}</h2>
            <p className="text-xl mb-2 mt-8 text-gray-500">
              <b className="text-gray-800">Descrição:</b>{" "}
              {room.description.slice(0, 161)}
            </p>
            <div className="my-12">
              {room.whatsapp ? (
                <WhatsappButton
                  number={room.whatsapp}
                  url={`${URL}/quarto/${room.url}`}
                />
              ) : (
                <p>
                  Número de contato: <b>{room.number}</b>
                </p>
              )}
            </div>
            <div className="col-span-full">
              <div className="grid gap-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
                <h2 className="text-gray-800 text-xl col-span-full">
                  Diferenciais:
                </h2>
                {room.benefits &&
                  room.benefits.map((e) => (
                    <div
                      key={e}
                      className={classNames(
                        "badge cursor-pointer badge-lg badge-success"
                      )}
                    >
                      {BENEFITS.find((benefit) => benefit.id === e)?.name}
                    </div>
                  ))}
              </div>
            </div>
            <div className="divider">Fotos</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {room.images.map((image, i) => (
                <Image
                  key={image}
                  src={image}
                  alt={"Imagem" + i}
                  layout="responsive"
                  width={400}
                  height={400}
                  className="rounded-lg"
                />
              ))}
            </div>
          </Content>
        </FullWContent>
      </ParentDefaultContent>
    </>
  );
};

export default Quarto;
