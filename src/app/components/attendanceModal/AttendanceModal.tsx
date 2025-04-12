"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AttendanceStatus } from "../../hooks/useAttendance";

interface AttendanceModalProps {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  onClose: () => void;
  onSave: (data: {
    employeeId: string;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    status?: AttendanceStatus;
  }) => Promise<void>;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  employee,
  onClose,
  onSave,
}) => {
  const [checkInTime, setCheckInTime] = useState<string>("");
  const [checkOutTime, setCheckOutTime] = useState<string>("");
  const [status, setStatus] = useState<AttendanceStatus | "">("");
  const [isLoading, setIsLoading] = useState(false);

  // Update status based on check-in time
  useEffect(() => {
    if (checkInTime) {
      // Parse check-in time
      const [hours, minutes] = checkInTime.split(":").map(Number);
      
      // If hours < 10 OR (hours = 10 AND minutes = 0), then ON_TIME
      if (hours < 10 || (hours === 10 && minutes === 0)) {
        setStatus("ON_TIME");
      } else {
        setStatus("LATE");
      }
    }
  }, [checkInTime]);

  // Clear check-in and check-out times when status is set to ABSENT
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
      // Modified: Create data object with correct handling for ABSENT status
      const data = {
        employeeId: employee.id,
        status: status as AttendanceStatus || undefined
      };
      
      // Only add time fields if NOT ABSENT
      if (status !== "ABSENT") {
        data.checkInTime = checkInTime || undefined;
        data.checkOutTime = checkOutTime || undefined;
      } else {
        // Explicitly set to null when ABSENT
        data.checkInTime = null;
        data.checkOutTime = null;
      }
      
      await onSave(data);
      toast.success("Attendance updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update attendance");
    } finally {
      setIsLoading(false);
    }
  };

  // Convert 24-hour format time to 12-hour format with AM/PM
  const formatTimeFor12Hour = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1C2526] p-6 rounded-lg w-[400px] text-white">
        <h2 className="text-xl font-semibold mb-4">
          Update Attendance for {employee.firstName} {employee.lastName}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
              className="w-full p-2 bg-[#2A3435] rounded text-white"
            >
              <option value="">Select Status</option>
              <option value="ON_TIME">On Time</option>
              <option value="LATE">Late</option>
              <option value="ABSENT">Absent</option>
            </select>
            {status === "ABSENT" && (
              <p className="text-xs text-orange-400 mt-1">
                Check-in and check-out times will be cleared for absent employees.
              </p>
            )}
          </div>
          
          {status !== "ABSENT" && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-1">Check-In Time</label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full p-2 bg-[#2A3435] rounded text-white"
                />
                {checkInTime && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeFor12Hour(checkInTime)} 
                    {status === "ON_TIME" ? 
                      " (On Time)" : 
                      status === "LATE" ? " (Late)" : ""}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Check-Out Time</label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full p-2 bg-[#2A3435] rounded text-white"
                />
                {checkOutTime && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeFor12Hour(checkOutTime)}
                  </p>
                )}
              </div>
            </>
          )}
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;