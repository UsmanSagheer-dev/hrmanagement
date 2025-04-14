import { AttendanceStatus } from "@prisma/client";

export type UserData = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  maritalStatus: string;
  gender: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profileImage?: string | null;
  jobTitle: string;
  attendance?: {
    presentDays: number;
    absentDays: number;
    lastCheckIn: string;
  };
  
  appointmentLetter?: string | null;
  salarySlips?: string | null;
  relievingLetter?: string | null;
  experienceLetter?: string | null;
  employeeId?: string;
  userName?: string;
  workEmail?: string;
  employeeType?: string;
  emailAddress?: string;
  department?: string;
  designation?: string;
  workingDays?: string;
  joiningDate?: string;
  officeLocation?: string;
  slackId?: string;
  skypeId?: string;
  githubId?: string;
};

export type EmployeeData = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  profileImage?: string | null;
};

export type UserInfoSectionProps = {
  employeeId?: string;
  handleEditProfile: () => void;
};

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  hashedPassword: string | null;
  role?: string;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  breakTime: string;
  workingHours: string;
  status: string;
}

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export type PersonalInfoContentProps = {
  userData: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    email: string;
    dateOfBirth: string;
    maritalStatus: string;
    gender: string;
    nationality: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  onTabChange: (tabName: string) => void;
};

export interface ProfileContentProps {
  userData: UserData;
  activeProfileTab: string;
  setActiveProfileTab: (tab: string) => void;
}

export interface ProjectRecord {
  srNo: number;
  projectName: string;
  startDate: string;
  finishDate: string;
  status: string;
}

export type AccountAccessFormProps = {
  onTabChange: (tabName: string) => void;
};
export type DocumentsTabProps = {
  onTabChange: (tabName: string) => void;
};
export type ProfileDetailsProps = {
  onTabChange: (tabName: string) => void;
};

export interface FileItem {
  id: string;
  name: string;
  path: string;
}

export interface FileListProps {
  files: FileItem[];
  onView: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
}

export type FileUploadProps = {
  id: string;
  title: string;
  accept?: string;
  onFileUpload: (file: File, id: string) => void;
};

export interface HeaderProps {
  title: string;
  description: string;
  textColor?: string;
}

export interface Employee {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  department: string;
  designation: string;
  employeeType: string;
  workEmail: string;
  profileImage: string | null;
  image: string | null;

  checkInTime: string | null;
  status: AttendanceStatus;
  avatar: string | null;
}

export interface AttendanceModalProps {
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

export interface UseAttendanceModalProps {
  employeeId: string;
  onSave: (data: {
    employeeId: string;
    checkInTime?: string | null;
    checkOutTime?: string | null;
    status?: AttendanceStatus;
  }) => Promise<void>;
  onClose: () => void;
}

export interface ChartItem {
  name: string;
  high: number;
  medium: number;
  low: number;
}

export interface FormattedAttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  breakTime: string;
  workingHours: string;
  status: string;
}

export interface LeaveRecord {
  date: string;
  duration: string;
  days: string;
  reportingManager: string;
  status: string;
}

export interface Member {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
}

export interface employee {
  id: string;
  name: string;
  designation: string;
  type: string;
  status: string;
  image?: string;
}



export interface DepartmentListProps {
  departmentName: string;
  members: Member[];
  totalMembers: number;
  onViewAll?: () => void;
}

export interface Department {
  name: string;
  members: Member[];
  totalMembers: number;
}

export interface StatsCardProps {
  title: string;
  value: number;
  percentage: string;
  percentageColor: "green" | "red";
  updateDate: string;
}

 export interface Props {
  initialUserData?: UserData | null;
}

export interface Notification {
  id: string;
  type: "EMPLOYEE_REQUEST" | "LEAVE_REQUEST" | "GENERAL";
  title: string;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "READ";
  sourceId?: string;
  targetId?: string;
  createdAt: string;
  updatedAt: string;
  read: boolean;
  employee?: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
}
