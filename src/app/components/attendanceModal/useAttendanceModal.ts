import { useState, useEffect } from "react";
import { UseAttendanceModalProps } from "@/app/types/types";
import { AttendanceStatus } from "@/app/constants/constants";

export const useAttendanceModal = ({
  employeeId,
  onSave,
  onClose,
}: UseAttendanceModalProps) => {
  const [checkInTime, setCheckInTime] = useState<string>("");
  const [checkOutTime, setCheckOutTime] = useState<string>("");
  const [status, setStatus] = useState<AttendanceStatus | "">("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (checkInTime) {
      const [hours, minutes] = checkInTime.split(":").map(Number);
      if (hours < 10 || (hours === 10 && minutes === 0)) {
        setStatus("ON_TIME");
      } else {
        setStatus("LATE");
      }
    }
  }, [checkInTime]);

  useEffect(() => {
    if (status === "ABSENT") {
      setCheckInTime("");
      setCheckOutTime("");
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data: {
        employeeId: string;
        checkInTime?: string | null;
        checkOutTime?: string | null;
        status?: AttendanceStatus;
      } = {
        employeeId,
        status: (status as AttendanceStatus) || undefined,
      };

      if (status !== "ABSENT") {
        data.checkInTime = checkInTime || undefined;
        data.checkOutTime = checkOutTime || undefined;
      } else {
        data.checkInTime = null;
        data.checkOutTime = null;
      }

      await onSave(data);
      onClose();
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeFor12Hour = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return {
    checkInTime,
    checkOutTime,
    status,
    isLoading,
    setCheckInTime,
    setCheckOutTime,
    setStatus,
    handleSubmit,
    formatTimeFor12Hour,
  };
};
