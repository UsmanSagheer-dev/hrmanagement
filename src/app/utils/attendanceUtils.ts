import dayjs from 'dayjs';

export type AttendanceStatus = 'ON_TIME' | 'LATE';

export const ATTENDANCE_CUTOFF_TIME = '10:00';

export function determineAttendanceStatus(checkInTime: string): AttendanceStatus {
  const checkIn = dayjs(checkInTime, 'HH:mm');
  const cutoff = dayjs(ATTENDANCE_CUTOFF_TIME, 'HH:mm');

  return checkIn.isAfter(cutoff) ? 'LATE' : 'ON_TIME';
}

import { AttendanceRecord, FormattedAttendanceRecord } from "@/app/types/types";

export const parseTime = (timeStr: string): Date => {
  const today = new Date();
  let hours: number, minutes: number;

  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    const [time, period] = timeStr.split(" ");
    const [h, m] = time.split(":").map(Number);
    hours =
      period === "PM" && h < 12 ? h + 12 : period === "AM" && h === 12 ? 0 : h;
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

export const formatAttendanceData = (
  data: AttendanceRecord[]
): FormattedAttendanceRecord[] => {
  return data?.map((record) => {
    let workingHours = "N/A";
    let breakTime = "N/A";

    if (record.checkIn && record.checkOut) {
      const checkIn = parseTime(record.checkIn);
      const checkOut = parseTime(record.checkOut);

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
      checkIn: record.checkIn || "N/A",
      checkOut: record.checkOut || "N/A",
      breakTime,
      workingHours,
      status: record.status === "ON_TIME" ? "On Time" : record.status,
    };
  });
};
