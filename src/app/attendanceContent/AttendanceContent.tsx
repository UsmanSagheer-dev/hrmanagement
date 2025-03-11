import React from 'react';
import { UserData } from '../types/types';

interface AttendanceContentProps {
  userData: UserData;
}

export const AttendanceContent: React.FC<AttendanceContentProps> = ({ userData }) => (
  <div className="mt-4">
    <h3 className="text-white text-lg mb-4">Attendance Overview</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <div className="mb-4">
        <p className="text-gray-500 text-sm mb-1">Present Days</p>
        <p className="text-white">{userData.attendance?.presentDays}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-500 text-sm mb-1">Absent Days</p>
        <p className="text-white">{userData.attendance?.absentDays}</p>
      </div>
      <div className="mb-4">
        <p className="text-gray-500 text-sm mb-1">Last Check-In</p>
        <p className="text-white">{userData.attendance?.lastCheckIn}</p>
      </div>
    </div>
  </div>
);