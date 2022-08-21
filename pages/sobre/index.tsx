import type { NextPage, NextPageContext } from "next";
import Image from "next/image";
import { FormEvent } from "react";
import Content from "../../src/components/Contents/DefaultContent/Content";
import FullWContent from "../../src/components/Contents/DefaultContent/FullWContent";
import LeftContent from "../../src/components/Contents/DefaultContent/LeftContent";
import ParentDefaultContent from "../../src/components/Contents/DefaultContent/ParentDefaultContent";
import RightContent from "../../src/components/Contents/DefaultContent/RightContent";
import RoomCard from "../../src/components/RoomCard";
import { classNames } from "../../src/utils/classNames";

interface PropsTitle {
  children: string;
}

const Title: React.FC<PropsTitle> = ({ children }) => {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <h2 className="text-3xl font-bold text-black text-center max-w-[70%]">
        {children}
      </h2>
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

interface PropsSection {
  text: string;
  title: string;
  image: string;
  reverse?: boolean;
}

const Section: React.FC<PropsSection> = ({ text, title, image, reverse }) => {
  return (
    <div
      className={classNames(
        "w-full flex flex-row items-center flex-wrap-reverse gap-8 justify-evenly mb-[100px]",
        reverse ? "flex-row-reverse flex-wrap-reverse" : ""
      )}
    >
      <div className="w-full sm:w-[40%] flex flex-col items-center">
        <SubTitle>{title}</SubTitle>
        <p className="text-gray-800">{text}</p>
      </div>
      <div className="w-full sm:w-[40%]">
        <Image
          src={image}
          alt="post"
          layout="responsive"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
};

interface Props {}

const About: NextPage<Props> = ({}) => {
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
          <Content>
            <Title>Quem somos?</Title>
            <Section
              title="Uma plataforma para encontrar o seu quarto ideal"
              image="/easy-way-to-find-room.png"
              text={
                "Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet"
              }
            />
            <Section
              reverse
              title="Entre em contato com o arrendador de maneira fácil"
              image="/happy-found.png"
              text={
                "Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet"
              }
            />

            <Title>Como postar um quarto?</Title>
            <Section
              title="Formulário simples e intuítivo"
              image="/fill-form.png"
              text={
                "Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet"
              }
            />
            <Section
              reverse
              title="Veja quantos cliques e visualizações seu quarto teve"
              image="/report.png"
              text={
                "Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet"
              }
            />

            <Section
              title="Gerencie todos os seus quartos em um só lugar"
              image="/what-is-the-system.png"
              text={
                "Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet"
              }
            />
            <Section
              reverse
              title="Republicação automatica antes do quarto ficar vago"
              image="/automatic-repost.png"
              text={
                "Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet Lorem ipsun dolor sit amet loren ipsum dolor sit amet"
              }
            />

            <Title>
              Gostou da ideia? De uma olhada no nosso video de apresentação
            </Title>
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

export default About;
