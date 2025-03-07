import React from "react";

interface CustomButtonProps {
  title: string;
  className?: string;
  onClick?: () => void; // Click handler
}

const Button: React.FC<CustomButtonProps> = ({ title, className = "", onClick }) => {
  return (
    <button
      onClick={onClick} // Attach the click handler
      className={`bg-orange-600 text-white rounded text-sm md:text-base py-2 md:py-3 cursor-pointer ${className || "w-full"}`}
    >
      {title}
    </button>
  );
};

export default Button;
