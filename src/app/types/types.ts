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