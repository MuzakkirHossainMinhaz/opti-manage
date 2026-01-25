import { Input } from "antd";
import { Controller } from "react-hook-form";

// props interface
interface IInputProps {
  type: string;
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

const MyInput = ({ type, name, label, required, placeholder }: IInputProps) => {
  return (
    <div
      className="my-font"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%",
      }}
    >
      <label style={{ fontSize: "15px", fontWeight: "600" }} htmlFor={name}>
        {label ? label : ""} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <Controller
        name={name}
        render={({ field }) => (
          <Input
            className="my-font"
            {...field}
            placeholder={placeholder ? placeholder : `Type ${name}`}
            type={type}
            id={name}
            style={{ padding: "6px 8px" }}
            required={required}
          />
        )}
      />
    </div>
  );
};

export default MyInput;
