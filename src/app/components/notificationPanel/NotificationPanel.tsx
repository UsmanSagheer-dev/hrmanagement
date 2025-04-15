import React, { useState } from "react";
import { Notification } from "../../types/types";
import NotificationDetail from "@/app/(routes)/notificationDetail/NotificationDetail";

interface NotificationPanelProps {
  notifications: Notification[];
  onApprove?: (notificationId: string) => void;
  onReject?: (notificationId: string) => void;
  isAdmin?: boolean;
  getFormattedTimeAgo: (dateString: string) => string;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onApprove,
  onReject,
  isAdmin = false,
  getFormattedTimeAgo,
}) => {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "EMPLOYEE_REQUEST":
        return "👤";
      case "LEAVE_REQUEST":
        return "✈️";
      default:
        return "📣";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
            Pending
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "EMPLOYEE_REQUEST") {
      setSelectedNotification(notification);
    }
  };

  const handleCloseDetail = () => {
    setSelectedNotification(null);
  };

  const handleApprove = (notificationId: string) => {
    if (onApprove) {
      onApprove(notificationId);
      handleCloseDetail();
    }
  };

  const handleReject = (notificationId: string) => {
    if (onReject) {
      onReject(notificationId);
      handleCloseDetail();
    }
  };

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No notifications to display
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-[#A2A1A833] hover:bg-[#222222] transition-colors duration-200 ${
              notification.read ? "opacity-70" : ""
            } ${
              notification.type === "EMPLOYEE_REQUEST" ? "cursor-pointer" : ""
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-orange-400 text-xl mt-1">
                  {getNotificationIcon(notification.type)}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[16px] font-semibold text-white">
                      {notification.title}
                    </h3>
                    {getStatusBadge(notification.status)}
                  </div>
                  <p className="text-[16px] text-gray-400 font-light mb-2">
                    {notification.message}
                  </p>
                  
                  {notification.type === "EMPLOYEE_REQUEST" && (
                    <p className="text-blue-400 text-sm">
                      Click to view employee details
                    </p>
                  )}
                  
                  {isAdmin && notification.status === "PENDING" && notification.type !== "EMPLOYEE_REQUEST" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onApprove && onApprove(notification.id);
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReject && onReject(notification.id);
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[12px] font-light text-gray-500">
                {getFormattedTimeAgo(notification.createdAt)}
              </span>
            </div>
          </div>
        ))
      )}

      {selectedNotification && (
        <NotificationDetail 
          notification={selectedNotification}
          onClose={handleCloseDetail}
          onApprove={handleApprove}
          onReject={handleReject}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default NotificationPanel;