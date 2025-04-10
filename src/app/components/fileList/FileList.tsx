import { FileListProps } from "@/app/types/types";
import React from "react";
import { BiShow } from "react-icons/bi";
import { GoDownload } from "react-icons/go";

const FileList: React.FC<FileListProps> = ({ files, onView, onDownload }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full  mx-auto  ">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between rounded-md border border-gray-700 p-4  text-white"
        >
          <span className="text-[16px] font-light">{file.name}</span>

          <div className="flex space-x-2">
            <button
              onClick={() => onView(file)}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label={`View ${file.name}`}
            >
              <BiShow />
            </button>

            <button
              onClick={() => onDownload(file)}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label={`Download ${file.name}`}
            >
              <GoDownload />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
