import { AttendanceRecord, ChartItem } from "@/app/types/types";
import { useEffect, useState } from "react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function useDashboardChart() {
  const [selectedDay, setSelectedDay] = useState("All");
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [recordsCache, setRecordsCache] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weekDates, setWeekDates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const today = new Date();
        const currentDay = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const dateMap: { [key: string]: string } = {};
        daysOfWeek.forEach((day, index) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + index);
          dateMap[day] = date.toISOString().split("T")[0];
        });
        setWeekDates(dateMap);

        const response = await fetch(
          `/api/attendance?startDate=${dateMap["Mon"]}&endDate=${dateMap["Sun"]}`
        );
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);

        const records: AttendanceRecord[] = await response.json();
        setRecordsCache(records);

        const attendanceByDay = daysOfWeek.map((day, index) => {
          const date = dateMap[day];
          return {
            name: day,
            high: records.filter(r => r.date === date && r.status === "ON_TIME").length,
            medium: records.filter(r => r.date === date && r.status === "LATE").length,
            low: 0,
          };
        });

        setChartData(attendanceByDay);
      } catch (err: any) {
        console.error("Error fetching attendance data:", err);
        setError(err.message || "Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTooltipData = async (date: string) => {
    try {
      const response = await fetch(`/api/attendance?date=${date}`);
      if (!response.ok) throw new Error(`Tooltip API error: ${response.statusText}`);
      const records: AttendanceRecord[] = await response.json();

      return {
        high: records.filter(r => r.status === "ON_TIME").length,
        medium: records.filter(r => r.status === "LATE").length,
        low: 0,
      };
    } catch (error) {
      const cached = recordsCache.filter(r => r.date === date);
      return {
        high: cached.filter(r => r.status === "ON_TIME").length,
        medium: cached.filter(r => r.status === "LATE").length,
        low: 0,
      };
    }
  };

  return {
    selectedDay,
    setSelectedDay,
    chartData,
    isLoading,
    error,
    weekDates,
    fetchTooltipData,
    daysOfWeek,
  };
}
