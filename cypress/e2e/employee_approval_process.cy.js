describe("Employee Approval Process", () => {
  let pendingEmployeeId;

  describe("User Submission Flow", () => {
    beforeEach(() => {
      // Login as a regular user
      cy.visit("/auth/login");
      cy.get('input[type="email"]').type("mufti@gmail.com");
      cy.get('input[type="password"]').type("12345678");
      cy.get('input[type="checkbox"]').check();
      cy.get('button[type="submit"]').click();

      // Visit the employee form page
      cy.visit("/employee/add");
    });

    it("should submit employee form and wait for admin approval", () => {
      // Intercept API calls
      cy.intercept("POST", "/api/employee", (req) => {
        req.reply({
          statusCode: 201,
          body: {
            message:
              "Employee data submitted successfully and sent for approval",
            pendingApproval: true,
            pendingEmployee: {
              id: "pending-123",
              firstName: "John",
              lastName: "Doe",
            },
          },
        });
      }).as("submitEmployee");

      // Fill and submit the form
      cy.get('[data-cy="personal-tab"]').click();
      cy.get('[data-cy="firstName-input"]').type("John");
      cy.get('[data-cy="lastName-input"]').type("Doe");
      cy.get('[data-cy="email-input"]').type("mufti@gmail.com");
      cy.get('[data-cy="mobileNumber-input"]').type("12345678");

      cy.get('[data-cy="professional-tab"]').click();
      cy.get('[data-cy="employeeId-input"]').type("EMP001");
      cy.get('[data-cy="userName-input"]').type("johndoe");
      cy.get('[data-cy="department-select"]').select("Engineering");

      cy.get('[data-cy="submit-button"]').click();

      // Store the pending employee ID for admin tests
      cy.wait("@submitEmployee").then((interception) => {
        pendingEmployeeId = interception.response.body.pendingEmployee.id;
      });

      // Verify pending status
      cy.url().should("include", "/pending-approval");
      cy.contains("Your registration is pending admin approval").should(
        "be.visible"
      );
    });
  });

  describe("Admin Approval Flow", () => {
    beforeEach(() => {
      // Login as admin
      cy.visit("/auth/login");
      cy.get('input[type="email"]').type("admin@example.com");
      cy.get('input[type="password"]').type("admin123");
      cy.get('input[type="checkbox"]').check();
      cy.get('button[type="submit"]').click();

      // Visit admin dashboard
      cy.visit("/admin/dashboard");
    });

    it("should show pending employee request in admin dashboard", () => {
      // Intercept pending employees API
      cy.intercept("GET", "/api/pendingemployees", {
        statusCode: 200,
        body: [
          {
            id: "pending-123",
            firstName: "John",
            lastName: "Doe",
            email: "mufti@gmail.com",
            employeeId: "EMP001",
            status: "PENDING",
          },
        ],
      }).as("getPendingEmployees");

      // Check if pending request is visible
      cy.contains("Pending Employee Requests").should("be.visible");
      cy.contains("John Doe").should("be.visible");
      cy.contains("EMP001").should("be.visible");
    });

    it("should allow admin to approve employee request", () => {
      // Intercept approval API
      cy.intercept("PUT", "/api/notifications/*/approve", {
        statusCode: 200,
        body: {
          message: "Employee request approved successfully",
        },
      }).as("approveEmployee");

      // Click approve button
      cy.contains("John Doe")
        .parent()
        .find('[data-cy="approve-button"]')
        .click();

      // Verify approval
      cy.wait("@approveEmployee");
      cy.get(".toast-success").should("be.visible");
      cy.contains("Employee request approved successfully").should(
        "be.visible"
      );

      // Verify employee is created
      cy.intercept("GET", "/api/employee", {
        statusCode: 200,
        body: [
          {
            id: "emp-123",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            employeeId: "EMP001",
            status: "ACTIVE",
          },
        ],
      }).as("getEmployee");

      cy.visit("/admin/employees");
      cy.contains("John Doe").should("be.visible");
      cy.contains("EMP001").should("be.visible");
      cy.contains("Active").should("be.visible");
    });

    it("should allow admin to reject employee request", () => {
      // Intercept rejection API
      cy.intercept("PUT", "/api/notifications/*/reject", {
        statusCode: 200,
        body: {
          message: "Employee request rejected",
        },
      }).as("rejectEmployee");

      // Click reject button
      cy.contains("John Doe")
        .parent()
        .find('[data-cy="reject-button"]')
        .click();

      // Enter rejection reason
      cy.get('[data-cy="rejection-reason-input"]').type(
        "Incomplete documentation"
      );
      cy.get('[data-cy="confirm-reject-button"]').click();

      // Verify rejection
      cy.wait("@rejectEmployee");
      cy.get(".toast-success").should("be.visible");
      cy.contains("Employee request rejected").should("be.visible");

      // Verify request is removed from pending list
      cy.contains("John Doe").should("not.exist");
    });
  });

  describe("User Notification Flow", () => {
    beforeEach(() => {
      // Login as the original user
      cy.visit("/auth/login");
      cy.get('input[type="email"]').type("user@example.com");
      cy.get('input[type="password"]').type("password123");
      cy.get('input[type="checkbox"]').check();
      cy.get('button[type="submit"]').click();
    });

    it("should show approval notification to user", () => {
      // Intercept notifications API
      cy.intercept("GET", "/api/notifications", {
        statusCode: 200,
        body: [
          {
            id: "notif-123",
            type: "EMPLOYEE_REQUEST",
            status: "APPROVED",
            message: "Your employee registration has been approved",
            createdAt: new Date().toISOString(),
          },
        ],
      }).as("getNotifications");

      // Check notification
      cy.visit("/notifications");
      cy.contains("Your employee registration has been approved").should(
        "be.visible"
      );
      cy.contains("Approved").should("be.visible");
    });

    it("should show rejection notification to user", () => {
      // Intercept notifications API
      cy.intercept("GET", "/api/notifications", {
        statusCode: 200,
        body: [
          {
            id: "notif-123",
            type: "EMPLOYEE_REQUEST",
            status: "REJECTED",
            message: "Your employee registration has been rejected",
            reason: "Incomplete documentation",
            createdAt: new Date().toISOString(),
          },
        ],
      }).as("getNotifications");

      // Check notification
      cy.visit("/notifications");
      cy.contains("Your employee registration has been rejected").should(
        "be.visible"
      );
      cy.contains("Incomplete documentation").should("be.visible");
      cy.contains("Rejected").should("be.visible");
    });
  });
});
