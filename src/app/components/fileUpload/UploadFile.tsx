"use client";
import React from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import useFileUpload from "./useFileUpload";
import { FileUploadProps } from "@/app/types/types";

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  title,
  accept = ".jpeg,.jpg,.pdf",
  onFileUpload,
}) => {
  const {
    isDragging,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClick,
  } = useFileUpload(id, accept, onFileUpload);

  return (
    <div>
      <p className="text-white text-[16px] font-light mb-2">Upload {title}</p>

      <div
        className={`border border-dashed ${
          isDragging
            ? "border-white bg-orange-500 bg-opacity-10"
            : "border-orange-500"
        } p-4 rounded-lg text-center cursor-pointer transition-colors duration-200`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex justify-center mb-2">
          <span className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
            {isDragging ? (
              <MdOutlineFileUpload className="text-lg" />
            ) : (
              <IoDocumentTextOutline className="text-lg" />
            )}
          </span>
        </div>

        <p className="text-white text-[14px] font-light">
          Drag & Drop or <span className="text-[#E25319]">choose file</span> to
          upload
        </p>

        <p className="text-white text-[11px] font-light">
          Supported formats: {accept.replace(/\./g, "")}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUpload;
