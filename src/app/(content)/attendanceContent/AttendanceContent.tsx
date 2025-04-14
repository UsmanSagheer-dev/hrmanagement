import React from "react";
import Table from "../../components/table/Table";
import { Column, FormattedAttendanceRecord } from "@/app/types/types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAttendanceData from "./useAttendanceData";
import { AttendanceRecord } from "@/app/hooks/useAttendance";
import Loader from "@/app/components/loader/Loader";

const AttendanceContent: React.FC<{ employeeId?: string }> = ({
  employeeId,
}) => {
  const { attendanceData, loading, error } = useAttendanceData(employeeId);

  const formatAttendanceData = (
    data: AttendanceRecord[]
  ): FormattedAttendanceRecord[] => {
    return data.map((record) => {
      let workingHours = "N/A";
      let breakTime = "N/A";

      if (record.checkInTime && record.checkOutTime) {
        const checkIn = parseTime(record.checkInTime);
        const checkOut = parseTime(record.checkOutTime);

        const diffMs = checkOut.getTime() - checkIn.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        workingHours = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")} Hrs`;

        breakTime = "00:30 Min";
      }

      return {
        date: new Date(record.date).toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        }),
        checkIn: record.checkInTime || "N/A",
        checkOut: record.checkOutTime || "N/A",
        breakTime,
        workingHours,
        status: record.status === "ON_TIME" ? "On Time" : record.status,
      };
    });
  };

  const parseTime = (timeStr: string): Date => {
    const today = new Date();
    let hours: number, minutes: number;

    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      const [time, period] = timeStr.split(" ");
      const [h, m] = time.split(":").map(Number);
      hours =
        period === "PM" && h < 12
          ? h + 12
          : period === "AM" && h === 12
          ? 0
          : h;
      minutes = m;
    } else {
      const [h, m] = timeStr.split(":").map(Number);
      hours = h;
      minutes = m;
    }

    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes
    );
  };

  const attendanceColumns: Column<FormattedAttendanceRecord>[] = [
    { key: "date", header: "Date" },
    { key: "checkIn", header: "Check In" },
    { key: "checkOut", header: "Check Out" },
    { key: "breakTime", header: "Break" },
    { key: "workingHours", header: "Working Hours" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={
            item.status === "On Time" ? "text-green-500" : "text-red-500"
          }
        >
          {item.status}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center ">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formattedData = formatAttendanceData(attendanceData);

  return (
    <div>
      <Table data={formattedData} columns={attendanceColumns} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AttendanceContent;
