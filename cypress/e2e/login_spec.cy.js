describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  describe("UI Elements", () => {
    it("should display all required UI elements", () => {
      cy.get('img[alt="Logo"]').should("be.visible");

      cy.contains("Welcome").should("be.visible");
      cy.contains("Please login here").should("be.visible");

      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
      cy.get('input[type="checkbox"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");

      cy.contains("Forgot Password?").should("be.visible");
      cy.contains("Sign Up").should("be.visible");
    });
  });

  describe("Form Validation", () => {
    it("should show error for empty form submission", () => {
      cy.get('button[type="submit"]').click();
      cy.get('[role="status"]').should(
        "contain",
        "Email and password are required"
      );
    });

    it("should show error for empty email", () => {
      cy.get('input[type="password"]').type("12345678");
      cy.get('button[type="submit"]').click();
      cy.get('[role="status"]').should(
        "contain",
        "Email and password are required"
      );
    });

    it("should show error for empty password", () => {
      cy.get('input[type="email"]').type("mufti@gmail.com");
      cy.get('button[type="submit"]').click();
      cy.get('[role="status"]').should(
        "contain",
        "Email and password are required"
      );
    });
  });

  describe("Form Interactions", () => {
    it("should handle email input correctly", () => {
      cy.get('input[type="email"]')
        .type("mufti@gmail.com")
        .should("have.value", "mufti@gmail.com");
    });

    it("should handle password input correctly", () => {
      cy.get('input[type="password"]')
        .type("12345678")
        .should("have.value", "12345678");
    });

    it("should toggle remember me checkbox", () => {
      cy.get('input[type="checkbox"]')
        .should("not.be.checked")
        .check()
        .should("be.checked")
        .uncheck()
        .should("not.be.checked");
    });

    it("should show loading state when submitting", () => {
      cy.get('input[type="email"]').type("mufti@gmail.com");
      cy.get('input[type="password"]').type("12345678");
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should("be.disabled");
    });
  });

  describe("Navigation", () => {
    it("should navigate to forgot password page", () => {
      cy.contains("Forgot Password?").click();
      cy.url().should("include", "/auth/forgetpassword");
    });

    it("should navigate to sign up page", () => {
      cy.contains("Sign Up").click();
      cy.url().should("include", "/auth/signup");
    });
  });

  describe("Authentication", () => {
    it("should handle successful admin login", () => {
      cy.intercept("POST", "/api/auth/callback/credentials", {
        statusCode: 200,
        body: { ok: true },
      }).as("loginRequest");

      cy.intercept("GET", "/api/auth/session", {
        statusCode: 200,
        body: {
          user: {
            email: "mufti@gmail.com",
            role: "Admin",
          },
        },
      }).as("sessionCheck");

      cy.get('input[type="email"]').type("mufti@gmail.com");
      cy.get('input[type="password"]').type("12345678");
      cy.get('button[type="submit"]').click();

      cy.wait("@loginRequest");
      cy.wait("@sessionCheck");
      cy.wait(2000);

      cy.url().should("include", "/employee/add");
    });

    it("should handle successful employee login", () => {
      cy.intercept("POST", "/api/auth/callback/credentials").as("loginRequest");
      cy.intercept("GET", "/api/auth/session").as("sessionCheck");

      cy.get('input[type="email"]').type("mufti@gmail.com");
      cy.get('input[type="password"]').type("12345678");
      cy.get('button[type="submit"]').click();

      cy.wait("@loginRequest");
      cy.wait("@sessionCheck");
      cy.wait(1000);

      cy.url().should("include", "/employee/add");
    });

    it("should show error for invalid credentials", () => {
      cy.intercept("POST", "/api/auth/callback/credentials", {
        statusCode: 401,
        body: { error: "Invalid credentials" },
      }).as("loginRequest");

      cy.get('input[type="email"]').type("wrong@example.com");
      cy.get('input[type="password"]').type("wrongpassword");
      cy.get('button[type="submit"]').click();

      cy.wait("@loginRequest");
      cy.get('[role="status"]').should("contain", "Invalid credentials");
      cy.url().should("include", "/auth/login");
    });

    it("should handle network error gracefully", () => {
      cy.intercept("POST", "/api/auth/callback/credentials", {
        forceNetworkError: true,
      }).as("loginRequest");

      cy.get('input[type="email"]').type("mufti@gmail.com");
      cy.get('input[type="password"]').type("12345678");
      cy.get('button[type="submit"]').click();

      cy.wait("@loginRequest");
      cy.get('[role="status"]').should(
        "contain",
        "Login failed. Please try again."
      );
      cy.url().should("include", "/auth/login");
    });
  });
});
