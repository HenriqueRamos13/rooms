import type { NextPage, NextPageContext } from "next";
import { useEffect, useState } from "react";
import Checkbox from "../../src/components/Checkbox";
import Content from "../../src/components/Contents/DefaultContent/Content";
import FullWContent from "../../src/components/Contents/DefaultContent/FullWContent";
import LeftContent from "../../src/components/Contents/DefaultContent/LeftContent";
import ParentDefaultContent from "../../src/components/Contents/DefaultContent/ParentDefaultContent";
import InputLabel from "../../src/components/InputLabel";
import RoomCardEditable from "../../src/components/RoomCardEditable";
import TextArea from "../../src/components/TextArea";
import { classNames } from "../../src/utils/classNames";
import { useAuth } from "../../src/utils/contexts/Auth";

export async function getServerSideProps(context: NextPageContext) {
  const room = {
    images: ["/quarto.jpeg", "/quarto2.jpeg"],
    title: "Rua da Saudade 79A - Covilhã, Portugal",
    number: "5531984094790",
    whatsapp: "5531984094790",
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
  url: string;
  price: string;
  free: boolean;
  expenses: boolean;
}

interface Props {
  rooms: Room[];
}

// const Home: NextPage<Props> = ({ rooms: serverRooms }) => {
const Home: NextPage<Props> = ({}) => {
  const { token } = useAuth();
  // const [rooms, setRooms] = useState(serverRooms || []);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room_price, setRoom_price] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<boolean | null>(null);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const [number, setNumber] = useState<string | null>(null);
  const [room_description, setRoom_description] = useState<string | null>(null);
  const [free, setFree] = useState<boolean | null>(null);
  const [modal, setModal] = useState<any>(null);

  const getMyRooms = async () => {
    const res = await fetch("/api/room/my-rooms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setRooms(
      Object.assign(
        [],
        [
          ...data.data.rooms.map((room: any) => ({
            ...room,
            title: `${room.house.street}, ${room.house.neighborhood} - ${room.house.city}`,
            images: room.images
              .map((e: any) => e.url)
              .concat(room.house.images.map((e: any) => e.url)),
          })),
        ]
      )
    );
  };

  useEffect(() => {
    if (token) {
      getMyRooms();
    }
  }, [token]);

  const onEdit = async () => {
    const body = {
      id: modal.id,
      ...(room_price !== null && { price: room_price }),
      ...(expenses !== null && { expenses }),
      ...(whatsapp !== null && { whatsapp }),
      ...(number !== null && { number }),
      ...(room_description !== null && { description: room_description }),
      ...(free !== null && { free }),
    };

    const res = await fetch(`/api/room/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log(data);
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
            {/* <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-3">
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
            </div> */}
          </Content>
        </FullWContent>
        {/* <div className="block lg:hidden">
          <FullWContent>
            <Content title="Filtros" boldTitle>
              <></>
            </Content>
          </FullWContent>
        </div> */}
        <LeftContent>
          {rooms &&
            rooms.map((room) => (
              <Content key={room.url!}>
                <RoomCardEditable
                  id="1"
                  {...room}
                  onEdit={() =>
                    setModal({
                      ...room,
                    })
                  }
                />
              </Content>
            ))}
        </LeftContent>
        {/* <div className="hidden lg:block">
          <RightContent>
            <Content title="Filtros">
              <></>
            </Content>
          </RightContent>
        </div> */}
      </ParentDefaultContent>

      <div className={classNames("modal", modal ? "modal-open" : "")}>
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setModal(null)}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Editar quarto: {modal?.title}</h3>
          <div className="card flex-shrink-0 w-full bg-base-100">
            <div className="card-body">
              <InputLabel
                label="Valor do quarto"
                onChange={(v) => setRoom_price(Number(Number(v).toFixed(2)))}
                value={room_price?.toString() || modal?.price}
                type="number"
                description="O valor mensal do quarto. Exemplo: 165,00"
              />
              <TextArea
                label="Descrição"
                onChange={(v) => setRoom_description(v)}
                value={room_description || modal?.description}
                description="Um breve texto que o usuário poderá ver no anuncio do quarto."
              />
              <InputLabel
                label="Whatsapp de contato"
                onChange={(v) => {
                  setWhatsapp(v.slice(0, 12));
                }}
                value={whatsapp || modal?.whatsapp}
                description="Número de Whatsapp para contato por Whatsapp. Use apenas número incluido o código do país. Exemplo de número Português: 351999999999 (Informação pública para usuários)"
              />
              <InputLabel
                label="Número de contato"
                onChange={(v) => {
                  setNumber(v.slice(0, 12));
                }}
                value={number || modal?.number}
                description="Número de contato para contato por ligação. Use apenas número incluido o código do país. Exemplo de número Português: 351999999999 (Informação pública para usuários)"
              />
              <Checkbox
                full
                checked={expenses !== null ? expenses : modal?.expenses}
                label="Despesas incluídas?"
                onChange={() => setExpenses(!expenses)}
              />
              <Checkbox
                checked={free !== null ? free : modal?.free}
                label="Quarto vago?"
                onChange={(v) => setFree(!free)}
                full
              />
              <div className="form-control mt-6">
                <button className="btn btn-primary" onClick={onEdit}>
                  Salvar Edição
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
