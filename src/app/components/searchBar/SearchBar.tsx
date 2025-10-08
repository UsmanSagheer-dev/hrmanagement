import React from "react";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  value?: string;
  onSearch?: (query: string) => void;
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
        className="text-[#A2A1A8CC] p-3 h-[50px] rounded-[10px] pl-10 pr-4 border border-[#A2A1A8CC] focus:outline-none focus:border-[#E25319] placeholder-[#A2A1A8CC] bg-transparent"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2">
        <CiSearch size={24} color="#A2A1A8CC" />
      </span>
    </div>
  );
}

export default SearchBar;