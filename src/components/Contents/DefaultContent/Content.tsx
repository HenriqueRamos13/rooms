import { classNames } from "../../../utils/classNames";
import Divider from "../../Divider";

interface Props {
  children: React.ReactNode;
  title?: string;
  boldTitle?: boolean;
  h1?: boolean;
}

const Content: React.FC<Props> = ({ children, title, boldTitle, h1 }) => {
  return (
    <section aria-labelledby={title}>
      {title && h1 ? (
        <h1 className="sr-only" id={title}>
          {title}
        </h1>
      ) : (
        <h2 className="sr-only" id={title}>
          {title}
        </h2>
      )}
      <div className="rounded-lg bg-white overflow-hidden shadow p-4">
        {title && h1 ? (
          <>
            <h1
              className={classNames(
                "p-0 m-0 text-black",
                boldTitle ? "font-bold text-2xl" : ""
              )}
            >
              {title}
            </h1>
            <Divider />
          </>
        ) : (
          <>
            <h2
              className={classNames(
                "p-0 m-0 text-black",
                boldTitle ? "font-bold text-2xl" : ""
              )}
            >
              {title}
            </h2>
            <Divider />
          </>
        )}
        <div>{children}</div>
      </div>
    </section>
  );
};

export default Content;
