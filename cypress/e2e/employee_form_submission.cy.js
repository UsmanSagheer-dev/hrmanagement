describe("Employee Form Submission Process", () => {
  beforeEach(() => {
    // Login as a regular user
    cy.visit("/auth/login");
    cy.get('input[type="email"]').type("user@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('input[type="checkbox"]').check();
    cy.get('button[type="submit"]').click();

    // Visit the employee form page
    cy.visit("/employee/add");
  });

  it("should successfully submit employee form and notify admin", () => {
    // Intercept API calls
    cy.intercept("POST", "/api/employee", {
      statusCode: 201,
      body: {
        message: "Employee data submitted successfully and sent for approval",
        pendingApproval: true,
      },
    }).as("submitEmployee");

    cy.intercept("POST", "/api/notifications", {
      statusCode: 201,
      body: {
        message: "Notification created successfully",
      },
    }).as("createNotification");

    // Fill Personal Information
    cy.get('[data-cy="personal-tab"]').click();
    cy.get('[data-cy="firstName-input"]').type("John");
    cy.get('[data-cy="lastName-input"]').type("Doe");
    cy.get('[data-cy="mobileNumber-input"]').type("1234567890");
    cy.get('[data-cy="email-input"]').type("john.doe@example.com");
    cy.get('[data-cy="dateOfBirth-input"]').type("1990-01-01");
    cy.get('[data-cy="maritalStatus-select"]').select("Single");
    cy.get('[data-cy="gender-select"]').select("Male");
    cy.get('[data-cy="nationality-input"]').type("American");
    cy.get('[data-cy="address-input"]').type("123 Main St");
    cy.get('[data-cy="city-input"]').type("New York");
    cy.get('[data-cy="state-input"]').type("NY");
    cy.get('[data-cy="zipCode-input"]').type("10001");

    // Fill Professional Information
    cy.get('[data-cy="professional-tab"]').click();
    cy.get('[data-cy="employeeId-input"]').type("EMP001");
    cy.get('[data-cy="userName-input"]').type("johndoe");
    cy.get('[data-cy="employeeType-select"]').select("Full-time");
    cy.get('[data-cy="workEmail-input"]').type("john.doe@company.com");
    cy.get('[data-cy="department-select"]').select("Engineering");
    cy.get('[data-cy="designation-input"]').type("Software Engineer");
    cy.get('[data-cy="workingDays-input"]').type("5");
    cy.get('[data-cy="joiningDate-input"]').type("2024-03-20");
    cy.get('[data-cy="officeLocation-input"]').type("New York Office");

    // Fill Documents
    cy.get('[data-cy="documents-tab"]').click();
    cy.get('[data-cy="appointmentLetter-input"]').attachFile(
      "appointment_letter.pdf"
    );
    cy.get('[data-cy="salarySlips-input"]').attachFile("salary_slip.pdf");
    cy.get('[data-cy="relievingLetter-input"]').attachFile(
      "relieving_letter.pdf"
    );

    cy.get('[data-cy="experienceLetter-input"]').attachFile(
      "experience_letter.pdf"
    );

    // Fill Account Information
    cy.get('[data-cy="account-tab"]').click();
    cy.get('[data-cy="slackId-input"]').type("john.doe");
    cy.get('[data-cy="skypeId-input"]').type("john.doe.skype");
    cy.get('[data-cy="githubId-input"]').type("johndoe");

    // Submit the form
    cy.get('[data-cy="submit-button"]').click();

    // Verify API calls
    cy.wait("@submitEmployee").its("request.body").should("deep.include", {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      employeeId: "EMP001",
    });

    cy.wait("@createNotification");

    // Verify success message
    cy.get(".toast-success").should("be.visible");
    cy.contains(
      "Your employee registration has been submitted and is pending admin approval"
    ).should("be.visible");

    // Verify redirect to pending approval page
    cy.url().should("include", "/pending-approval");
  });

  it("should handle duplicate employee ID error", () => {
    // Intercept API call with duplicate error
    cy.intercept("POST", "/api/employee", {
      statusCode: 409,
      body: {
        error: "Employee with this ID or email already exists",
        field: "employeeId",
      },
    }).as("submitEmployeeError");

    // Fill form with duplicate employee ID
    cy.get('[data-cy="professional-tab"]').click();
    cy.get('[data-cy="employeeId-input"]').type("EXISTING001");

    // Fill other required fields
    cy.get('[data-cy="personal-tab"]').click();
    cy.get('[data-cy="firstName-input"]').type("John");
    cy.get('[data-cy="lastName-input"]').type("Doe");
    cy.get('[data-cy="email-input"]').type("john.doe@example.com");

    // Submit form
    cy.get('[data-cy="submit-button"]').click();

    // Verify error message
    cy.get(".toast-error").should("be.visible");
    cy.contains("Employee ID already exists in the system").should(
      "be.visible"
    );
  });

  it("should validate required fields", () => {
    // Try to submit without filling required fields
    cy.get('[data-cy="submit-button"]').click();

    // Verify validation messages
    cy.get('[data-cy="firstName-error"]').should("be.visible");
    cy.get('[data-cy="lastName-error"]').should("be.visible");
    cy.get('[data-cy="email-error"]').should("be.visible");
    cy.get('[data-cy="employeeId-error"]').should("be.visible");
  });
});
