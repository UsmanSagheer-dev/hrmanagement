import React, { useState } from "react";
import SearchBar from "../searchBar/SearchBar";
import Button from "../button/Button";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { useRouter } from "next/navigation";

interface EmployeeTableToolbarProps {
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

const EmployeeTableToolbar: React.FC<EmployeeTableToolbarProps> = ({
  onSearch,
  onFilter,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddEmployee = () => {
    router.push("/employee/add");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 w-full gap-4">
      <div className="w-full md:w-1/2 lg:w-1/3">
        <SearchBar value={searchQuery} onChange={handleSearch} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-center">
        <Button
          icon={IoIosAddCircleOutline}
          title="Add New Employee"
          onClick={handleAddEmployee}
          className="w-full sm:w-[221px] h-[50px] bg-[#E25319] flex items-center rounded-[10px] justify-center gap-2 cursor-pointer text-white hover:bg-[#c74615] transition-colors"
        />
        <Button
          icon={HiOutlineAdjustmentsHorizontal}
          title="Filter"
          onClick={onFilter}
          className="w-full sm:w-[117px] h-[50px] bg-transparent flex items-center rounded-[10px] justify-center gap-2 cursor-pointer border text-white border-[#A2A1A833] hover:bg-gray-800 transition-colors"
        />
      </div>
    </div>
  );
};

export default EmployeeTableToolbar;