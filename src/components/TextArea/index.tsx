interface Props {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  description?: string;
}

const TextArea: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onChange,
  disabled,
  description,
}) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        disabled={disabled}
        placeholder={placeholder}
        className="textarea textarea-bordered h-24"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
      <span className="label-text text-gray-500 text-xs">{description}</span>
    </div>
  );
};

export default TextArea;
