import { classNames } from "../../utils/classNames";

interface Props {
  label: string;
  checked: boolean;
  full?: boolean;
  disabled?: boolean;
  onChange: (b: boolean) => void;
}

const Checkbox: React.FC<Props> = ({
  label,
  checked,
  onChange,
  full,
  disabled,
}) => {
  return (
    <div className="form-control mt-9">
      <label
        className={classNames(
          "label cursor-pointer",
          full ? "" : "max-w-[20px]"
        )}
      >
        {!full && <span className="label-text mr-3">{label}</span>}
        <input
          disabled={disabled}
          type="checkbox"
          checked={checked}
          className="checkbox checkbox-primary"
          onChange={(e) => onChange(e.target.checked)}
        />
        {full && (
          <span className="label-text text-start w-full ml-4">{label}</span>
        )}
      </label>
    </div>
  );
};

export default Checkbox;
