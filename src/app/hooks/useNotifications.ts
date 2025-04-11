"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export interface Notification {
  id: string;
  type: "EMPLOYEE_REQUEST" | "LEAVE_REQUEST" | "GENERAL";
  title: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "READ";
  sourceId?: string;
  targetId?: string;
  createdAt: string;
  updatedAt: string;
  read: boolean;
  employee?: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
}

export function useNotifications(initialFilter?: {
  status?: string;
  type?: string;
  limit?: number;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilter || {});

  const getFormattedTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const fetchNotifications = useCallback(async () => {
    if (sessionStatus !== "authenticated") return;

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.type) params.append("type", filters.type);
      if (filters.limit) params.append("limit", filters.limit.toString());

      const queryString = params.toString();
      const url = `/api/notifications${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  }, [sessionStatus, filters]);

  const fetchUnreadCount = useCallback(async () => {
    if (sessionStatus !== "authenticated") return;

    try {
      const response = await fetch(`/api/notifications?read=false`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setUnreadCount(data.length);
    } catch (err: any) {
      console.error("Error fetching unread notification count:", err);
    }
  }, [sessionStatus]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          read: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));

      return true;
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      toast.error("Failed to update notification");
      return false;
    }
  }, []);

  const handleAction = useCallback(
    async (notificationId: string, action: "approve" | "reject") => {
      try {
        const response = await fetch(`/api/notifications`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId,
            action,
            read: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `Server error: ${response.status}`
          );
        }

        const updatedNotification = await response.json();

        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...updatedNotification }
              : notification
          )
        );
        setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));

        const actionText = action === "approve" ? "approved" : "rejected";
        toast.success(`Request ${actionText} successfully`);
        return true;
      } catch (err: any) {
        console.error(`Error ${action}ing notification:`, err);
        toast.error(`Failed to ${action} request`);
        return false;
      }
    },
    []
  );

  const approveRequest = useCallback(
    (notificationId: string) => {
      return handleAction(notificationId, "approve");
    },
    [handleAction]
  );

  const rejectRequest = useCallback(
    (notificationId: string) => {
      return handleAction(notificationId, "reject");
    },
    [handleAction]
  );

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [fetchNotifications, fetchUnreadCount, sessionStatus]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    approveRequest,
    rejectRequest,
    getFormattedTimeAgo,
    setFilters,
  };
}