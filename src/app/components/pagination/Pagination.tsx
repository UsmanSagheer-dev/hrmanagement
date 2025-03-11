import Button from "../button/Button";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface PaginationProps {
  currentPage: number;
  recordsPerPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (recordsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  recordsPerPage,
  totalRecords,
  onPageChange,
  onRecordsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-white">
      <div className="mb-4 sm:mb-0">
        <span className="text-white">Showing</span>
        <select
          className="mx-2 border bg-black border-gray-700 rounded px-2 py-1 text-white"
          value={recordsPerPage}
          onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <span className="text-white">records per page</span>
      </div>
      <h1 className="text-white">
        Showing {startIndex + 1} to {endIndex} out of {totalRecords} records
      </h1>
      <div className="flex space-x-1">
        <Button
          icon={IoChevronBackOutline}
          className={`px-3 py-1 rounded text-white hover:bg-gray-800 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        />
        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
          const pageNum =
            currentPage > 3 && totalPages > 5
              ? currentPage - 3 + i + (currentPage > totalPages - 2 ? totalPages - currentPage - 2 : 0)
              : i + 1;
          if (pageNum <= totalPages) {
            return (
              <Button
                key={i}
                title={pageNum.toString()}
                className={`px-3 py-1 rounded text-white ${
                  currentPage === pageNum ? 'bg-transparent border border-amber-600' : 'hover:bg-gray-800'
                }`}
                onClick={() => onPageChange(pageNum)}
              />
            );
          }
          return null;
        })}
        <Button
          icon={IoChevronForwardOutline}
          className={`px-3 py-1 rounded text-white hover:bg-gray-800 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
};

export default Pagination;