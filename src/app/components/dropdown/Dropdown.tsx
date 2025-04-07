import React from "react";

interface DropdownProps {
  label: string;
  description: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  description,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-700">
      <div>
        <h3 className="text-white font-semibold">{label}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#A2A1A81A] text-white rounded-[10px] py-2 px-[10px] focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-black text-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
