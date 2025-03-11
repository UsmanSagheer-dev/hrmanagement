export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

const Table = <T,>({ data, columns }: TableProps<T>) => {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[640px]">
          <thead className="text-white border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className="px-4 py-3 text-[16px] font-light whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key as string}
                    className="px-4 py-3 text-[16px] font-light text-white whitespace-nowrap"
                  >
                    {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 p-4 rounded-lg border border-gray-800"
          >
            {columns.map((col) => (
              <div key={col.key as string} className="mb-2">
                <span className="font-bold text-gray-400">{col.header}: </span>
                <span className="text-white">
                  {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;