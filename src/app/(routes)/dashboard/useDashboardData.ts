import { useEffect, useState } from "react";
import { useAttendance } from "@/app/hooks/useAttendance";

export const useDashboardData = () => {
  const { fetchAllAttendance, isLoading, error } = useAttendance();
  const [cardData, setCardData] = useState([
    {
      title: "Total Employee",
      value: 0,
      percentage: "0%",
      percentageColor: "green" as const,
      updateDate: "Update: Loading...",
    },
    {
      title: "Total Applicant",
      value: 0,
      percentage: "0%",
      percentageColor: "green" as const,
      updateDate: "Update: Loading...",
    },
    {
      title: "Today Attendance",
      value: 0,
      percentage: "0%",
      percentageColor: "red" as const,
      updateDate: "Update: Loading...",
    },
    {
      title: "Total Projects",
      value: 0,
      percentage: "0%",
      percentageColor: "green" as const,
      updateDate: "Update: Loading...",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceRecords = await fetchAllAttendance();
        const today = new Date().toISOString().split("T")[0];
        const todayAttendanceCount = attendanceRecords.filter(
          (record: any) => record.date === today
        ).length;

        const employeeResponse = await fetch("/api/employee");
        const employees = employeeResponse.ok ? await employeeResponse.json() : [];
        const totalEmployees = employees.length || 0;

        const applicantResponse = await fetch("/api/notifications");
        const applicants = applicantResponse.ok ? await applicantResponse.json() : [];
        const totalApplicants = applicants.length || 0;

        const totalProjects = 0; 

        const todayStr = `Update: ${new Date().toLocaleDateString()}`;
        setCardData([
          {
            title: "Total Employee",
            value: totalEmployees,
            percentage: totalEmployees > 0 ? "12%" : "0%",
            percentageColor: "green",
            updateDate: todayStr,
          },
          {
            title: "Total Applicant",
            value: totalApplicants,
            percentage: totalApplicants > 0 ? "5%" : "0%",
            percentageColor: "green",
            updateDate: todayStr,
          },
          {
            title: "Today Attendance",
            value: todayAttendanceCount,
            percentage: todayAttendanceCount > 0 ? "8%" : "0%",
            percentageColor: "red",
            updateDate: todayStr,
          },
          {
            title: "Total Projects",
            value: totalProjects,
            percentage: totalProjects > 0 ? "12%" : "0%",
            percentageColor: "green",
            updateDate: todayStr,
          },
        ]);
      } catch (err) {
        console.error("Dashboard data error:", err);
      }
    };

    fetchData();
  }, [fetchAllAttendance]);

  return { cardData, isLoading, error };
};
