import type { NextPage, NextPageContext } from "next";
import Image from "next/image";
import { FormEvent, useState } from "react";
import Content from "../../src/components/Contents/DefaultContent/Content";
import FullWContent from "../../src/components/Contents/DefaultContent/FullWContent";
import LeftContent from "../../src/components/Contents/DefaultContent/LeftContent";
import ParentDefaultContent from "../../src/components/Contents/DefaultContent/ParentDefaultContent";
import RightContent from "../../src/components/Contents/DefaultContent/RightContent";
import InputLabel from "../../src/components/InputLabel";
import RoomCard from "../../src/components/RoomCard";
import { classNames } from "../../src/utils/classNames";

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

interface Props {}

const PostRoom: NextPage<Props> = ({}) => {
  const [step, setStep] = useState<number>(0);
  const [steps, setSteps] = useState<{ name: string; title: string }[]>([
    { name: "Fazer login", title: "Crie uma conta ou faça login" },
    { name: "Escolher/Criar uma casa", title: "Crie ou escolha uma casa" },
    { name: "Cadastrar um quarto", title: "Cadastre seu quarto" },
    { name: "Efetuar pagamento", title: "Efetue o pagamento" },
  ]);

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

  const login = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "hhh@gmail.com",
      }),
    });
  };

  return (
    <>
      <ParentDefaultContent>
        <FullWContent>
          <button onClick={() => login()}>LOGIN</button>
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
                      <InputLabel
                        label="Título"
                        onChange={() => {}}
                        value=""
                        description="Título do quarto"
                      />
                    );
                  case 1:
                    return <p>b</p>;
                  case 2:
                    return <p>c</p>;
                  case 3:
                    return <p>d</p>;
                  default:
                    return <p>e</p>;
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
                disabled={step === steps.length - 1}
                onClick={() => handleStep(1)}
                className="btn btn-primary"
              >
                Próximo
              </button>
            </div>
          </Content>
        </FullWContent>
      </ParentDefaultContent>
      {/* <form onSubmit={onSubmit}>
        <input type="text" name="email" />
        <input type="text" name="nick" />
        <button type="submit">Submit</button>
      </form> */}
    </>
  );
};

export default PostRoom;
