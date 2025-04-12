"use client";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../header/Header";
import SearchBar from "../../components/searchBar/SearchBar";
import StatsCard from "../../components/statsCard/StatsCard";
import DashboardChart from "@/app/components/dashboardChart/DashboardChart";

function Page() {
  const cardData = [
    {
      title: "Total Employee",
      value: 666,
      percentage: "12%",
      percentageColor: "green" as const,
      updateDate: "Update: July 16, 2023",
    },
    {
      title: "Total Applicant",
      value: 666,
      percentage: "5%",
      percentageColor: "green" as const,
      updateDate: "Update: July 14, 2023",
    },
    {
      title: "Today Attendance",
      value: 666,
      percentage: "8%",
      percentageColor: "red" as const,
      updateDate: "Update: July 14, 2023",
    },
    {
      title: "Total Projects",
      value: 666,
      percentage: "12%",
      percentageColor: "green" as const,
      updateDate: "Update: July 10, 2023",
    },
  ];

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full flex flex-col gap-[30px]">
          <div className="w-full">
            <Header
              title="Design Department"
              description="All Departments > Design Department"
              textColor="#ffffff"
            />
          </div>
          <div className="max-h-[86vh] w-full bg-transparent  p-4 flex flex-col gap-4 overflow-y-scroll scrollbar-hide">
           
            <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-[20px] ">
              {cardData.map((card, index) => (
                <StatsCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  percentage={card.percentage}
                  percentageColor={card.percentageColor}
                  updateDate={card.updateDate}
                />
              ))}
            </div>
            <div className="w-full border border-[#A2A1A833] rounded-[10px]">
              <DashboardChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
