import React, { useState, useEffect } from "react";
import { Notification } from "../../types/types";
import { FaSpinner } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

interface NotificationDetailProps {
  notification: Notification;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isAdmin: boolean;
}

const NotificationDetail: React.FC<NotificationDetailProps> = ({
  notification,
  onClose,
  onApprove,
  onReject,
  isAdmin,
}) => {
  const [employeeDetails, setEmployeeDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (notification.type === "EMPLOYEE_REQUEST" && notification.sourceId) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/pending-employee?id=${notification.sourceId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch employee details");
          }

          const data = await response.json();
          setEmployeeDetails(data);
        } catch (err: any) {
          setError(err.message || "Failed to load employee details");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEmployeeDetails();
  }, [notification]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
        <div className="bg-[#1A1A1A] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-blue-500 text-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
        <div className="bg-[#1A1A1A] rounded-lg max-w-4xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Error</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <IoCloseOutline size={24} />
            </button>
          </div>
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-[#1A1A1A] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1A1A1A] p-4 border-b border-gray-700 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-white">Employee Request Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="p-6">
          {employeeDetails ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                  {employeeDetails.profileImage ? (
                    <img 
                      src={employeeDetails.profileImage} 
                      alt={`${employeeDetails.firstName} ${employeeDetails.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-white">
                      {employeeDetails.firstName?.[0]}{employeeDetails.lastName?.[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {employeeDetails.firstName} {employeeDetails.lastName}
                  </h3>
                  <p className="text-gray-400">{employeeDetails.designation}</p>
                  <p className="text-gray-400">{employeeDetails.employeeId}</p>
                </div>
              </div>

              {/* Details Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-[#222222] p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-white mb-3">Personal Information</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Email</span>
                      <span className="text-white">{employeeDetails.email}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Mobile</span>
                      <span className="text-white">{employeeDetails.mobileNumber}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Gender</span>
                      <span className="text-white">{employeeDetails.gender}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Date of Birth</span>
                      <span className="text-white">
                        {employeeDetails.dateOfBirth
                          ? new Date(employeeDetails.dateOfBirth).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Nationality</span>
                      <span className="text-white">{employeeDetails.nationality || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Marital Status</span>
                      <span className="text-white">{employeeDetails.maritalStatus || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-[#222222] p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-white mb-3">Professional Information</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Department</span>
                      <span className="text-white">{employeeDetails.department}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Designation</span>
                      <span className="text-white">{employeeDetails.designation}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Work Email</span>
                      <span className="text-white">{employeeDetails.workEmail}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Employee Type</span>
                      <span className="text-white">{employeeDetails.employeeType}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Joining Date</span>
                      <span className="text-white">
                        {employeeDetails.joiningDate
                          ? new Date(employeeDetails.joiningDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Office Location</span>
                      <span className="text-white">{employeeDetails.officeLocation || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-[#222222] p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-white mb-3">Address</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Address</span>
                      <span className="text-white">{employeeDetails.address}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">City</span>
                      <span className="text-white">{employeeDetails.city}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">State</span>
                      <span className="text-white">{employeeDetails.state}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Zip Code</span>
                      <span className="text-white">{employeeDetails.zipCode}</span>
                    </div>
                  </div>
                </div>

                {/* Social Media & IDs */}
                <div className="bg-[#222222] p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-white mb-3">Social & Work IDs</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Slack ID</span>
                      <span className="text-white">{employeeDetails.slackId || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Skype ID</span>
                      <span className="text-white">{employeeDetails.skypeId || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">GitHub ID</span>
                      <span className="text-white">{employeeDetails.githubId || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-400">Username</span>
                      <span className="text-white">{employeeDetails.userName || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-[#222222] p-4 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-3">Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employeeDetails.appointmentLetter && (
                    <div className="bg-[#2A2A2A] p-3 rounded flex justify-between items-center">
                      <span className="text-white">Appointment Letter</span>
                      <a 
                        href={employeeDetails.appointmentLetter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </a>
                    </div>
                  )}
                  {employeeDetails.salarySlips && (
                    <div className="bg-[#2A2A2A] p-3 rounded flex justify-between items-center">
                      <span className="text-white">Salary Slips</span>
                      <a 
                        href={employeeDetails.salarySlips} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </a>
                    </div>
                  )}
                  {employeeDetails.relievingLetter && (
                    <div className="bg-[#2A2A2A] p-3 rounded flex justify-between items-center">
                      <span className="text-white">Relieving Letter</span>
                      <a 
                        href={employeeDetails.relievingLetter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </a>
                    </div>
                  )}
                  {employeeDetails.experienceLetter && (
                    <div className="bg-[#2A2A2A] p-3 rounded flex justify-between items-center">
                      <span className="text-white">Experience Letter</span>
                      <a 
                        href={employeeDetails.experienceLetter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </a>
                    </div>
                  )}
                  {!employeeDetails.appointmentLetter && 
                   !employeeDetails.salarySlips && 
                   !employeeDetails.relievingLetter && 
                   !employeeDetails.experienceLetter && (
                    <div className="col-span-2 text-gray-400 text-center py-3">
                      No documents uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No employee details available
            </div>
          )}

          {isAdmin && notification.status === "PENDING" && (
            <div className="mt-6 flex justify-end space-x-4 border-t border-gray-700 pt-4">
              <button
                onClick={() => onReject(notification.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Reject Request
              </button>
              <button
                onClick={() => onApprove(notification.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Approve Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;