interface Props {
  children: React.ReactNode;
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  description?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}

const Select: React.FC<Props> = ({
  children,
  label,
  value,
  onChange,
  disabled,
  description,
}) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className="select select-bordered"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {children}
      </select>
      <span className="label-text text-gray-500 text-xs">{description}</span>
    </div>
  );
};

export default Select;
