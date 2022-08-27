import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RoomInterface } from "../../../pages";
import { classNames } from "../../utils/classNames";
import Divider from "../Divider";
import WhatsappButton from "../WhatsappButton";
import { ToastContainer, toast } from "react-toastify";
import { URL } from "../../utils/URL";

interface Props extends RoomInterface {
  preview?: boolean;
  onClick?: () => void;
}

interface PropsBtn {
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}

export const ButtonImage: React.FC<PropsBtn> = ({
  onClick,
  className,
  children,
}) => {
  return (
    <button
      className={classNames(
        "w-[30px] h-[35px] bg-gray-400 rounded-full absolute bg-opacity-40 text-black",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const RoomCard: React.FC<Props> = ({
  description,
  expenses,
  images,
  number,
  whatsapp,
  price,
  url,
  title,
  size,
  free,
  preview,
  onClick,
}) => {
  const [showShareButton, setShowShareButton] = useState(false);
  // const [image, setImage] = useState<any>(images[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (
      window !== undefined &&
      window.navigator &&
      window.navigator.clipboard
    ) {
      setShowShareButton(true);
    }
  }, []);

  const slide = (v: number) => {
    if (index + v > images.length - 1) {
      const index = 0;
      // setImage(Object.assign("", images[index]));
      setIndex(index);
    } else if (index + v < 0) {
      const index = images.length - 1;
      // setImage(Object.assign("", images[index]));
      setIndex(images.length - 1);
    } else {
      // setImage(Object.assign("", images[index + v]));
      setIndex(index + v);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-1 md:gap-4 md:grid-cols-3">
      <div className="grid col-span-1 rounded-lg relative">
        {index > -1 && (
          <Image
            src={images[index]}
            alt={"Room " + index}
            layout="responsive"
            width={400}
            height={400}
            className="rounded-lg"
          />
        )}
        <ButtonImage
          className="top-[45%] left-0 rounded-l-lg flex flex-row items-center justify-center"
          onClick={() => slide(-1)}
        >
          <ChevronLeftIcon width={30} height={30} />
        </ButtonImage>
        <ButtonImage
          className="top-[45%] right-0 rounded-r-lg flex flex-row items-center justify-center"
          onClick={() => slide(+1)}
        >
          <ChevronRightIcon width={30} height={30} />
        </ButtonImage>
      </div>
      <div
        className={classNames(
          "grid col-span-2 py-2",
          preview ? "pointer-events-none" : ""
        )}
      >
        <div className="flex flex-col justify-between items-start">
          <div className="cursor-pointer">
            <div onClick={onClick} className="w-full">
              <div>
                <h2 className="text-black font-bold text-xl">{title}</h2>
                <Divider />
              </div>

              <p className="text-sm mb-2">{description.slice(0, 161)}</p>

              {/* <div className="w-full flex flex-row items-center">
                <b className="font-bold text-black mr-2">Status: </b>
                {free ? (
                  <p className="text-green-700">Vago</p>
                ) : (
                  <p className="text-red-700">Atualmente arrendado</p>
                )}
              </div> */}

              <div className="w-full flex flex-row items-center">
                <b className="font-bold text-black mr-2">Tamanho: </b>
                <p className="text-grey-800">
                  {size ? `${size} m²` : "Não informado"}
                </p>
              </div>

              <div className="w-full flex flex-row items-center p-2 py-2">
                <b className="font-bold text-black text-2xl">€{price}</b>
                <p className="text-gray-700">/mês {expenses && "+ despesas"}</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-row">
              {/* <button className="border rounded-md p-2">
                <HeartIcon width={30} height={30} />
              </button> */}
              <div className="w-[6px]"></div>
              {showShareButton && (
                <button
                  className="border rounded-md p-2"
                  onClick={() => {
                    window.navigator.clipboard.writeText(
                      `${window.location.href}/quarto/${url}`
                    );
                    toast("Link do quarto copiado com sucesso!", {
                      type: "success",
                      position: "bottom-center",
                    });
                  }}
                >
                  <ShareIcon width={30} height={30} />
                </button>
              )}
            </div>

            {whatsapp ? (
              <WhatsappButton number={whatsapp} url={`${URL}/quarto/${url}`} />
            ) : (
              <p>
                Número de contato: <b>{number}</b>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
