import { HeartIcon, ShareIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useState } from "react";
import { classNames } from "../../utils/classNames";
import Divider from "../Divider";
import WhatsappButton from "../WhatsappButton";

interface Props {
  id: string;
  images: string[];
  title: string;
  description: string;
  number: string;
  url: string;
  price: string;
  expenses: boolean;
  free: boolean;
  preview?: boolean;
  onEdit: () => void;
}

interface PropsBtn {
  onClick: () => void;

  className: string;
  children: React.ReactNode;
}

const ButtonImage: React.FC<PropsBtn> = ({ onClick, className, children }) => {
  return (
    <button
      className={classNames(
        "w-[30px] h-[30px] bg-gray-300 rounded-full absolute bg-opacity-40 text-black",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const RoomCardEditable: React.FC<Props> = ({
  id,
  description,
  expenses: expensesProp,
  images,
  number,
  price: priceProp,
  url,
  title,
  free: freeProp,
  preview,
  onEdit,
}) => {
  const [image, setImage] = useState(images[0]);
  const [index, setIndex] = useState(0);
  const [price, setPrice] = useState(priceProp);
  const [free, setFree] = useState(freeProp);
  const [expenses, setExpenses] = useState(expensesProp);

  const slide = (v: number) => {
    if (index + v > images.length - 1) {
      const index = 0;
      setImage(images[index]);
      setIndex(index);
    } else if (index + v < 0) {
      const index = images.length - 1;
      setImage(images[index]);
      setIndex(images.length - 1);
    } else {
      setImage(images[index + v]);
      setIndex(index + v);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-1 md:gap-4 md:grid-cols-3">
      <div className="grid col-span-1 rounded-lg relative">
        {image && (
          <Image
            src={image}
            alt="Room 1"
            layout="responsive"
            width={400}
            height={400}
            className="rounded-lg"
          />
        )}
        <ButtonImage className="top-[45%] left-2" onClick={() => slide(-1)}>
          &lt;
        </ButtonImage>
        <ButtonImage className="top-[45%] right-2" onClick={() => slide(+1)}>
          &gt;
        </ButtonImage>
      </div>
      <div className={classNames("grid col-span-2 py-2")}>
        <div className="flex flex-col justify-between items-start">
          <div className="cursor-pointer">
            <div>
              <h2 className="text-black font-bold text-xl">{title}</h2>
              <Divider />
            </div>

            <p className="text-sm mb-2">{description.slice(0, 161)}</p>
            <div className="w-full flex flex-row items-center">
              <b className="font-bold text-black mr-2">Status: </b>
              {free ? (
                <p className="text-green-700">Vago</p>
              ) : (
                <p className="text-red-700">Vago em 2 meses</p>
              )}
            </div>

            <div className="w-full flex flex-row items-center p-2 py-2">
              <b className="font-bold text-black text-2xl">€{price}</b>
              <p className="text-gray-700">/mês {expenses && "+ despesas"}</p>
            </div>
          </div>
          <div className="w-full flex flex-row items-center justify-between">
            <button className="btn btn-info text-white" onClick={onEdit}>
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCardEditable;