import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useNotifications } from "@/app/hooks/useNotifications";
import { MdKeyboardArrowRight } from "react-icons/md";
import React from "react";

export const useHeader = (description: string, textColor?: string) => {
  const { userData } = useUserProfile();
  const { unreadCount } = useNotifications();
  const isAdmin = userData?.role === "Admin";

  const handleNotificationClick = () => {
    window.location.href = "/notifications";
  };

  const renderDescriptionWithIcon = () => {
    const hasBreadcrumb = description.includes(">");
    if (hasBreadcrumb) {
      const parts = description.split(">");
      return (
        <div className="flex items-center space-x-2">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span
                className="text-sm md:text-base"
                style={{ color: textColor }}
              >
                {part.trim()}
              </span>
              {index < parts.length - 1 && <MdKeyboardArrowRight size={20} />}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <p className="text-sm md:text-base" style={{ color: textColor }}>
        {description}
      </p>
    );
  };

  return {
    isAdmin,
    unreadCount,
    handleNotificationClick,
    renderDescriptionWithIcon,
  };
};
