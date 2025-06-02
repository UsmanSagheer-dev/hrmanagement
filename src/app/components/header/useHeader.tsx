import { useUserProfile } from "@/app/hooks/useUserProfile";
import { useNotifications } from "@/app/hooks/useNotifications";
import { MdKeyboardArrowRight } from "react-icons/md";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const useHeader = (description: string, textColor?: string) => {
  const { userData } = useUserProfile();
  const { unreadCount } = useNotifications();
  const isAdmin = userData?.role === "Admin";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNotificationClick = () => {
    window.location.href = "/notifications";
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      router.push(`/employee/details?search=${encodeURIComponent(query)}`);
    }
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
    searchQuery,
    handleNotificationClick,
    handleSearch,
    renderDescriptionWithIcon,
  };
};
