"use client";
import React, { useState } from "react";
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
    checkInTime?: string;
    checkOutTime?: string;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave({
        employeeId: employee.id,
        checkInTime: checkInTime || undefined,
        checkOutTime: checkOutTime || undefined,
        status: status || undefined,
      });
      toast.success("Attendance updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update attendance");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1C2526] p-6 rounded-lg w-[400px] text-white">
        <h2 className="text-xl font-semibold mb-4">
          Update Attendance for {employee.firstName} {employee.lastName}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Check-In Time</label>
            <input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full p-2 bg-[#2A3435] rounded text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Check-Out Time</label>
            <input
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-full p-2 bg-[#2A3435] rounded text-white"
            />
          </div>
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
          </div>
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