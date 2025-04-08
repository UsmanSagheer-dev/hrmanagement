"use client";
import React, { useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";

type FileUploadProps = {
  id: string;
  title: string;
  accept?: string;
  onFileUpload: (file: File, type: string) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ id, title, onFileUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file, title);
    }
  };

  return (
    <div>
      <p className="text-white text-[16px] font-light mb-2">Upload {title}</p>

      <div className="border border-dashed border-orange-500 p-4 rounded-lg text-center">
        <label htmlFor={id} className="cursor-pointer">
          <div className="flex justify-center mb-2">
            <span className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
              <IoDocumentTextOutline className="text-lg" />
            </span>
          </div>
          <p className="text-white text-[14px] font-light">
            Drag & Drop or <span className="text-[#E25319]">choose file</span>{" "}
            to upload
          </p>
          <p className="text-white text-[11px] font-light">
            Supported formats: .jpeg, .pdf
          </p>
          <input
            type="file"
            id={id}
            accept=".jpeg,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {fileName && <p className="text-sm text-gray-400 mt-2">{fileName}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
