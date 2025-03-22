// store/slices/employeeFormSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for each form section
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
  profileImage?: string | null; // Will store image as base64 string
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

// Combined employee form state
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

// Initial state
const initialState: EmployeeFormState = {
  personal: {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    dateOfBirth: '',
    maritalStatus: '',
    gender: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    profileImage: null,
  },
  professional: {
    employeeId: '',
    userName: '',
    employeeType: '',
    emailAddress: '',
    department: '',
    designation: '',
    workingDays: '',
    joiningDate: '',
    officeLocation: '',
  },
  documents: {
    appointmentLetter: '',
    salarySlips: '',
    relievingLetter: '',
    experienceLetter: '',
  },
  account: {
    emailAddress: '',
    slackId: '',
    skypeId: '',
    githubId: '',
  },
  activeTab: 'personal',
  formSubmitted: false,
  formError: null,
  isLoading: false,
};

const employeeFormSlice = createSlice({
  name: 'employeeForm',
  initialState,
  reducers: {
    // Set active tab
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    
    // Update personal information
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      state.personal = { ...state.personal, ...action.payload };
    },
    
    // Update professional information
    updateProfessionalInfo: (state, action: PayloadAction<Partial<ProfessionalInfo>>) => {
      state.professional = { ...state.professional, ...action.payload };
    },
    
    // Update document information
    updateDocumentInfo: (state, action: PayloadAction<Partial<DocumentInfo>>) => {
      state.documents = { ...state.documents, ...action.payload };
    },
    
    // Update account information
    updateAccountInfo: (state, action: PayloadAction<Partial<AccountInfo>>) => {
      state.account = { ...state.account, ...action.payload };
    },
    
    // Form submission started
    submitFormStart: (state) => {
      state.isLoading = true;
      state.formError = null;
    },
    
    // Form submission success
    submitFormSuccess: (state) => {
      state.isLoading = false;
      state.formSubmitted = true;
    },
    
    // Form submission failure
    submitFormFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.formError = action.payload;
    },
    
    // Reset form
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
  resetForm
} = employeeFormSlice.actions;

export default employeeFormSlice.reducer;