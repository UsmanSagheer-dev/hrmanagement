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
import { COLORS } from "@/app/constants/color";

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

  const CustomTooltip = ({ active, label }: any) => {
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
        <div
          style={{
            backgroundColor: COLORS.tooltipBg,
            border: `1px solid ${COLORS.tooltipBorder}`,
          }}
          className="p-3 rounded-md"
        >
          <p className="font-bold text-white">{label}</p>
          <p
            style={{ color: COLORS.onTime }}
          >{`On Time: ${tooltipData.high}`}</p>
          <p style={{ color: COLORS.late }}>{`Late: ${tooltipData.medium}`}</p>
          <p style={{ color: COLORS.absent }}>{`Absent: ${tooltipData.low}`}</p>
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
    <div
      className="text-white p-6 rounded-lg w-full"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h2 className="text-xl font-bold">Attendance Overview</h2>
        <div className="flex gap-4">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-4 py-2 rounded-md"
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${COLORS.borderGray}`,
              color: COLORS.textWhite,
            }}
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
            className="flex flex-row-reverse items-center justify-center px-4 py-2 rounded-md"
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${COLORS.borderGray}`,
              color: COLORS.textWhite,
            }}
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
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridStroke} />
              <XAxis dataKey="name" tick={{ fill: COLORS.axisLabel }} />
              <YAxis tick={{ fill: COLORS.axisLabel }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="low"
                stackId="a"
                fill={COLORS.absent}
                radius={[30, 30, 30, 30]}
              />
              <Bar
                dataKey="medium"
                stackId="a"
                fill={COLORS.late}
                radius={[30, 30, 30, 30]}
              />
              <Bar
                dataKey="high"
                stackId="a"
                fill={COLORS.onTime}
                radius={[30, 30, 30, 30]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex mt-4 gap-4 text-sm items-center justify-center">
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: COLORS.onTime }}
          ></div>
          <span>On Time</span>
        </div>
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: COLORS.late }}
          ></div>
          <span>Late</span>
        </div>
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: COLORS.absent }}
          ></div>
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
}
