"use client";
import React, { useState, useRef } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";

type FileUploadProps = {
  id: string;
  title: string;
  accept?: string;
  onFileUpload: (file: File, id: string) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ 
  id, 
  title, 
  accept = ".jpeg,.jpg,.pdf", 
  onFileUpload 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    // Validate file type based on accept prop
    const fileTypes = accept.split(',').map(type => type.trim());
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    if (!fileTypes.includes(fileExtension) && !fileTypes.includes('.' + file.type.split('/')[1])) {
      alert(`Invalid file type. Please upload ${fileTypes.join(', ')} files.`);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }

    // Pass the file and id to parent component
    onFileUpload(file, id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <p className="text-white text-[16px] font-light mb-2">Upload {title}</p>

      <div 
        className={`border border-dashed ${isDragging ? 'border-white bg-orange-500 bg-opacity-10' : 'border-orange-500'} 
                    p-4 rounded-lg text-center cursor-pointer transition-colors duration-200`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex justify-center mb-2">
          <span className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
            {isDragging ? <MdOutlineFileUpload className="text-lg" /> : <IoDocumentTextOutline className="text-lg" />}
          </span>
        </div>
        
        <p className="text-white text-[14px] font-light">
          Drag & Drop or <span className="text-[#E25319]">choose file</span> to upload
        </p>
        
        <p className="text-white text-[11px] font-light">
          Supported formats: {accept.replace(/\./g, '')}
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