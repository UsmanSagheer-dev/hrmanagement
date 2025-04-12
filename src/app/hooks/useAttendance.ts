"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export type AttendanceStatus = "ON_TIME" | "LATE" | "ABSENT";

export interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime?: string | null;
  status: AttendanceStatus;
  employee: {
    firstName: string;
    lastName: string;
    employeeId: string;
    employeeType: string;
    designation: string;
    profileImage?: string;
  };
}

export function useAttendance() {
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const fetchTodayAttendance = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/attendance?date=${getToday()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch today's attendance");
      }

      const data = await response.json();
      setTodayAttendance(data.length > 0 ? data[0] : null);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching attendance");
      toast.error("Failed to load today's attendance");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAttendanceHistory = useCallback(async (startDate?: string, endDate?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let url = "/api/attendance";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch attendance history");
      }

      const data = await response.json();
      setAttendanceHistory(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching attendance history");
      toast.error("Failed to load attendance history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkInAttendance = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check in");
      }

      toast.success("Attendance checked in successfully");
      setTodayAttendance(data.attendance);
      return data.attendance;
    } catch (err: any) {
      setError(err.message || "An error occurred while checking in");
      toast.error(err.message || "Failed to check in");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkOutAttendance = useCallback(async () => {
    if (!todayAttendance) {
      toast.error("No active check-in found");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check out");
      }

      toast.success("Checked out successfully");
      setTodayAttendance(data.attendance);
      return data.attendance;
    } catch (err: any) {
      setError(err.message || "An error occurred while checking out");
      toast.error(err.message || "Failed to check out");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [todayAttendance]);

  const fetchAllAttendance = useCallback(async (date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let url = "/api/attendance";
      if (date) {
        url += `?date=${date}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch attendance records");
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching attendance records");
      toast.error("Failed to load attendance records");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAttendance = useCallback(
    async (
      id: string,
      updates: { checkInTime?: string | null; checkOutTime?: string | null; status?: AttendanceStatus }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const dataToSend = { ...updates, id };
        
        if (updates.status === "ABSENT") {
          dataToSend.checkInTime = null;
          dataToSend.checkOutTime = null;
        }

        const response = await fetch("/api/attendance", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update attendance");
        }

        toast.success("Attendance updated successfully");
        return data.attendance;
      } catch (err: any) {
        setError(err.message || "An error occurred while updating attendance");
        toast.error(err.message || "Failed to update attendance");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createAttendance = useCallback(
    async (
      employeeId: string,
      data: {
        date?: string;
        checkInTime?: string | null;
        checkOutTime?: string | null;
        status?: AttendanceStatus;
      }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const dataToSend = { 
          employeeId,
          date: data.date || getToday(),
          ...data
        };
        
        if (dataToSend.status === "ABSENT") {
          dataToSend.checkInTime = null;
          dataToSend.checkOutTime = null;
        }

        const response = await fetch("/api/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to create attendance");
        }

        toast.success("Attendance created successfully");
        return result.attendance;
      } catch (err: any) {
        setError(err.message || "An error occurred while creating attendance");
        toast.error(err.message || "Failed to create attendance");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteAttendance = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/attendance?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete attendance record");
      }

      toast.success("Attendance record deleted successfully");
      return true;
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting attendance record");
      toast.error(err.message || "Failed to delete attendance record");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  return {
    todayAttendance,
    attendanceHistory,
    isLoading,
    error,
    fetchTodayAttendance,
    fetchAttendanceHistory,
    checkInAttendance,
    checkOutAttendance,
    fetchAllAttendance,
    updateAttendance,
    createAttendance,
    deleteAttendance,
  };
}