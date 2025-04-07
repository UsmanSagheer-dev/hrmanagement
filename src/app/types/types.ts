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