import React, { useState, useEffect } from "react";
import Table from "../../components/table/Table";
import { Column, LeaveRequest } from "@/app/types/types";
import LeaveRequestForm from "../../components/leaveRequestForm/LeaveRequestForm";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Loader from "@/app/components/loader/Loader";

export const LeaveContent: React.FC = () => {
  const { data: session } = useSession();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch("/api/leave");
      if (!response.ok) {
        throw new Error("Failed to fetch leave requests");
      }
      const data = await response.json();
      setLeaveRequests(data);
    } catch (error) {
      toast.error("Failed to fetch leave requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleSubmitLeaveRequest = async (data: {
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    try {
      const response = await fetch("/api/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit leave request");
      }

      await fetchLeaveRequests();
      setShowForm(false);
    } catch (error) {
      throw error;
    }
  };

  const handleApproveLeave = async (leaveRequestId: string) => {
    try {
      const response = await fetch("/api/leave", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaveRequestId,
          status: "APPROVED",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve leave request");
      }

      const { leaveRequest } = await response.json();
      
      // Update the leave requests list with the new status
      setLeaveRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === leaveRequestId ? leaveRequest : request
        )
      );

      toast.success("Leave request approved successfully");
    } catch (error) {
      toast.error("Failed to approve leave request");
    }
  };

  const handleRejectLeave = async (leaveRequestId: string) => {
    const rejectionReason = prompt("Please provide a reason for rejection:");
    if (!rejectionReason) {
      toast.error("Rejection reason is required");
      return;
    }

    try {
      const response = await fetch("/api/leave", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaveRequestId,
          status: "REJECTED",
          rejectionReason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject leave request");
      }

      const { leaveRequest } = await response.json();
      
      // Update the leave requests list with the new status
      setLeaveRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === leaveRequestId ? leaveRequest : request
        )
      );

      toast.success("Leave request rejected successfully");
    } catch (error) {
      toast.error("Failed to reject leave request");
    }
  };

  const leaveColumns: Column<LeaveRequest>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (item) => (
        <div className="flex items-center space-x-2">
          {item.employee?.profileImage ? (
            <img
              src={item.employee.profileImage}
              alt={`${item.employee.firstName} ${item.employee.lastName}`}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm">
                {item.employee?.firstName?.[0]}
                {item.employee?.lastName?.[0]}
              </span>
            </div>
          )}
          <span>
            {item.employee?.firstName} {item.employee?.lastName}
          </span>
        </div>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (item) => new Date(item.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      header: "End Date",
      render: (item) => new Date(item.endDate).toLocaleDateString(),
    },
    {
      key: "reason",
      header: "Reason",
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <div className="space-y-1">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : item.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.status === "APPROVED" ? "Accepted" : item.status === "REJECTED" ? "Rejected" : "Pending"}
          </span>
          {item.status === "REJECTED" && item.rejectionReason && (
            <p className="text-sm text-gray-400 mt-1">
              Reason: {item.rejectionReason}
            </p>
          )}
        </div>
      ),
    },
  ];

  if (session?.user?.role === "Admin") {
    leaveColumns.push({
      key: "actions",
      header: "Actions",
      render: (item) =>
        item.status === "PENDING" ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleApproveLeave(item.id)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleRejectLeave(item.id)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </div>
        ) : null,
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {session?.user?.role !== "Admin" && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showForm ? "Cancel" : "Request Leave"}
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-[#1A1A1A] p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Submit Leave Request
          </h2>
          <LeaveRequestForm onSubmit={handleSubmitLeaveRequest} />
        </div>
      )}

      <div className="bg-[#1A1A1A] p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Leave History</h2>
        <Table data={leaveRequests} columns={leaveColumns} />
      </div>
    </div>
  );
};

export default LeaveContent;
