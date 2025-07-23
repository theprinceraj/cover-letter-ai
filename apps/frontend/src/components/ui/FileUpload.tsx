import React, { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  error?: string;
  acceptedTypes?: string;
  label?: string;
  currentFile: File | null;
  disabled?: boolean;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  error,
  acceptedTypes = ".pdf,application/pdf",
  label = "Upload Resume",
  currentFile,
  disabled = false,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-secondary-600 mb-1.5">
        {label}{" "}
        {required && (
          <span className="text-orange-500 ml-1 font-extrabold">*</span>
        )}
      </label>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          w-full h-32 rounded-lg border
          flex flex-col items-center justify-center
          transition-colors duration-200
          ${isDragging ? "border-orange-500 bg-white" : "border-secondary-300 bg-secondary-50"}
          ${error ? "border-red-500" : ""}
          hover:bg-secondary-50 hover:border-orange-500
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept={acceptedTypes}
          className="hidden"
          disabled={disabled}
        />

        {currentFile ? (
          <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-md shadow-md border border-secondary-300">
            <FileText size={18} className="text-orange-500" />
            <span className="text-sm text-secondary-900 truncate max-w-[200px]">
              {currentFile.name}
            </span>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-secondary-500 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={24} className="text-secondary-500 mb-2" />
            <p className="text-sm text-secondary-500 mb-1">
              Drag and drop your resume here
            </p>
            <p className="text-xs text-secondary-500">Supported formats: PDF</p>
          </>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};
