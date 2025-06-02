import React from "react";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
        className="text-white p-2 h-[50px] rounded-[10px] pl-10 pr-4 border border-[#A2A1A81A] focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
      <span className="absolute left-3 top-[23px] transform -translate-y-1/2 text-gray-400">
        <CiSearch size={24} color="white" />
      </span>
    </div>
  );
}

export default SearchBar;
