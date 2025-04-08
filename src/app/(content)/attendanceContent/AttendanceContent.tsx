import React from "react";
import Table from "../../components/table/Table";
import { AttendanceRecord, Column } from "@/app/types/types";

const AttendanceContent: React.FC = () => {
  const attendanceData: AttendanceRecord[] = [
    {
      date: "July 01, 2026",
      checkIn: "09:28 AM",
      checkOut: "07:00 PM",
      breakTime: "00:30 Min",
      workingHours: "09:02 Hrs",
      status: "On Time",
    },
    {
      date: "July 02, 2026",
      checkIn: "09:20 AM",
      checkOut: "07:00 PM",
      breakTime: "00:20 Min",
      workingHours: "09:20 Hrs",
      status: "On Time",
    },
    {
      date: "July 03, 2026",
      checkIn: "09:25 AM",
      checkOut: "07:00 PM",
      breakTime: "00:30 Min",
      workingHours: "09:05 Hrs",
      status: "On Time",
    },
    {
      date: "July 04, 2026",
      checkIn: "09:45 AM",
      checkOut: "07:00 PM",
      breakTime: "00:40 Min",
      workingHours: "08:35 Hrs",
      status: "Late",
    },
    {
      date: "July 05, 2026",
      checkIn: "10:00 AM",
      checkOut: "07:00 PM",
      breakTime: "00:30 Min",
      workingHours: "08:30 Hrs",
      status: "Late",
    },
    {
      date: "July 06, 2026",
      checkIn: "09:28 AM",
      checkOut: "07:00 PM",
      breakTime: "00:30 Min",
      workingHours: "09:02 Hrs",
      status: "On Time",
    },
    {
      date: "July 07, 2026",
      checkIn: "09:30 AM",
      checkOut: "07:00 PM",
      breakTime: "00:15 Min",
      workingHours: "09:15 Hrs",
      status: "On Time",
    },
    {
      date: "July 08, 2026",
      checkIn: "09:52 AM",
      checkOut: "07:00 PM",
      breakTime: "00:45 Min",
      workingHours: "08:23 Hrs",
      status: "Late",
    },
    {
      date: "July 09, 2026",
      checkIn: "09:10 AM",
      checkOut: "07:00 PM",
      breakTime: "00:30 Min",
      workingHours: "09:02 Hrs",
      status: "On Time",
    },
    {
      date: "July 10, 2026",
      checkIn: "09:48 AM",
      checkOut: "07:00 PM",
      breakTime: "00:42 Min",
      workingHours: "08:30 Hrs",
      status: "Late",
    },
  ];

  const attendanceColumns: Column<AttendanceRecord>[] = [
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

  return (
    <div>
      <Table data={attendanceData} columns={attendanceColumns} />
    </div>
  );
};

export default AttendanceContent;
