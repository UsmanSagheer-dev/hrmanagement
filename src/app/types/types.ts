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
    employeeID?: string;
  userName?: string;
  employeeType?: string;
  emailAdress?: string; 
  department?: string;
  designation?: string;
  workingDays?: string;
  joinDate?: string;
  officeLocation?: string;
  skypeID?: string;
  slackID?: string;
  githubID?: string;
  };

  export interface User {
  id: string;
  name: string | null;
  email: string | null;
  hashedPassword: string | null; 
  role?: string ;
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
