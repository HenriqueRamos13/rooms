interface Props {
  children: React.ReactNode;
}

const ParentDefaultContent: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
      {children}
    </div>
  );
};

export default ParentDefaultContent;
