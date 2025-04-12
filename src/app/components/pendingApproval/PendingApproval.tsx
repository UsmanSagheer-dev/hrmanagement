"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/app/hooks/useNotifications";
import Loader from "../loader/Loader";

const PendingApproval = () => {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const [localStatus, setLocalStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const { notifications, fetchNotifications } = useNotifications({
    status: "all",
    type: "EMPLOYEE_APPROVAL,EMPLOYEE_REJECTION",
  });

  useEffect(() => {
    const checkApprovalStatus = async () => {
      const latestDecision = notifications.find(n => 
        n.type === "EMPLOYEE_APPROVAL" || n.type === "EMPLOYEE_REJECTION"
      );

      if (latestDecision) {
        if (latestDecision.type === "EMPLOYEE_APPROVAL") {
          await update(); 
          router.push("/employee/dashboard");
        } else {
          setLocalStatus("rejected");
        }
      } else if (session?.user.role === "Pending") {
        setLocalStatus("pending");
      }
    };

    // Check every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      checkApprovalStatus();
    }, 30000);

    // Initial check
    checkApprovalStatus();

    return () => clearInterval(interval);
  }, [notifications, session]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
   <Loader />
      </div>
    );
  }

  if (localStatus === "rejected") {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Registration Rejected
          </h2>
          <p className="text-red-500 mb-4">
            Your employee registration has been reviewed and rejected by the HR team.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/contact-support")}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Contact Support
            </button>
            <button
              onClick={() => router.push("/employee/register")}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Resubmit Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (localStatus === "pending") {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-blue-50 rounded-lg">
        <div className="text-center">
          <div className=" mb-4 mx-auto flex justify-center items-center">
         <Loader/>
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            Registration Under Review
          </h2>
          <p className="text-blue-500 mb-4">
            Your employee registration is currently being reviewed by our HR team.
            This typically takes 1-2 business days.
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <span>Auto-refreshing in</span>
            <span className="font-mono">30s</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PendingApproval;