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
import { toast } from "react-toastify";
import { RoomInterface } from "..";

const Home: NextPage = ({}) => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [room_price, setRoom_price] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<boolean | null>(null);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const [number, setNumber] = useState<string | null>(null);
  const [room_description, setRoom_description] = useState<string | null>(null);
  const [free, setFree] = useState<boolean | null>(null);
  const [modal, setModal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);

    const res = await fetch(`/api/room/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    setLoading(false);

    const data = await res.json();

    if (data.message) {
      toast(data.message, {
        type: "warning",
      });
    } else {
      toast("Quarto editado com sucesso!", {
        type: "success",
      });
      getMyRooms();
      setModal(null);
    }
  };

  return (
    <>
      <ParentDefaultContent>
        <FullWContent>
          <Content
            title={`Meus quartos publicados (${rooms.length} quartos)`}
            boldTitle
            h1
          >
            <p>
              Aqui voc?? pode visualizar seus quartos, quantas vezes cada um foi
              clicado e pode edita-los tamb??m.
            </p>
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
                label="Regi??o/Bairro/Concelho"
                onChange={(v) => setNeighborhood(v)}
                value={neighborhood}
              >
                <option value="">Selecione uma regi??o</option>
                {(COUNTRIES.Portugal as any)[city]?.map((e: string) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </Select>
              <Select label="Pa??s" onChange={(v) => {}} value="Portugal">
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
            ???
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
                label="Descri????o"
                onChange={(v) => setRoom_description(v)}
                value={room_description || modal?.description}
                description="Um breve texto que o usu??rio poder?? ver no anuncio do quarto."
              />
              <InputLabel
                label="Whatsapp de contato"
                onChange={(v) => {
                  setWhatsapp(v.slice(0, 12));
                }}
                value={whatsapp || modal?.whatsapp}
                description="N??mero de Whatsapp para contato por Whatsapp. Use apenas n??mero incluido o c??digo do pa??s. Exemplo de n??mero Portugu??s: 351999999999 (Informa????o p??blica para usu??rios)"
              />
              <InputLabel
                label="N??mero de contato"
                onChange={(v) => {
                  setNumber(v.slice(0, 12));
                }}
                value={number || modal?.number}
                description="N??mero de contato para contato por liga????o. Use apenas n??mero incluido o c??digo do pa??s. Exemplo de n??mero Portugu??s: 351999999999 (Informa????o p??blica para usu??rios)"
              />
              <Checkbox
                full
                checked={expenses !== null ? expenses : modal?.expenses}
                label="Despesas inclu??das?"
                onChange={() => setExpenses(!expenses)}
              />
              <Checkbox
                checked={free !== null ? free : modal?.free}
                label="Quarto vago?"
                onChange={(v) => setFree(!free)}
                full
              />
              <div className="form-control mt-6">
                <button
                  disabled={loading}
                  className="btn btn-primary"
                  onClick={onEdit}
                >
                  {loading ? (
                    <progress className="progress progress-info w-56"></progress>
                  ) : (
                    "Salvar Edi????o"
                  )}
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
