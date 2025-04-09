import { cityOptions, genderOptions, maritalStatusOptions, nationalityOptions, stateOptions, zipCodeOptions } from "./formConstants";

 export const inputFields = [
    {
      section: "name",
      grid: "grid-cols-1 md:grid-cols-2",
      fields: [
        { type: "text" as const, placeholder: "First Name", field: "firstName" },
        { type: "text" as const, placeholder: "Last Name", field: "lastName" },
      ],
    },
    {
      section: "contact",
      grid: "grid-cols-1 md:grid-cols-2",
      fields: [
        {
          type: "text" as const,
          placeholder: "Mobile Number",
          field: "mobileNumber",
        },
        { type: "email" as const, placeholder: "Email Address", field: "email" },
      ],
    },
    {
      section: "personal",
      grid: "grid-cols-1 md:grid-cols-2",
      fields: [
        {
          type: "date" as const,
          placeholder: "Date of Birth",
          field: "dateOfBirth",
        },
        {
          type: "select" as const,
          placeholder: "Marital Status",
          field: "maritalStatus",
          options: maritalStatusOptions,
        },
      ],
    },
    {
      section: "identity",
      grid: "grid-cols-1 md:grid-cols-2",
      fields: [
        {
          type: "select" as const,
          placeholder: "Gender",
          field: "gender",
          options: genderOptions,
        },
        {
          type: "select" as const,
          placeholder: "Nationality",
          field: "nationality",
          options: nationalityOptions,
        },
      ],
    },
    {
      section: "address",
      grid: "grid-cols-1",
      fields: [
        { type: "text" as const, placeholder: "Address", field: "address" },
      ],
    },
    {
      section: "location",
      grid: "grid-cols-1 md:grid-cols-3",
      fields: [
        {
          type: "select" as const,
          placeholder: "City",
          field: "city",
          options: cityOptions,
        },
        {
          type: "select" as const,
          placeholder: "State",
          field: "state",
          options: stateOptions,
        },
        {
          type: "select" as const,
          placeholder: "ZIP Code",
          field: "zipCode",
          options: zipCodeOptions,
        },
      ],
    },
  ];