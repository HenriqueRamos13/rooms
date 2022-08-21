interface Props {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  description?: string;
  step?: number;
  disabled?: boolean;
  onChange: (v: string) => void;
}

const InputLabel: React.FC<Props> = ({
  label,
  value,
  placeholder,
  type,
  onChange,
  disabled,
  step,
  description,
}) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        disabled={disabled}
        type={type || "text"}
        placeholder={placeholder}
        className="input input-bordered w-full max-w-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
      />
      <label className="label">
        <span className="label-text text-gray-500 text-xs">{description}</span>
      </label>
    </div>
  );
};

export default InputLabel;
