export const maritalStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

export const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const nationalityOptions = [
  { value: 'india', label: 'India' },
  { value: 'usa', label: 'USA' },
  { value: 'uk', label: 'UK' },
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
];

export const cityOptions = [
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'hyderabad', label: 'Hyderabad' },
];

export const stateOptions = [
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'delhi', label: 'Delhi' },
];

export const zipCodeOptions = [
  { value: '400001', label: '400001' },
  { value: '110001', label: '110001' },
  { value: '560001', label: '560001' },
  { value: '500001', label: '500001' },
];

export const employeeTypeOptions = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Intern" },
];

export const departmentOptions = [
  { value: "hr", label: "HR" },
  { value: "it", label: "IT" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
];

export const workingDaysOptions = [
  { value: "mon-fri", label: "Monday to Friday" },
  { value: "mon-sat", label: "Monday to Saturday" },
  { value: "flexible", label: "Flexible" },
];

export const officeLocationOptions = [
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "bangalore", label: "Bangalore" },
  { value: "hyderabad", label: "Hyderabad" },
];

export const INPUT_FIELDS = [
  { type: "email" as const, placeholder: "Enter Email Address", field: "emailAddress" },
  { type: "text" as const, placeholder: "Enter Slack ID", field: "slackId" },
  { type: "text" as const, placeholder: "Enter Skype ID", field: "skypeId" },
  { type: "text" as const, placeholder: "Enter Github ID", field: "githubId" },
];

export const EMPLOYEE_VALIDATION_FORM_ITEMS = [
  "firstName",
  "lastName",
  "mobileNumber",
  "emailAddress",
  "dateOfBirth",
  "gender",
  "maritalStatus",
  "nationality",
  "address",
  "city",
  "state",
  "zipCode",
  "employeeId",
  "userName",
  "employmentType",
  "department",
  "designation",
  "workingDays",
  "joiningDate",
  "officeLocation",
  "email",
  "slackId",
  "skypeId",
  "githubId",
];