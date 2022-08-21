interface Props {
  children: React.ReactNode;
}

const LeftContent: React.FC<Props> = ({ children }) => {
  return <div className="grid grid-cols-1 gap-4 lg:col-span-2">{children}</div>;
};

export default LeftContent;
