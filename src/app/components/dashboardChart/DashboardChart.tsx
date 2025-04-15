"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RiArrowDropDownLine } from "react-icons/ri";
import Button from "../button/Button";
import { useEffect, useState } from "react";
import useDashboardChart from "./useDashboardChart";
import Loader from "../loader/Loader";

export default function AttendanceOverview() {
  const {
    selectedDay,
    setSelectedDay,
    chartData,
    isLoading,
    error,
    weekDates,
    fetchTooltipData,
    daysOfWeek,
  } = useDashboardChart();

  const CustomTooltip = ({ active, payload, label }: any) => {
    const [tooltipData, setTooltipData] = useState<{
      high: number;
      medium: number;
      low: number;
    } | null>(null);

    useEffect(() => {
      if (active && label) {
        const date = weekDates[label];
        if (date) {
          fetchTooltipData(date).then((data) => {
            setTooltipData(data);
          });
        }
      }
    }, [active, label]);

    if (active && tooltipData) {
      return (
        <div className="bg-black border border-gray-700 p-3 rounded-md">
          <p className="font-bold text-white">{`${label}`}</p>
          <p className="text-pink-500">{`On Time: ${tooltipData.high}`}</p>
          <p className="text-yellow-400">{`Late: ${tooltipData.medium}`}</p>
          <p className="text-orange-500">{`Absent: ${tooltipData.low}`}</p>
        </div>
      );
    }
    return null;
  };

  const displayData =
    selectedDay === "All"
      ? chartData
      : chartData.filter((day) => day.name === selectedDay);

  return (
    <div className="bg-transparent text-white p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Attendance Overview</h2>
        <div className="flex gap-4">
          <select
            className="bg-transparent border border-gray-700 text-white px-4 py-2 rounded-md"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="All">All Days</option>
            {daysOfWeek?.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <Button
            icon={RiArrowDropDownLine}
            title="Today"
            className="bg-transparent border border-gray-700 text-white px-4 py-2 rounded-md flex flex-row-reverse items-center justify-center"
            onClick={() => setSelectedDay("All")}
          />
        </div>
      </div>

      <div className="h-96 w-full flex items-center justify-center">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : chartData.length === 0 ? (
          <p className="text-white">No attendance data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={12}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
              <YAxis tick={{ fill: "#9CA3AF" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="low"
                stackId="a"
                fill="#F97316"
                radius={[30, 30, 30, 30]}
              />
              <Bar
                dataKey="medium"
                stackId="a"
                fill="#FBBF24"
                radius={[30, 30, 30, 30]}
              />
              <Bar
                dataKey="high"
                stackId="a"
                fill="#F45B69"
                radius={[30, 30, 30, 30]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex mt-4 gap-2 text-sm items-center justify-center">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#F45B69] rounded-full mr-1"></div>
          <span>On Time</span>
        </div>
        <div className="flex  items-center ">
          <div className="w-3 h-3 bg-[#FBBF24] rounded-full mr-1"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#F97316] rounded-full mr-1"></div>
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
}
