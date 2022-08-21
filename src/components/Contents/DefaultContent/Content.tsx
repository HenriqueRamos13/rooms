import { classNames } from "../../../utils/classNames";
import Divider from "../../Divider";

interface Props {
  children: React.ReactNode;
  title?: string;
  boldTitle?: boolean;
}

const Content: React.FC<Props> = ({ children, title, boldTitle }) => {
  return (
    <section aria-labelledby={title}>
      {title && (
        <h2 className="sr-only" id={title}>
          {title}
        </h2>
      )}
      <div className="rounded-lg bg-white overflow-hidden shadow p-4">
        {title && (
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
