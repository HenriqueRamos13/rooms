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

const Home: NextPage<Props> = ({ rooms: serverRooms }) => {
  const router = useRouter();
  const [rooms, setRooms] = useState(serverRooms || []);
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);

  const getRooms = async () => {
    const res = await fetch("/api/room/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(city && { city }),
        ...(neighborhood && { neighborhood }),
        // ...(benefits.length > 0 && { benefits }),
        benefits,
      }),
    });

    const data = await res.json();

    if (data.rooms) {
      setRooms(Object.assign([], [...data.rooms]));
    }
  };

  useEffect(() => {
    if (city !== "") {
      getRooms();
    }
  }, [city]);

  useEffect(() => {
    if (neighborhood !== "") {
      getRooms();
    }
  }, [neighborhood]);

  useEffect(() => {
    if (benefits) {
      if (city === "" && neighborhood === "" && benefits.length === 0) {
      } else {
        getRooms();
      }
    }
  }, [benefits]);

  // const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const form = new FormData(e.target as HTMLFormElement);
  //   const formData = Object.fromEntries(form.entries());

  //   const res = await fetch("/api/user/create", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formData),
  //   });

  //   const data = await res.json();
  //   console.log(data);
  // };

  return (
    <>
      <ParentDefaultContent>
        <FullWContent>
          <Content
            title={`Procurar quartos para arrendar em Portugal`}
            boldTitle
            h1
          >
            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-3">
              <Select
                label="Distrito"
                onChange={(v) => setCity(v)}
                value={city}
              >
                <option value="">Selecione um distrito</option>
                {Object.keys(COUNTRIES.Portugal).map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </Select>
              <Select
                label="Região/Bairro/Concelho"
                onChange={(v) => setNeighborhood(v)}
                value={neighborhood}
              >
                <option value="">Selecione uma região</option>
                {(COUNTRIES.Portugal as any)[city]?.map((e: string) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </Select>
              <Select label="País" onChange={(v) => {}} value="Portugal">
                <option value="Portugal">Portugal</option>
              </Select>
            </div>
          </Content>
        </FullWContent>
        <div className="block lg:hidden">
          <FullWContent>
            <Content title="Filtros" boldTitle>
              <div className="columns-auto">
                {BENEFITS.map((e) => (
                  <div
                    key={e.id}
                    className={classNames(
                      "badge cursor-pointer mx-2 my-2 badge-lg",
                      benefits.indexOf(e.id) > -1 ? "badge-success" : ""
                    )}
                    onClick={() => {
                      if (benefits.indexOf(e.id) > -1) {
                        setBenefits(
                          Object.assign(
                            [],
                            [...benefits.filter((f) => f !== e.id)]
                          )
                        );
                      } else {
                        setBenefits(Object.assign([], [...benefits, e.id]));
                      }
                    }}
                  >
                    {e.name}
                  </div>
                ))}
              </div>
            </Content>
          </FullWContent>
        </div>
        <LeftContent>
          {rooms &&
            rooms.length > 0 &&
            rooms.map((room) => (
              <Content key={room.url!}>
                <RoomCard
                  {...room}
                  onClick={() => router.push(`/quarto/${room.url}`)}
                />
              </Content>
            ))}
        </LeftContent>
        <div className="hidden lg:block">
          <RightContent>
            <Content title="Filtros">
              <div className="columns-auto">
                {BENEFITS.map((e) => (
                  <div
                    key={e.id}
                    className={classNames(
                      "badge cursor-pointer mx-2 my-2 badge-lg",
                      benefits.indexOf(e.id) > -1 ? "badge-success" : ""
                    )}
                    onClick={() => {
                      if (benefits.indexOf(e.id) > -1) {
                        setBenefits(
                          Object.assign(
                            [],
                            [...benefits.filter((f) => f !== e.id)]
                          )
                        );
                      } else {
                        setBenefits(Object.assign([], [...benefits, e.id]));
                      }
                    }}
                  >
                    {e.name}
                  </div>
                ))}
              </div>
            </Content>
          </RightContent>
        </div>
      </ParentDefaultContent>
      {/* <form onSubmit={onSubmit}>
        <input type="text" name="email" />
        <input type="text" name="nick" />
        <button type="submit">Submit</button>
      </form> */}
    </>
  );
};

export default Home;
