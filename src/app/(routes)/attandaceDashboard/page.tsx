"use client";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";

import { useAttendance } from "../../hooks/useAttendance";
import AttendanceCheckIn from "@/app/components/attendanceCheckIn/AttendanceCheckIn";
import AttendanceStats from "@/app/components/attendanceStats/AttendanceStats";

export default function AttendanceDashboard() {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const { fetchAttendanceHistory, isLoading } = useAttendance();

  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const startingDay = firstDay.getDay();

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const days = getDaysInMonth(selectedYear, selectedMonth);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full flex flex-col gap-[30px]">
          <div className="w-full">
            <Header
              title="Attendance Dashboard"
              description="Track your attendance"
              textColor="#A2A1A8"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AttendanceCheckIn />
            <AttendanceStats />
          </div>

          <div className="bg-[#1E1E1E] rounded-lg p-6 shadow-lg border border-[#A2A1A833]">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handlePrevMonth}
                className="text-white hover:text-blue-400 transition-colors"
              >
                ← Prev
              </button>

              <h2 className="text-xl font-semibold text-white">
                {monthNames[selectedMonth]} {selectedYear}
              </h2>

              <button
                onClick={handleNextMonth}
                className="text-white hover:text-blue-400 transition-colors"
              >
                Next →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <div
                    key={index}
                    className="text-center text-gray-400 text-sm py-2"
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (day === null) {
                  return (
                    <div key={`empty-${index}`} className="aspect-square"></div>
                  );
                }

                const date = new Date(selectedYear, selectedMonth, day);
                const isToday =
                  new Date().toDateString() === date.toDateString();
                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                const status = isWeekend
                  ? "weekend"
                  : !isPast
                  ? "future"
                  : Math.random() > 0.7
                  ? "absent"
                  : Math.random() > 0.5
                  ? "late"
                  : "present";

                let statusClass = "";
                switch (status) {
                  case "present":
                    statusClass = "bg-green-500/20 border-green-500";
                    break;
                  case "late":
                    statusClass = "bg-yellow-500/20 border-yellow-500";
                    break;
                  case "absent":
                    statusClass = "bg-red-500/20 border-red-500";
                    break;
                  case "weekend":
                    statusClass =
                      "bg-gray-700/20 border-gray-700 text-gray-500";
                    break;
                  default:
                    statusClass = "bg-[#252525] border-[#252525]";
                }

                return (
                  <div
                    key={`day-${day}`}
                    className={`
                      aspect-square flex items-center justify-center rounded-md border 
                      ${statusClass}
                      ${isToday ? "ring-2 ring-blue-500" : ""}
                    `}
                  >
                    <span
                      className={`text-sm ${
                        isWeekend ? "text-gray-500" : "text-white"
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center gap-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500/20 border border-green-500 rounded-sm mr-2"></div>
                <span className="text-gray-400">Present</span>
              </div>

              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500 rounded-sm mr-2"></div>
                <span className="text-gray-400">Late</span>
              </div>

              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500/20 border border-red-500 rounded-sm mr-2"></div>
                <span className="text-gray-400">Absent</span>
              </div>

              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-700/20 border border-gray-700 rounded-sm mr-2"></div>
                <span className="text-gray-400">Weekend</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
