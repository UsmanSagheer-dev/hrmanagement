"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Department, Member } from "@/app/types/types";

export function useDepartments() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employee", {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch employees");
        const employees = await response.json();

        const departmentMap: { [key: string]: Member[] } = {};
        employees.forEach((emp: any) => {
          const dept = emp.department || "Unassigned";
          if (!departmentMap[dept]) departmentMap[dept] = [];
          departmentMap[dept].push({
            id: emp.id,
            name: `${emp.firstName} ${emp.lastName}`,
            title: emp.designation || "No Designation",
            imageUrl: emp.profileImage || "/images/default-profile.jpg",
          });
        });

        const deptArray: Department[] = Object.keys(departmentMap).map(
          (dept) => ({
            name: dept,
            members: departmentMap[dept].slice(0, 5),
            totalMembers: departmentMap[dept].length,
          })
        );

        setDepartments(deptArray);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewAll = (departmentName: string) => {
    router.push(`/department/${encodeURIComponent(departmentName)}`);
  };

  return { departments, loading, handleViewAll };
}