interface Props {
  children: React.ReactNode;
}

const FullWContent: React.FC<Props> = ({ children }) => {
  return <div className="grid lg:col-span-3">{children}</div>;
};

export default FullWContent;
