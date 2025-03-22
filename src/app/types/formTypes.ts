export type PersonalInformationFormProps = {
  onTabChange: (tabName: string) => void;
};

export type ProfessionalInformationFormProps = {
  onTabChange: (tabName: string) => void;
};


export type FormData = {
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




