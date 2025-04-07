import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PersonalInfo = {
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
};

type ProfessionalInfo = {
  employeeId: string;
  userName: string;
  employeeType: string;
  emailAddress: string;
  department: string;
  designation: string;
  workingDays: string;
  joiningDate: string;
  officeLocation: string;
};

type DocumentInfo = {
  appointmentLetter?: string;
  salarySlips?: string;
  relievingLetter?: string;
  experienceLetter?: string;
};

type AccountInfo = {
  emailAddress: string;
  slackId: string;
  skypeId: string;
  githubId: string;
};

type EmployeeFormState = {
  personal: PersonalInfo;
  professional: ProfessionalInfo;
  documents: DocumentInfo;
  account: AccountInfo;
  activeTab: string;
  formSubmitted: boolean;
  formError: string | null;
  isLoading: boolean;
};

const initialState: EmployeeFormState = {
  personal: {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    dateOfBirth: "",
    maritalStatus: "",
    gender: "",
    nationality: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    profileImage: null,
  },
  professional: {
    employeeId: "",
    userName: "",
    employeeType: "",
    emailAddress: "",
    department: "",
    designation: "",
    workingDays: "",
    joiningDate: "",
    officeLocation: "",
  },
  documents: {
    appointmentLetter: "",
    salarySlips: "",
    relievingLetter: "",
    experienceLetter: "",
  },
  account: {
    emailAddress: "",
    slackId: "",
    skypeId: "",
    githubId: "",
  },
  activeTab: "personal",
  formSubmitted: false,
  formError: null,
  isLoading: false,
};

const employeeFormSlice = createSlice({
  name: "employeeForm",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },

    updatePersonalInfo: (
      state,
      action: PayloadAction<Partial<PersonalInfo>>
    ) => {
      state.personal = { ...state.personal, ...action.payload };
    },

    updateProfessionalInfo: (
      state,
      action: PayloadAction<Partial<ProfessionalInfo>>
    ) => {
      state.professional = { ...state.professional, ...action.payload };
    },

    updateDocumentInfo: (
      state,
      action: PayloadAction<Partial<DocumentInfo>>
    ) => {
      state.documents = { ...state.documents, ...action.payload };
    },

    updateAccountInfo: (state, action: PayloadAction<Partial<AccountInfo>>) => {
      state.account = { ...state.account, ...action.payload };
    },

    submitFormStart: (state) => {
      state.isLoading = true;
      state.formError = null;
    },

    submitFormSuccess: (state) => {
      state.isLoading = false;
      state.formSubmitted = true;
    },

    submitFormFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.formError = action.payload;
    },

    resetForm: (state) => {
      return initialState;
    },
  },
});

export const {
  setActiveTab,
  updatePersonalInfo,
  updateProfessionalInfo,
  updateDocumentInfo,
  updateAccountInfo,
  submitFormStart,
  submitFormSuccess,
  submitFormFailure,
  resetForm,
} = employeeFormSlice.actions;

export default employeeFormSlice.reducer;
