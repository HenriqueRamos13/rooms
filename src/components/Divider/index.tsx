interface Props {
  children?: React.ReactNode;
}

const Divider: React.FC<Props> = ({ children }) => {
  return <div className="divider mt-0 pt-0">{children}</div>;
};

export default Divider;
