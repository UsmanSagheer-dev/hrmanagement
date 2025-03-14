"use client";
import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../header/Header";
import NotificationPanel from "../../components/notificationPanel/NotificationPanel";

const notifications = [
  {
    id: 1,
    category: "Leave Request",
    message: "@EconevFox has applied for leave",
    time: "Just Now",
    icon: "✈️",
  },
  {
    id: 2,
    category: "Check In Issue",
    message: "@Dina shared a message regarding check in issue",
    time: "11:16 AM",
    icon: "📋",
  },
  {
    id: 3,
    category: "Applied job for 'Sales Manager' Position",
    message: "@Vasilisaa has applied for job",
    time: "09:00 AM",
    icon: "💼",
  },
  {
    id: 4,
    category: "Robert Fox has share his feedback",
    message: '"It was an amazing experience with your organization!"',
    time: "Yesterday",
    icon: "⭐",
  },
  {
    id: 5,
    category: "Password Update successfully",
    message: "Your password has been updated successfully",
    time: "Yesterday",
    icon: "🔒",
  },
];

function Page() {
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
          <div className="max-h-[86vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 flex flex-col overflow-y-auto">
            <NotificationPanel notifications={notifications} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
