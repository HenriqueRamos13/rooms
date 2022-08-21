interface Props {
  children: React.ReactNode;
}

const RightContent: React.FC<Props> = ({ children }) => {
  return <div className="grid grid-cols-1 gap-4">{children}</div>;
};

export default RightContent;
