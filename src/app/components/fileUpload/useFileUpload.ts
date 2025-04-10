import { useState, useRef } from "react";

const useFileUpload = (id: string, accept: string, onFileUpload: (file: File, id: string) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    const fileTypes = accept.split(",").map((type) => type.trim());
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    if (
      !fileTypes.includes(fileExtension) &&
      !fileTypes.includes("." + file.type.split("/")[1])
    ) {
      alert(`Invalid file type. Please upload ${fileTypes.join(", ")} files.`);
      return;
    }

    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File is too large. Maximum size is 1MB.");
      return;
    }
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

  return {
    isDragging,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClick,
  };
};

export default useFileUpload;
