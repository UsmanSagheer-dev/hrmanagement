import { useState, useRef } from "react";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type: "text" | "email" | "password" |'checkbox' ;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  placeholder, 
  type, 
  value, 
  onChange 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-full relative">
      <div className="relative">
        <input
          ref={inputRef}
          type={type === "password" && !showPassword ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(value !== "")}
          placeholder={placeholder}
          className={`w-full cursor-pointer bg-transparent text-white border border-[#E25319] p-2 rounded-[10px] outline-none ${
            label ? "pt-5" : ""
          }`}
        />
        {label && (
          <label
            className={`absolute left-2 text-[#E25319] transition-all duration-200 ease-in-out ${
              isFocused || value
                ? "top-0 text-xs -translate-y-1/2 bg-black px-1"
                : "top-[20px] -translate-y-1/2 text-sm"
            }`}
          >
            {label}
          </label>
        )}
        {type === "password" && (
          <button
            type="button"
            className="absolute cursor-pointer right-3 top-4 w-6 h-6  text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <BiHide size={24}/> : <BiShow size={24}/>}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;