import { Column, FormattedAttendanceRecord } from "@/app/types/types";

export const attendanceColumns: Column<FormattedAttendanceRecord>[] = [
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
        className={item.status === "On Time" ? "text-green-500" : "text-red-500"}
      >
        {item.status}
      </span>
    ),
  },
];