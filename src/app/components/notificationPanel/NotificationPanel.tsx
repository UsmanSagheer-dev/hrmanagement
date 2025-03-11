// components/NotificationPanel.tsx
import React from "react";

interface Notification {
  id: number;
  category: string;
  message: string;
  time: string;
  icon?: string; // Optional icon for category
  avatar?: string; // Optional avatar
}

interface NotificationPanelProps {
  notifications: Notification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
}) => {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className=" p-4 border-b border-[#A2A1A833] hover:bg-[#222222] transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {notification.icon && (
                <span className="text-orange-400 text-xl">
                  {notification.icon}
                </span>
              )}
              <div>
                <h3 className="text-[16px] font-semibold text-white">
                  {notification.category}
                </h3>
                <p className="text-[16px] text-gray-400 font-light ">
                  {notification.message}
                </p>
              </div>
            </div>
            <span className="text-[16px] font-light text-gray-500">
              {notification.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
