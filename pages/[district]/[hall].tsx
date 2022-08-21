import type { GetStaticPropsContext, NextPage, NextPageContext } from "next";
import Head from "next/head";
import { FormEvent } from "react";
import Content from "../../src/components/Contents/DefaultContent/Content";
import FullWContent from "../../src/components/Contents/DefaultContent/FullWContent";
import LeftContent from "../../src/components/Contents/DefaultContent/LeftContent";
import ParentDefaultContent from "../../src/components/Contents/DefaultContent/ParentDefaultContent";
import RightContent from "../../src/components/Contents/DefaultContent/RightContent";
import RoomCard from "../../src/components/RoomCard";
import { COUNTRIES } from "../../src/utils/Countries";

export async function getStaticPaths(context: NextPageContext) {
  const paths = Object.keys(COUNTRIES.Portugal).map((district) => {
    const paths = (COUNTRIES.Portugal as any)[district].map((hall: string) => {
      return {
        params: {
          district: district.toLowerCase().replace(/ /g, "-"),
          hall: hall.toLowerCase().replace(/ /g, "-"),
        },
      };
    });
    return paths;
  });

  const finalPaths: any[] = [];

  paths.map((e) => finalPaths.push(...e));

  return {
    paths: finalPaths,
    fallback: false,
  };
}

type PageParams = {
  district: string;
  hall: string;
};

export async function getStaticProps({
  params,
}: GetStaticPropsContext<PageParams>) {
  const district = params?.district;
  const hall = params?.hall;

  const room = {
    images: ["/quarto.jpeg", "/quarto2.jpeg"],
    title: "Rua da Saudade 79A - Covilhã, Portugal",
    number: "5531984094790",
    price: "160",
    share_id: "YDK4Hj",
    expenses: true,
    free: true,
    description:
      "Loren ipsum dolor sit amet Loren ipsum dolor sit amet Loren ipsum dolor sit amet Loren ipsum dolor sit amet Loren ipsum dolor sit amet Loren ipsum dolor sit amet",
  };

  const rooms = Array(100).fill(room);

  return {
    props: {
      rooms,
      title:
        "Quartos em " +
        hall?.replace("-", " ") +
        " - " +
        district?.replace("-", " "),
    },
  };
}

interface Room {
  images: string[];
  title: string;
  description: string;
  number: string;
  share_id: string;
  price: string;
  free: boolean;
  expenses: boolean;
}

interface Props {
  rooms: Room[];
  title: string;
}

const SEOFind: NextPage<Props> = ({ rooms, title }) => {
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const formData = Object.fromEntries(form.entries());

    const res = await fetch("/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <ParentDefaultContent>
        <FullWContent>
          <Content title={title} boldTitle h1>
            <>
              <p>fdgsdgsfg</p>
              <br></br>
              <p>fdgsdgsfg</p>
              <br></br>
              <p>fdgsdgsfg</p>
              <br></br>
            </>
          </Content>
        </FullWContent>
        <div className="block lg:hidden">
          <FullWContent>
            <Content title="Filtros" boldTitle>
              <>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
              </>
            </Content>
          </FullWContent>
        </div>
        <LeftContent>
          {rooms &&
            rooms.map((room) => (
              <Content key={room.share_id!}>
                <RoomCard {...room} />
              </Content>
            ))}
        </LeftContent>
        <div className="hidden lg:block">
          <RightContent>
            <Content title="Filtros">
              <>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
                <p>fdgsdgsfg</p>
                <br></br>
              </>
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

export default SEOFind;
