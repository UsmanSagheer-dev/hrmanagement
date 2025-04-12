"use client";
import React, { useState, useEffect } from "react";
import { useAttendance } from "../../hooks/useAttendance";

interface AttendanceStats {
  totalDays: number;
  onTime: number;
  late: number;
  absent: number;
  onTimePercentage: number;
  latePercentage: number;
  absentPercentage: number;
}

export default function AttendanceStats() {
  const [stats, setStats] = useState<AttendanceStats>({
    totalDays: 0,
    onTime: 0,
    late: 0,
    absent: 0,
    onTimePercentage: 0,
    latePercentage: 0,
    absentPercentage: 0,
  });
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("month");
  
  const { fetchAttendanceHistory, isLoading } = useAttendance();

  useEffect(() => {
    const fetchStats = async () => {
      // Calculate date range based on selected time frame
      const endDate = new Date().toISOString().split('T')[0];
      let startDate: string;
      
      const today = new Date();
      
      if (timeFrame === "week") {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        startDate = lastWeek.toISOString().split('T')[0];
      } else if (timeFrame === "month") {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        startDate = lastMonth.toISOString().split('T')[0];
      } else {
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        startDate = lastYear.toISOString().split('T')[0];
      }
      
      // Fetch attendance history
      const history = await fetchAttendanceHistory(startDate, endDate);
      
      // Calculate business days in the date range (excluding weekends)
      const businessDays = getBusinessDays(new Date(startDate), new Date(endDate));
      
      // Count attendance stats
      const onTimeCount = history.filter(record => record.status === "ON_TIME").length;
      const lateCount = history.filter(record => record.status === "LATE").length;
      const absentCount = businessDays - onTimeCount - lateCount;
      
      // Calculate percentages
      const total = businessDays;
      const onTimePercentage = total > 0 ? Math.round((onTimeCount / total) * 100) : 0;
      const latePercentage = total > 0 ? Math.round((lateCount / total) * 100) : 0;
      const absentPercentage = total > 0 ? Math.round((absentCount / total) * 100) : 0;
      
      setStats({
        totalDays: total,
        onTime: onTimeCount,
        late: lateCount,
        absent: absentCount,
        onTimePercentage,
        latePercentage,
        absentPercentage
      });
    };
    
    fetchStats();
  }, [timeFrame, fetchAttendanceHistory]);
  
  const getBusinessDays = (startDate: Date, endDate: Date): number => {
    let count = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#1E1E1E] rounded-lg p-6 shadow-lg border border-[#A2A1A833]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Attendance Statistics</h2>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as "week" | "month" | "year")}
            className="bg-[#252525] text-white text-sm rounded-md border border-[#A2A1A833] px-2 py-1"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#252525] rounded-md p-3 text-center">
              <div className="text-green-500 text-2xl font-bold">{stats.onTimePercentage}%</div>
              <div className="text-gray-400 text-sm">On Time</div>
            </div>
            
            <div className="bg-[#252525] rounded-md p-3 text-center">
              <div className="text-yellow-500 text-2xl font-bold">{stats.latePercentage}%</div>
              <div className="text-gray-400 text-sm">Late</div>
            </div>
            
            <div className="bg-[#252525] rounded-md p-3 text-center">
              <div className="text-red-500 text-2xl font-bold">{stats.absentPercentage}%</div>
              <div className="text-gray-400 text-sm">Absent</div>
            </div>
          </div>
          
          <div className="bg-[#252525] rounded-md p-4 mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-white">{stats.onTimePercentage}%</span>
            </div>
            
            <div className="w-full bg-[#131313] rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2.5 rounded-full" 
                style={{ width: `${stats.onTimePercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Working Days:</span>
              <span className="text-white font-medium">{stats.totalDays}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Days Present:</span>
              <span className="text-white font-medium">{stats.onTime + stats.late}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">On Time:</span>
              <span className="text-green-500 font-medium">{stats.onTime}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Late:</span>
              <span className="text-yellow-500 font-medium">{stats.late}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Absent:</span>
              <span className="text-red-500 font-medium">{stats.absent}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}