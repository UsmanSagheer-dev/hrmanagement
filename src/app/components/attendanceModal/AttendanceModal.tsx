"use client";
import React from "react";
import { toast } from "react-toastify";
import { useAttendanceModal } from "./useAttendanceModal";
import { AttendanceModalProps } from "@/app/types/types";
import { AttendanceStatus } from "@/app/constants/constants";
import { COLORS } from "@/app/constants/color";

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  employee,
  onClose,
  onSave,
}) => {
  const {
    checkInTime,
    checkOutTime,
    status,
    isLoading,
    setCheckInTime,
    setCheckOutTime,
    setStatus,
    handleSubmit,
    formatTimeFor12Hour,
  } = useAttendanceModal({
    employeeId: employee.id,
    onSave: async (data) => {
      try {
        await onSave(data);
        toast.success("Attendance updated successfully");
      } catch {
        toast.error("Failed to update attendance");
      }
    },
    onClose,
  });

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: COLORS.overlayBackground }}
    >
      <div
        className="p-6 rounded-lg w-[400px]"
        style={{ backgroundColor: COLORS.modalBackground, color: COLORS.textWhite }}
      >
        <h2 className="text-xl font-semibold mb-4">
          Update Attendance for {employee.firstName} {employee.lastName}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
              className="w-full p-2 rounded"
              style={{
                backgroundColor: COLORS.inputBackground,
                color: COLORS.textWhite,
              }}
            >
              <option value="">Select Status</option>
              <option value="ON_TIME">On Time</option>
              <option value="LATE">Late</option>
              <option value="ABSENT">Absent</option>
            </select>
            {status === "ABSENT" && (
              <p className="text-xs mt-1" style={{ color: COLORS.textOrange }}>
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
                  className="w-full p-2 rounded"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.textWhite,
                  }}
                />
                {checkInTime && (
                  <p className="text-xs mt-1" style={{ color: COLORS.textGray }}>
                    {formatTimeFor12Hour(checkInTime)}
                    {status === "ON_TIME"
                      ? " (On Time)"
                      : status === "LATE"
                      ? " (Late)"
                      : ""}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Check-Out Time</label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full p-2 rounded"
                  style={{
                    backgroundColor: COLORS.inputBackground,
                    color: COLORS.textWhite,
                  }}
                />
                {checkOutTime && (
                  <p className="text-xs mt-1" style={{ color: COLORS.textGray }}>
                    {formatTimeFor12Hour(checkOutTime)}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: COLORS.buttonGray,
                color: COLORS.textWhite,
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: COLORS.buttonOrange,
                color: COLORS.textWhite,
              }}
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
