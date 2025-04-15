export type PersonalInformationFormProps = {
  onTabChange: (tabName: string) => void;
};

export type ProfessionalInformationFormProps = {
  onTabChange: (tabName: string) => void;
};


export interface FormData {
  personal: {
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
    profileImage?: File | null;
  };
  professional: {
    employeeId: string;
    userName: string;
    employeeType: string;
    workEmail: string;
    department: string;
    designation: string;
    workingDays: string;
    joiningDate: string;
    officeLocation: string;
  };
  documents: {
    appointmentLetter?: File | null;
    salarySlips?: File | null;
    relievingLetter?: File | null;
    experienceLetter?: File | null;
  };
  account: {
    emailAddress: string;
    slackId: string;
    skypeId: string;
    githubId: string;
  };
}

export type PersonalForm={
     employeeId: string;
  userName: string;
  employeeType: string;
  emailAddress: string;
  department: string;
  designation: string;
  workingDays: string;
  joiningDate: string;
  officeLocation: string;
}

export type AccountAccessFormProps = {
  onTabChange: (tabName: string) => void;
};

export type FormDataAccount = {
  emailAddress: string;
  slackId: string;
  skypeId: string;
  githubId: string;
};




export interface UseEmployeeFormReturn {
  userRole: string | null;
  loading: boolean;
  error: string | null;
  renderContent: () => JSX.Element;
  showHeaderAndSidebar: boolean;
}