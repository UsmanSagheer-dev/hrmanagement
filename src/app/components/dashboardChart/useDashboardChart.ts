import { AttendanceRecord, ChartItem } from "@/app/types/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function useDashboardChart() {
  const [selectedDay, setSelectedDay] = useState("All");
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [recordsCache, setRecordsCache] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weekDates, setWeekDates] = useState<{ [key: string]: string }>({});

  const markAbsentEmployees = async () => {
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ autoMarkAbsent: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark absent employees");
      }

      await fetchData();
      return await response.json();
    } catch (err) {
      toast.error("Failed to update absent employees");
    }
  };

  const checkAndMarkAbsences = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 20) {
      markAbsentEmployees();
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const today = new Date();
      const currentDay = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(
        today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)
      );
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

      const employeesResponse = await fetch("/api/employee");
      const employees = await employeesResponse.json();
      const totalEmployees = employees.length;

      const attendanceByDay = daysOfWeek.map((day) => {
        const date = dateMap[day];
        const dayRecords = records.filter((r) => r.date === date);
        const onTimeCount = dayRecords.filter(
          (r) => r.status === "ON_TIME"
        ).length;
        const lateCount = dayRecords.filter((r) => r.status === "LATE").length;
        const absentCount = dayRecords.filter(
          (r) => r.status === "ABSENT"
        ).length;
        const calculatedAbsentCount =
          absentCount > 0
            ? absentCount
            : totalEmployees - (onTimeCount + lateCount);

        return {
          name: day,
          high: onTimeCount,
          medium: lateCount,
          low: calculatedAbsentCount,
        };
      });

      setChartData(attendanceByDay);
    } catch (err: any) {
      toast.error("Error fetching attendance data");
      setError(err.message || "Failed to load attendance data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    checkAndMarkAbsences();
    const timer = setInterval(checkAndMarkAbsences, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTooltipData = async (date: string) => {
    try {
      const response = await fetch(`/api/attendance?date=${date}`);
      if (!response.ok)
        throw new Error(`Tooltip API error: ${response.statusText}`);
      const records: AttendanceRecord[] = await response.json();

      const employeesResponse = await fetch("/api/employee");
      const employees = await employeesResponse.json();
      const totalEmployees = employees.length;

      const onTimeCount = records.filter((r) => r.status === "ON_TIME").length;
      const lateCount = records.filter((r) => r.status === "LATE").length;
      const absentCount = records.filter((r) => r.status === "ABSENT").length;
      const calculatedAbsentCount =
        absentCount > 0
          ? absentCount
          : totalEmployees - (onTimeCount + lateCount);

      return {
        high: onTimeCount,
        medium: lateCount,
        low: calculatedAbsentCount,
      };
    } catch {
      const cached = recordsCache.filter((r) => r.date === date);
      const onTimeCount = cached.filter((r) => r.status === "ON_TIME").length;
      const lateCount = cached.filter((r) => r.status === "LATE").length;
      const absentCount = cached.filter((r) => r.status === "ABSENT").length;

      return {
        high: onTimeCount,
        medium: lateCount,
        low: absentCount,
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
    markAbsentEmployees,
    refreshData: fetchData,
  };
}
