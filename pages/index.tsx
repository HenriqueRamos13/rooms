import type { NextPage, NextPageContext } from "next";
import { FormEvent } from "react";
import Content from "../src/components/Contents/DefaultContent/Content";
import FullWContent from "../src/components/Contents/DefaultContent/FullWContent";
import LeftContent from "../src/components/Contents/DefaultContent/LeftContent";
import ParentDefaultContent from "../src/components/Contents/DefaultContent/ParentDefaultContent";
import RightContent from "../src/components/Contents/DefaultContent/RightContent";
import RoomCard from "../src/components/RoomCard";

export async function getServerSideProps(context: NextPageContext) {
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
}

const Home: NextPage<Props> = ({ rooms }) => {
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
      <ParentDefaultContent>
        <FullWContent>
          <Content title="Quartos em Covilhã - Portugal" boldTitle>
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

export default Home;
