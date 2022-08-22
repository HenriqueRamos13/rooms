import type { NextPage, NextPageContext } from "next";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import Content from "../../src/components/Contents/DefaultContent/Content";
import FullWContent from "../../src/components/Contents/DefaultContent/FullWContent";
import LeftContent from "../../src/components/Contents/DefaultContent/LeftContent";
import ParentDefaultContent from "../../src/components/Contents/DefaultContent/ParentDefaultContent";
import RightContent from "../../src/components/Contents/DefaultContent/RightContent";
import InputLabel from "../../src/components/InputLabel";
import RoomCard from "../../src/components/RoomCard";
import { classNames } from "../../src/utils/classNames";
import * as jwt from "jsonwebtoken";
import { useAuth } from "../../src/utils/contexts/Auth";
import Select from "../../src/components/Select";
import { COUNTRIES } from "../../src/utils/Countries";
import UploadFiles from "../../src/components/UploadFiles";
import Checkbox from "../../src/components/Checkbox";
import TextArea from "../../src/components/TextArea";
import { BENEFITS } from "../../src/utils/benefits";
import { prisma } from "../../src/utils/lib/prisma";

export async function getServerSideProps(context: NextPageContext) {
  const {
    query: { token },
  } = context;

  const user = await prisma.user.findFirst({
    where: {
      access_token: token as string,
    },
  });

  if (!user) {
    return {
      props: {},
    };
  }

  if (new Date(user?.token_expires as Date).getTime() < new Date().getTime()) {
    return {
      props: {},
    };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token_expires: null,
      access_token: null,
    },
  });

  return {
    props: {
      token: jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT as string,
        {
          expiresIn: "30d",
        }
      ),
      user: {
        name: user.name,
      },
    },
  };
}

interface PropsTitle {
  children: string;
}

const Title: React.FC<PropsTitle> = ({ children }) => {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <h1 className="text-3xl font-bold text-black text-center max-w-[70%]">
        {children}
      </h1>
    </div>
  );
};

const SubTitle: React.FC<PropsTitle> = ({ children }) => {
  return (
    <div className="w-full flex items-center justify-center py-8 max-w-[70%]">
      <h2 className="text-2xl font-bold text-gray-500 text-center">
        {children}
      </h2>
    </div>
  );
};

interface PropsCenterItem {
  children: React.ReactNode;
}

const CenterItem: React.FC<PropsCenterItem> = ({ children }) => {
  return (
    <div className="w-full flex items-center justify-center my-4">
      {children}
    </div>
  );
};

interface Props {
  user?: {
    name: string;
  };
  token?: string;
}

const PostRoom: NextPage<Props> = ({ user, token }) => {
  const [houseImages, setHouseImages] = useState<any[]>([]);
  const [roomImages, setRoomImages] = useState<any[]>([]);
  const [home_name, setHome_name] = useState("");
  const [country, setCountry] = useState("Portugal");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [street, setStreet] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [room_name, setRoom_name] = useState("");
  const [room_description, setRoom_description] = useState("");
  const [room_price, setRoom_price] = useState<number>(0);
  const [expenses, setExpenses] = useState(false);
  const [room_size, setRoom_size] = useState<number>(0);
  const [step, setStep] = useState<number>(0);
  const [duration, setDuration] = useState<number>(1);
  const [whatsapp, setWhatsapp] = useState("");
  const [steps, setSteps] = useState<{ name: string; title: string }[]>([
    { name: "Fazer login", title: "Crie uma conta ou faça login" },
    { name: "Escolher/Criar uma casa", title: "Crie ou escolha uma casa" },
    { name: "Cadastrar um quarto", title: "Cadastre seu quarto" },
    { name: "Efetuar pagamento", title: "Efetue o pagamento" },
  ]);
  const { setUser, setToken, user: userContext } = useAuth();

  useEffect(() => {
    if (user && token) {
      setUser(user);
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (userContext) {
      setStep(1);
    } else {
      setStep(0);
    }
  }, [userContext]);

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

  const handleStep = (v: number) => {
    if (step + v < 0 || step + v > steps.length - 1) return;

    setStep(step + v);
  };

  return (
    <>
      <ParentDefaultContent>
        <FullWContent>
          <Content>
            <Title>Publicar um quarto</Title>
            <CenterItem>
              <p className="text-center max-w-[70%]">
                Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem
                ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
                dolor sit amet Lorem ipsum dolor sit amet
              </p>
            </CenterItem>
            <CenterItem>
              <ul className="steps">
                {steps.map((e, i) => (
                  <li
                    key={i}
                    className={classNames(
                      "step",
                      step >= i ? "step-primary" : ""
                    )}
                  >
                    {e.name}
                  </li>
                ))}
              </ul>
            </CenterItem>
            <div className="w-full py-16">
              {(() => {
                switch (step) {
                  case 0:
                    return (
                      <div className="w-full flex items-center justify-center">
                        {!userContext && (
                          <p className="text-gray-800 text-xl">
                            Clique no botão de registro ou inicio de sessão
                            localizado no topo da página para continuar.
                          </p>
                        )}
                      </div>
                    );
                  case 1:
                    return (
                      <div className="grid gird-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Select
                          label="Selecione uma casa"
                          onChange={() => {}}
                          value=""
                          description="Seleciona uma das casas já cadastradas para cadastrar um novo quarto."
                        >
                          <option value="">Selecione uma casa</option>
                        </Select>
                        <div className="divider col-span-full font-bold">
                          Ou cadastre uma nova casa
                        </div>
                        <InputLabel
                          label="Nome da Casa"
                          onChange={(v) => setHome_name(v)}
                          value={home_name}
                          description="Este é apenas um nome fictício, para que você identifique a casa depois. Os usuários não irão ver isso."
                        />

                        <Select
                          label="País"
                          onChange={(v) => setCountry(v)}
                          value={country}
                          description="País em que a casa está localizada."
                        >
                          <option value="Portugal">Portugal</option>
                        </Select>
                        <Select
                          label="Distrito"
                          onChange={(v) => setCity(v)}
                          value={city}
                          description="Distrito em que a casa está localizada."
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
                          description='Região ou bairro em que a casa está localizada. Por exemplo: "Alameda", "Covilhã"'
                        >
                          <option value="">Selecione uma região</option>
                          {(COUNTRIES.Portugal as any)[city]?.map(
                            (e: string) => (
                              <option key={e} value={e}>
                                {e}
                              </option>
                            )
                          )}
                        </Select>
                        <InputLabel
                          label="Rua/Avenida"
                          onChange={(v) => setStreet(v)}
                          value={street}
                          description="Rua/Av. em que a casa está localizada. Pode conter o número da casa também."
                        />
                        <div />

                        <UploadFiles
                          setImages={(e) =>
                            setHouseImages(Object.assign([], [...e]))
                          }
                          images={houseImages}
                          obsText="(Apenas as imagens da casa como cozinha, banheiro, sala ... As
                            fotos do quarto serão colocadas depois)"
                        />
                      </div>
                    );
                  case 2:
                    return (
                      <div className="grid gird-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <InputLabel
                          label="Nome do Quarto"
                          onChange={(v) => setRoom_name(v)}
                          value={room_name}
                          description="Este é apenas um nome fictício, para que você identifique o quarto depois. Os usuários não irão ver isso."
                        />
                        <InputLabel
                          label="Valor do quarto"
                          onChange={(v) =>
                            setRoom_price(Number(Number(v).toFixed(2)))
                          }
                          value={room_price.toString()}
                          type="number"
                          description="O valor mensal do quarto. Exemplo: 165,00"
                        />
                        <InputLabel
                          label="Tamanho do quarto (em metros quadrados)"
                          onChange={(v) =>
                            setRoom_size(Number(Number(v).toFixed(2)))
                          }
                          value={room_size.toString()}
                          description="Tamanho do quarto em metros quadrados. Exemplo: 20"
                        />
                        <TextArea
                          label="Descrição"
                          onChange={(v) => setRoom_description(v)}
                          value={room_description}
                          description="Um breve texto que o usuário poderá ver no anuncio do quarto."
                        />

                        <InputLabel
                          label="Whatsapp de contato"
                          onChange={(v) => {
                            setWhatsapp(v.slice(0, 12));
                          }}
                          value={whatsapp}
                          description="Número de Whatsapp para contato por Whatsapp. Use apenas número incluido o código do país. Exemplo de número Português: 351999999999 (Informação pública para usuários)"
                        />

                        <InputLabel
                          label="Número de contato"
                          onChange={(v) => {
                            setWhatsapp(v.slice(0, 12));
                          }}
                          value={whatsapp}
                          description="Número de contato para contato por ligação. Use apenas número incluido o código do país. Exemplo de número Português: 351999999999 (Informação pública para usuários)"
                        />

                        <Checkbox
                          checked={expenses}
                          label="Despesas incluídas?"
                          onChange={() => {
                            if (expenses) {
                              setBenefits(
                                Object.assign([], [...benefits, "26"])
                              );
                            } else {
                              setBenefits(
                                Object.assign(
                                  [],
                                  [...benefits.filter((f) => f !== "26")]
                                )
                              );
                            }
                            setExpenses(!expenses);
                          }}
                        />
                        <div />
                        <div className="col-span-full">
                          <div className="grid gap-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
                            <h2 className="text-gray-800 text-xl col-span-full">
                              Diferenciais:
                            </h2>
                            {BENEFITS.map((e) => (
                              <div
                                key={e.id}
                                className={classNames(
                                  "badge cursor-pointer badge-lg",
                                  benefits.indexOf(e.id) > -1
                                    ? "badge-success"
                                    : ""
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
                                    setBenefits(
                                      Object.assign([], [...benefits, e.id])
                                    );
                                  }
                                }}
                              >
                                {e.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        <UploadFiles
                          setImages={(e) =>
                            setRoomImages(Object.assign([], [...e]))
                          }
                          images={roomImages}
                          obsText="(Apenas as imagens do quarto ou complementos dele como banheiro, varanda, vista da janela.)"
                        />
                      </div>
                    );
                  case 3:
                    return (
                      <div className="col-span-full">
                        <div className="w-full flex flex-col items-center justify-between">
                          <h2 className="text-3xl text-gray-800 my-4">
                            Seu anuncio está pronto!
                          </h2>
                          <p className="text-xl text-gray-500 my-4">
                            As pessoas irão ver seu anuncio desta forma em nosso
                            site:
                          </p>
                          <div className="h-auto md:h-[290px] w-ful lg:w-[70%] shadow-xl p-4 my-4">
                            <RoomCard
                              description={room_description}
                              expenses={expenses}
                              images={[
                                ...roomImages.map((e) => e.objectURL),
                                ...houseImages.map((e) => e.objectURL),
                              ]}
                              free
                              price={room_price.toString()}
                              number={whatsapp || ""}
                              share_id="123"
                              title={`${street}, ${neighborhood} - ${city}, ${country}`}
                              preview={true}
                            />
                          </div>
                          <Select
                            label="Por quanto tempo quer que o quarto fique publicado no site?"
                            onChange={(v) => setDuration(Number(v))}
                            value={duration.toString()}
                          >
                            <option value="1">1 Ano</option>
                            <option value="2">2 Anos</option>
                          </Select>
                          <h2 className="text-2xl text-gray-800 my-4 font-bold">
                            Valor final:{" "}
                            {(() => {
                              if (duration === 1) {
                                return Intl.NumberFormat("pt-PT", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(60);
                              } else if (duration === 2) {
                                return Intl.NumberFormat("pt-PT", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(100);
                              } else {
                                return Intl.NumberFormat("pt-PT", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(150);
                              }
                            })()}{" "}
                          </h2>
                          <button className="btn btn-primary my-4">
                            Pagar com Stripe
                          </button>
                        </div>
                      </div>
                    );
                }
              })()}
            </div>
            <div className="w-full flex flex-row items-center justify-end">
              {step > 1 && (
                <button
                  onClick={() => handleStep(-1)}
                  className="btn btn-ghost mr-2"
                >
                  Voltar
                </button>
              )}

              <button
                disabled={
                  (step === 0 && !userContext) ||
                  step === steps.length - 1 ||
                  (step === 2 &&
                    (roomImages.length === 0 ||
                      houseImages.length === 0 ||
                      street.trim().length === 0 ||
                      room_price <= 0))
                }
                // disabled={
                //   step === steps.length - 1 ||
                //   (step === 2 &&
                //     (roomImages.length === 0 ||
                //       houseImages.length === 0 ||
                //       street.trim().length === 0 ||
                //       room_price <= 0))
                // }
                onClick={() => handleStep(1)}
                className="btn btn-primary"
              >
                Próximo
              </button>
            </div>
          </Content>
        </FullWContent>
      </ParentDefaultContent>
    </>
  );
};

export default PostRoom;
