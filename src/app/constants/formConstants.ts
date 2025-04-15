export const maritalStatusOptions = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const nationalityOptions = [
  { value: "india", label: "India" },
  { value: "usa", label: "USA" },
  { value: "uk", label: "UK" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
    { value: "pakistan", label: "Pakistan" },
];

export const cityOptions = [
  { value: "karachi", label: "Karachi" },
  { value: "lahore", label: "Lahore" },
  { value: "islamabad", label: "Islamabad" },
  { value: "rawalpindi", label: "Rawalpindi" },
  { value: "faisalabad", label: "Faisalabad" },
  { value: "multan", label: "Multan" },
  { value: "peshawar", label: "Peshawar" },
  { value: "quetta", label: "Quetta" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "sialkot", label: "Sialkot" },
  { value: "gujranwala", label: "Gujranwala" },
  { value: "bahawalpur", label: "Bahawalpur" },
  { value: "sargodha", label: "Sargodha" },
  { value: "sukkur", label: "Sukkur" },
  { value: "larkana", label: "Larkana" },
  { value: "abbottabad", label: "Abbottabad" },
  { value: "mirpur", label: "Mirpur" },
  { value: "muzaffarabad", label: "Muzaffarabad" },
  { value: "dera ghazi khan", label: "Dera Ghazi Khan" },
  { value: "dera ismail khan", label: "Dera Ismail Khan" },
  { value: "gilgit", label: "Gilgit" },
  { value: "skardu", label: "Skardu" },
  { value: "mardan", label: "Mardan" },
  { value: "swat", label: "Swat" },
  { value: "kohat", label: "Kohat" },
];

export const stateOptions = [
  { value: "punjab", label: "Punjab" },
  { value: "sindh", label: "Sindh" },
  { value: "khyber-pakhtunkhwa", label: "Khyber Pakhtunkhwa" },
  { value: "balochistan", label: "Balochistan" },
  { value: "islamabad-capital-territory", label: "Islamabad Capital Territory" },
  { value: "gilgit-baltistan", label: "Gilgit-Baltistan" },
  { value: "azad-kashmir", label: "Azad Jammu and Kashmir" },
];


export const zipCodeOptions = [
  { value: "400001", label: "400001" },
  { value: "110001", label: "110001" },
  { value: "560001", label: "560001" },
  { value: "500001", label: "500001" },
];

export const employeeTypeOptions = [
  { value: "Full Time", label: "Full-Time" },
  { value: "Part Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Intern", label: "Intern" },
];

export const departmentOptions = [
  { value: "software-development", label: "Software Development" },
  { value: "frontend-development", label: "Frontend Development" },
  { value: "backend-development", label: "Backend Development" },
  { value: "fullstack-development", label: "Fullstack Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "qa", label: "Quality Assurance (QA)" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "product-management", label: "Product Management" },
  { value: "project-management", label: "Project Management" },
  { value: "devops", label: "DevOps" },
  { value: "it-support", label: "IT Support" },
  { value: "hr", label: "Human Resources (HR)" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "business-development", label: "Business Development" },
  { value: "customer-support", label: "Customer Support" },
  { value: "content-writing", label: "Content Writing" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "admin", label: "Administration" },
  { value: "finance", label: "Finance" }
];


export const workingDaysOptions = [
  { value: "mon-fri", label: "Monday to Friday" },
  { value: "mon-sat", label: "Monday to Saturday" },
  { value: "flexible", label: "Flexible" },
];

export const officeLocationOptions = [
  { value: "karachi", label: "Karachi" },
  { value: "lahore", label: "Lahore" },
  { value: "islamabad", label: "Islamabad" },
  { value: "rawalpindi", label: "Rawalpindi" },
  { value: "faisalabad", label: "Faisalabad" },
  { value: "multan", label: "Multan" },
  { value: "peshawar", label: "Peshawar" },
  { value: "quetta", label: "Quetta" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "sialkot", label: "Sialkot" },
  { value: "gujranwala", label: "Gujranwala" },
  { value: "bahawalpur", label: "Bahawalpur" }
];
  

export const INPUT_FIELDS = [
  {
    type: "email" as const,
    placeholder: "Enter Email Address",
    field: "emailAddress",
  },
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
