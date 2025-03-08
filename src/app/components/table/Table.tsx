import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchBar from "../searchBar/SearchBar";
import Button from "../button/Button";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { BiShow } from "react-icons/bi";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

export interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  type: string;
  status: string;
  image?: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onAddEmployee?: () => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onView?: (employee: Employee) => void;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  initialRecordsPerPage?: number;
  totalRecords?: number;
}

const Table: React.FC<EmployeeTableProps> = ({
  
  employees,

  onSearch,
  initialRecordsPerPage = 10,
  totalRecords = 0,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(initialRecordsPerPage);
  const [searchQuery, setSearchQuery] = useState("");

  const actualTotalRecords = totalRecords > 0 ? totalRecords : employees.length;
  const totalPages = Math.ceil(actualTotalRecords / recordsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleAddEmployee = () => {
    router.push("/addNewEmployee");
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, actualTotalRecords);
  const handleRecordsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRecordsPerPage = Number(e.target.value);
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(1);
  };
  return (
    <div className="bg-transparent text-white p-4 min-h-screen ">
      <div className="max-w-7xl mx-auto hide-scrollbar">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <SearchBar />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Button
              icon={IoIosAddCircleOutline}
              title="Add New Employee"
              onClick={handleAddEmployee}
              className="w-[221px] h-[50px] bg-[#E25319] flex items-center rounded-[10px] justify-center gap-2 cursor-pointer"
            />
            <Button
              icon={HiOutlineAdjustmentsHorizontal}
              title="Filter"
              className="w-[117px] h-[50px] bg-transparent flex items-center rounded-[10px] justify-center gap-2 cursor-pointer border border-[#A2A1A833]"
            />
          </div>
        </div>

        <div className="overflow-x-hide hide-scrollbar">
          <table className="w-full text-sm text-left overflow-auto hide-scrollbar">
            <thead className="text-white border-b border-gray-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-[16px] font-light ">
                  Employee Name
                </th>
                <th scope="col" className="px-4 py-3 text-[16px] font-light">
                  Employee ID
                </th>
                <th scope="col" className="px-4 py-3 text-[16px] font-light">
                  Department
                </th>
                <th scope="col" className="px-4 py-3 text-[16px] font-light">
                  Designation
                </th>
                <th scope="col" className="px-4 py-3 text-[16px] font-light">
                  Type
                </th>
                <th scope="col" className="px-4 py-3 text-[16px] font-light">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-[16px] font-light">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((employee, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="px-4 py-3 flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 mr-2">
                      {employee.image ? (
                        <Image
                          src={employee.image}
                          alt={employee.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-[16px] font-light ">
                          {employee.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {employee.name}
                  </td>
                  <td className="px-4 py-3 text-[16px] font-light ">
                    {employee.id}
                  </td>
                  <td className="px-4 py-3 text-[16px] font-light ">
                    {employee.department}
                  </td>
                  <td className="px-4 py-3 text-[16px] font-light ">
                    {employee.designation}
                  </td>
                  <td className="px-4 py-3 text-[16px] font-light ">
                    {employee.type}
                  </td>
                  <td className="px-4 py-3 text-[16px] font-light  ">
                    <span className="text-orange-500 bg-[#E253191A] p-1 rounded-[4px] text-[16px] font-light ">
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button icon={BiShow} className="bg-transparent" />
                      <Button icon={RiEdit2Line} className="bg-transparent" />
                      <Button
                        icon={RiDeleteBin5Line}
                        className="bg-transparent"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
          <div className="mb-4 sm:mb-0">
            <span className="text-gray-400">Showing</span>
            <select 
              className="mx-2 bg-gray-900 border border-gray-700 rounded px-2 py-1"
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-gray-400">records per page</span>
          </div>
          <h1 className="text-gray-400">
            Showing {startIndex + 1} to {endIndex} out of {actualTotalRecords} records
          </h1>
          <div className="flex space-x-1">
            <Button 
              icon={IoChevronBackOutline}
              className={`px-3 py-1 rounded hover:bg-gray-800 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            />
            
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = currentPage > 3 && totalPages > 5
                ? currentPage - 3 + i + (currentPage > totalPages - 2 ? totalPages - currentPage - 2 : 0)
                : i + 1;
              
              if (pageNum <= totalPages) {
                return (
                  <Button
                    key={i}
                    title={pageNum.toString()}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum ? 'bg-transparent border border-amber-600' : 'hover:bg-gray-800'
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  />
                );
              }
              return null;
            })}
            
            <Button
              icon={IoChevronForwardOutline}
              className={`px-3 py-1 rounded hover:bg-gray-800 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            />
          </div>
        </div>
      </div>
    </div>
   
  );
};
export default Table;
