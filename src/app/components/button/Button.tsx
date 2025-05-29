import React from "react";
import { IconType } from "react-icons";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: IconType;
  className?: string;
}

const Button: React.FC<CustomButtonProps> = ({
  title,
  icon: Icon,
  className,
  ...rest // ⬅️ this will include type, disabled, data-cy, etc.
}) => {
  const defaultStyles =
    "bg-orange-600 text-white rounded-[10px] text-sm md:text-base py-2 md:py-3 cursor-pointer flex items-center justify-center gap-2 w-full";

  return (
    <button className={className || defaultStyles} {...rest}>
      {Icon && <Icon className="w-5 h-5" />}
      {title && <span>{title}</span>}
    </button>
  );
};

export default Button;
