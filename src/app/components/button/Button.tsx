import React from "react";
import { IconType } from "react-icons";
interface CustomButtonProps {
  title?: string;
  icon?: IconType;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<CustomButtonProps> = ({
  title,
  icon: Icon,
  className,
  onClick,
}) => {
  const defaultStyles =
    "bg-orange-600 text-white rounded-[10px] text-sm md:text-base py-2 md:py-3 cursor-pointer flex items-center justify-center gap-2 w-full";

  return (
    <button onClick={onClick} className={className || defaultStyles}>
      {Icon && <Icon className="w-5 h-5" />}
      {title && <span>{title}</span>}
    </button>
  );
};

export default Button;
