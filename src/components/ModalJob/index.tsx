import { Job } from "@prisma/client";
import { classNames } from "../../utils/classNames";
import { useLanguage } from "../../utils/contexts/Language";

interface Props extends Job {
  open: boolean;
  preview?: boolean;
  applied?: () => void;
  close?: () => void;
}

const ModalJob: React.FC<Props> = ({
  open,
  preview,
  close,
  company_name,
  position,
  description,
  apply_email,
  apply_url,
  how_to_apply,
  applied,
}) => {
  const { texts } = useLanguage();

  const { modalDescription, modalHowApply, and, or, applyNow } = texts;

  return (
    <div
      className={classNames(
        !preview ? "modal" : "",
        open && !preview ? "modal-open" : ""
      )}
    >
      <div
        className={classNames(
          "modal-box relative",
          preview
            ? "w-full min-w-[90vw] md:min-w-[460px] lg:min-w-[500px]"
            : "min-w-[50%]"
        )}
      >
        {!preview && (
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => close && close()}
          >
            ✕
          </label>
        )}
        <article className="prose">
          <h2 className="">{company_name || "Company Name"}</h2>
          <h4 className="">{position || "Software Developer"}</h4>
        </article>
        <div className="divider"></div>
        <article className="prose">
          <b className="py-4">{modalDescription}</b>
        </article>
        <p className="text-sm">
          {description || "Your description goes here."}
        </p>
        <article className="prose pt-4">
          <b>{modalHowApply}</b>
        </article>
        <p className="pb-4">{how_to_apply || "Your how to apply goes here."}</p>
        {apply_email && (
          <>
            <b>Email to apply: {apply_email}</b>
            <div className="divider">{or}</div>
          </>
        )}
        <div className="w-full flex flex-col items-center">
          {preview ? (
            <button className="btn btn-block btn-primary">{applyNow}</button>
          ) : (
            <a
              href={apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-block btn-primary"
              onClick={() => applied && applied()}
            >
              {applyNow}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalJob;
