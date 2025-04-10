// app/notifications/page.tsx
"use client";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../header/Header";
import NotificationPanel from "../../components/notificationPanel/NotificationPanel";
import { useNotifications } from "../../hooks/useNotifications";
import { useSession } from "next-auth/react";

function Page() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Admin";
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  const {
    notifications,
    isLoading,
    error,
    approveRequest,
    rejectRequest,
    getFormattedTimeAgo,
    setFilters,
    fetchNotifications
  } = useNotifications();

  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilters({});
    } else if (filter === "pending") {
      setFilters({ status: "PENDING" });
    } else if (filter === "employee") {
      setFilters({ type: "EMPLOYEE_REQUEST" });
    }
  };

  // Handle approving a request with confirmation
  const handleApprove = async (notificationId: string) => {
    if (window.confirm("Are you sure you want to approve this request?")) {
      const success = await approveRequest(notificationId);
      if (success) {
        fetchNotifications();
      }
    }
  };

  // Handle rejecting a request with confirmation
  const handleReject = async (notificationId: string) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      const success = await rejectRequest(notificationId);
      if (success) {
        fetchNotifications();
      }
    }
  };

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full flex flex-col items-center gap-[30px]">
          <div className="w-full">
            <Header
              title="Notifications"
              description="All Notifications"
              textColor="#A2A1A8"
            />
          </div>
          
          {/* Filters */}
          <div className="w-full flex gap-4 px-4">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-md ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-[#222222] text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={`px-4 py-2 rounded-md ${
                activeFilter === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-[#222222] text-gray-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange("employee")}
              className={`px-4 py-2 rounded-md ${
                activeFilter === "employee"
                  ? "bg-blue-600 text-white"
                  : "bg-[#222222] text-gray-300"
              }`}
            >
              Employee
            </button>
          </div>
          
          <div className="max-h-[80vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 flex flex-col overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
              <NotificationPanel 
                notifications={notifications}
                onApprove={handleApprove}
                onReject={handleReject}
                isAdmin={isAdmin}
                getFormattedTimeAgo={getFormattedTimeAgo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;