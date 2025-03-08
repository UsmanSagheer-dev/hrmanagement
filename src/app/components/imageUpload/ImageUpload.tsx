type ImageUploadProps = {
    onImageChange: (file: File) => void;
    previewUrl: string | null;
    className?: string;
  };
  
  export const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageChange,
    previewUrl,
    className = '',
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onImageChange(e.target.files[0]);
      }
    };
  
    return (
      <div className={`relative w-24 h-24 border border-gray-700 rounded-lg flex items-center justify-center overflow-hidden ${className}`}>
        {previewUrl ? (
          <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
        )}
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={handleChange}
          accept="image/*"
        />
      </div>
    );
  };