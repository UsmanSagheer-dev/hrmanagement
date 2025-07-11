"use client";
import { useState, useRef } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsCalendar } from "react-icons/bs";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type: "text" | "email" | "password" | "checkbox" | "select" | "date" | "file";
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  name?: string;
  required?: boolean;
  className?: string;
  accept?: string;
  multiple?: boolean;
  onFileChange?: (files: FileList) => void;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  options = [],
  name,
  required = false,
  className = "",
  accept,
  multiple,
  onFileChange,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFileChange) {
      onFileChange(e.target.files);
      onChange(e.target.files[0]?.name || "");
    }
  };

  const getTestId = () => {
    return label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : `input-${type}`;
  };

  const renderInput = () => {
    const baseClasses = `w-full cursor-pointer text-[#A2A1A8CC] border border-[#A2A1A8CC] p-3 rounded-[10px] outline-none focus:border-[#E25319] placeholder-[#A2A1A8CC] bg-transparent ${className}`;

    switch (type) {
      case "password":
        return (
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(value !== "")}
              placeholder={placeholder}
              name={name}
              required={required}
              disabled={disabled}
              className={baseClasses}
              data-testid={getTestId()}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A2A1A8CC] hover:text-[#E25319]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BiHide size={24} /> : <BiShow size={24} />}
            </button>
          </div>
        );

      case "select":
        return (
          <div className="relative">
            <select
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(value !== "")}
              name={name}
              required={required}
              disabled={disabled}
              className={`${baseClasses} appearance-none`}
              data-testid={getTestId()}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <MdKeyboardArrowDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A2A1A8CC]"
              size={20}
            />
          </div>
        );

      case "date":
        return (
          <div className="relative">
            <input
              ref={inputRef}
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(value !== "")}
              placeholder={placeholder}
              name={name}
              required={required}
              disabled={disabled}
              className={baseClasses}
              data-testid={getTestId()}
            />
            <BsCalendar
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A2A1A8CC]"
              size={18}
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="checkbox"
              checked={value === "true"}
              onChange={(e) => onChange(e.target.checked ? "true" : "false")}
              name={name}
              required={required}
              disabled={disabled}
              className="w-4 h-4 accent-[#E25319] cursor-pointer"
              data-testid={getTestId()}
            />
            {placeholder && (
              <span className="ml-2 text-[#A2A1A8CC]">{placeholder}</span>
            )}
          </div>
        );

      case "file":
        return (
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept={accept}
              multiple={multiple}
              name={name}
              required={required}
              disabled={disabled}
              className={`${baseClasses} opacity-0 absolute w-full h-full top-0 left-0`}
              data-testid={getTestId()}
            />
            <input
              type="text"
              value={value || placeholder || ""}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(value !== "")}
              placeholder={placeholder}
              readOnly
              className={`${baseClasses} cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
              data-testid={`${getTestId()}-display`}
            />
          </div>
        );

      default:
        return (
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(value !== "")}
            placeholder={placeholder}
            name={name}
            required={required}
            disabled={disabled}
            className={baseClasses}
            data-testid={getTestId()}
          />
        );
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="relative">
        {renderInput()}
        {label && type !== "checkbox" && (
          <label
            className={`absolute left-2 text-[#E25319] transition-all duration-300 ease-in-out pointer-events-none ${
              isFocused || value
                ? "top-0 text-xs -translate-y-1/2 bg-black px-1"
                : "top-4 text-sm"
            }`}
          >
            {label}
          </label>
        )}
      </div>
    </div>
  );
};

export default InputField;