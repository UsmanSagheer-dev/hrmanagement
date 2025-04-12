"use client";
import React, { useState, useEffect } from "react";
import { useAttendance } from "../../hooks/useAttendance";
import { toast } from "react-toastify";

export default function AttendanceCheckIn() {
  const { 
    todayAttendance, 
    isLoading, 
    checkInAttendance, 
    checkOutAttendance,
    fetchTodayAttendance
  } = useAttendance();
  
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  // Update the current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Format time
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (hours % 12) || 12;  
      setCurrentTime(`${formattedHours}:${minutes}:${seconds} ${period}`);
      
      // Format date
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString(undefined, options));
    };
    
    // Initialize
    updateTime();
    
    // Update every second
    const timerId = setInterval(updateTime, 1000);
    
    // Cleanup
    return () => clearInterval(timerId);
  }, []);

  const handleCheckIn = async () => {
    try {
      const result = await checkInAttendance();
      if (result) {
        fetchTodayAttendance();
      }
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const result = await checkOutAttendance();
      if (result) {
        fetchTodayAttendance();
      }
    } catch (error) {
      console.error("Check-out failed:", error);
    }
  };

  const getStatusColor = () => {
    if (!todayAttendance) return "bg-gray-500";
    return todayAttendance.status === "ON_TIME" 
      ? "bg-green-500" 
      : todayAttendance.status === "LATE" 
        ? "bg-yellow-500" 
        : "bg-red-500";
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#1E1E1E] rounded-lg p-6 shadow-lg border border-[#A2A1A833]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-1">Attendance</h2>
        <p className="text-gray-400">{currentDate}</p>
        <div className="text-3xl font-bold text-white mt-2">{currentTime}</div>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className={`h-4 w-4 rounded-full ${getStatusColor()} mr-2`}></div>
        <span className="text-white">
          {!todayAttendance 
            ? "Not Checked In" 
            : todayAttendance.status === "ON_TIME" 
              ? "On Time" 
              : todayAttendance.status === "LATE" 
                ? "Late" 
                : "Absent"}
        </span>
      </div>
      
      {todayAttendance ? (
        <div className="bg-[#252525] rounded-md p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Check In:</span>
            <span className="text-white font-medium">{todayAttendance.checkInTime}</span>
          </div>
          
          {todayAttendance.checkOutTime ? (
            <div className="flex justify-between">
              <span className="text-gray-400">Check Out:</span>
              <span className="text-white font-medium">{todayAttendance.checkOutTime}</span>
            </div>
          ) : null}
        </div>
      ) : null}
      
      <div className="flex justify-center gap-4">
        <button
         onClick={handleCheckIn}
          disabled={isLoading || !!todayAttendance}
          className={`px-6 py-2 rounded-md ${
            !todayAttendance 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          } transition-colors`}
        >
          Check In
        </button>
        
        <button
          onClick={handleCheckOut}
          disabled={isLoading || !todayAttendance || !!todayAttendance?.checkOutTime}
          className={`px-6 py-2 rounded-md ${
            todayAttendance && !todayAttendance.checkOutTime
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          } transition-colors`}
        >
          Check Out
        </button>
      </div>
    </div>
  );
}