import { ArrowsExpandIcon } from "@heroicons/react/solid";
import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Checkbox from "../src/components/Checkbox";
import Content from "../src/components/Contents/DefaultContent/Content";
import FullWContent from "../src/components/Contents/DefaultContent/FullWContent";
import LeftContent from "../src/components/Contents/DefaultContent/LeftContent";
import ParentDefaultContent from "../src/components/Contents/DefaultContent/ParentDefaultContent";
import RightContent from "../src/components/Contents/DefaultContent/RightContent";
import Divider from "../src/components/Divider";
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
        size: Number(room.size),
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
  size?: string;
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
  const [collapseFilter, setCollapseFilter] = useState(false);
  const [orderBy, setOrderBy] = useState("created_at/desc");

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
        ...(orderBy && { orderBy }),
      }),
    });

    const data = await res.json();

    if (data.rooms) {
      setRooms(Object.assign([], [...data.rooms]));
    }
  };

  useEffect(() => {
    if (orderBy !== "") {
      getRooms();
    }
  }, [orderBy]);

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

  const OrderBy = () => {
    return (
      <Select
        label="Ordenar por"
        value={orderBy}
        onChange={(v) => setOrderBy(v)}
      >
        <option value="created_at/desc">Selecione</option>
        <option value="price/asc">Menor valor</option>
        <option value="price/desc">Maior valor</option>
        <option value="created_at/asc">Publicados primeiro</option>
        <option value="created_at/desc">Publicados recentemente</option>
        <option value="size/asc">Menor quarto</option>
        <option value="size/desc">Maior quarto</option>
      </Select>
    );
  };

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
            <div className="rounded-lg bg-white overflow-hidden shadow p-4">
              <h2
                className={classNames(
                  "p-0 m-0 text-black font-bold text-2xl flex flex-row items-center"
                )}
                onClick={() => setCollapseFilter(!collapseFilter)}
              >
                Filtros{" "}
                {collapseFilter ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="shadow-sm border rounded-md bg-red-300 w-[30px] h-[30px] ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                    />
                  </svg>
                ) : (
                  <ArrowsExpandIcon
                    width={30}
                    height={30}
                    className="shadow-sm border rounded-md bg-green-300 ml-2"
                    strokeWidth={0.5}
                  />
                )}
              </h2>
              <Divider />

              <div className="columns-auto">
                <OrderBy />
                <div className="py-4"></div>
                {BENEFITS.slice(0, 10).map((e) => (
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
              {collapseFilter &&
                BENEFITS.slice(10, -1).map((e) => (
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
            <Content title="Filtros" boldTitle>
              <div className="columns-auto">
                <OrderBy />
                <div className="py-4"></div>
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
