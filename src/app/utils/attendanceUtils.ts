import dayjs from 'dayjs';

export type AttendanceStatus = 'ON_TIME' | 'LATE';

export const ATTENDANCE_CUTOFF_TIME = '10:00';

export function determineAttendanceStatus(checkInTime: string): AttendanceStatus {
  const checkIn = dayjs(checkInTime, 'HH:mm');
  const cutoff = dayjs(ATTENDANCE_CUTOFF_TIME, 'HH:mm');

  return checkIn.isAfter(cutoff) ? 'LATE' : 'ON_TIME';
}
