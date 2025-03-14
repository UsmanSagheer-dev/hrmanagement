import React from "react";
import Table, { Column } from "../../components/table/Table";

interface LeaveRecord {
  date: string;
  duration: string;
  days: string;
  reportingManager: string;
  status: string;
}

export const LeaveContent: React.FC = () => {
  const leaveData: LeaveRecord[] = [
    {
      date: "July 01, 2026",
      duration: "July 05 – July 08",
      days: "3 Days",
      reportingManager: "Mark Williams",
      status: "Pending",
    },
    {
      date: "Apr 05, 2026",
      duration: "Apr 06 – Apr 10",
      days: "4 Days",
      reportingManager: "Mark Williams",
      status: "Approved",
    },
    {
      date: "Mar 12, 2026",
      duration: "Mar 14 – Mar 16",
      days: "2 Days",
      reportingManager: "Mark Williams",
      status: "Approved",
    },
    {
      date: "Feb 01, 2026",
      duration: "Feb 02 – Feb 10",
      days: "8 Days",
      reportingManager: "Mark Williams",
      status: "Approved",
    },
    {
      date: "Jan 01, 2026",
      duration: "Jan 16 – Jan 19",
      days: "3 Days",
      reportingManager: "Mark Williams",
      status: "Reject",
    },
  ];

  const leaveColumns: Column<LeaveRecord>[] = [
    { key: "date", header: "Date" },
    { key: "duration", header: "Duration" },
    { key: "days", header: "Days" },
    { key: "reportingManager", header: "Reporting Manager" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={
            item.status === "Approved"
              ? "text-green-500"
              : item.status === "Pending"
              ? "text-yellow-500"
              : "text-red-500"
          }
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Table data={leaveData} columns={leaveColumns} />
    </div>
  );
};

export default LeaveContent;
