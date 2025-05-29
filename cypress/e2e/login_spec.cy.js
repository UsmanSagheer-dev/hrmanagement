describe("Login Component", () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit("http://localhost:3000/auth/login");
    // Wait for initial auth checks (e.g., session, providers)
    cy.intercept("GET", "/api/auth/session").as("sessionCheck");
    cy.intercept("GET", "/api/auth/providers").as("providersCheck");
    cy.wait(2000);
  });

  it("should render the login page correctly", () => {
    // Check if the logo is visible
    cy.get('img[alt="Logo"]').should("be.visible");

    // Check if the welcome text is present
    cy.contains("h1", "Welcome").should("be.visible");
    cy.contains("p", "Please login here").should("be.visible");

    // Check if input fields are present
    cy.get('input[type="email"]').should("exist");
    cy.get('input[type="password"]').should("exist");

    // Check if buttons are present
    cy.contains("button", "Login").should("be.visible");
    cy.contains("button", "Login with Google").should("be.visible");

    // Check if links are present
    cy.contains("a", "Forgot Password?").should("be.visible");
    cy.contains("a", "Sign Up").should("be.visible");

    // Check if the "Remember me" checkbox is present
    cy.get('input[type="checkbox"]').should("exist");
  });

  it("should allow typing in email and password fields", () => {
    // Type into email field
    cy.get('input[type="email"]')
      .type("test@example.com")
      .should("have.value", "test@example.com");

    // Type into password field
    cy.get('input[type="password"]')
      .type("password123")
      .should("have.value", "password123");
  });

  it("should submit the form with valid inputs", () => {
    // Mock the login API call for NextAuth credentials
    cy.intercept("POST", "/api/auth/callback/credentials", {
      statusCode: 200,
      body: { message: "Login successful" },
    }).as("loginRequest");

    // Mock CSRF token request
    cy.intercept("GET", "/api/auth/csrf", {
      statusCode: 200,
      body: { csrfToken: "mock-csrf-token" },
    }).as("csrfToken");

    // Type valid credentials
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");

    // Submit the form
    cy.get("form").submit();

    // Wait for the API call and verify
    cy.wait(["@csrfToken", "@loginRequest"]);
    cy.contains("button", "Login").should("be.disabled");
  });

  it("should show error message on invalid login", () => {
    // Mock a failed login API call
    cy.intercept("POST", "/api/auth/callback/credentials", {
      statusCode: 401,
      body: { error: "Invalid credentials" },
    }).as("loginRequest");

    // Mock CSRF token request
    cy.intercept("GET", "/api/auth/csrf", {
      statusCode: 200,
      body: { csrfToken: "mock-csrf-token" },
    }).as("csrfToken");

    // Type invalid credentials
    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpassword");

    // Submit the form
    cy.get("form").submit();

    // Wait for the API call and check for error message
    cy.wait(["@csrfToken", "@loginRequest"]);
    cy.contains("p", "Invalid credentials").should("be.visible");
  });

  it("should trigger Google login redirect", () => {
    // Mock the Google login redirect
    cy.intercept("GET", "/api/auth/signin/google*", {
      statusCode: 302,
      headers: { Location: "https://accounts.google.com/o/oauth2/v2/auth*" },
    }).as("googleLogin");

    // Click the Google login button
    cy.contains("button", "Login with Google").click();

    // Verify the Google login redirect was initiated
    cy.wait("@googleLogin").its("response.statusCode").should("eq", 302);
  });

  it("should navigate to Forgot Password page", () => {
    // Click the Forgot Password link
    cy.contains("a", "Forgot Password?").click({ force: true });

    // Wait for client-side navigation
    cy.wait(500); // Adjust based on app's rendering speed
    cy.url().should("include", "/auth/forgetpassword");
  });

  it("should navigate to Sign Up page", () => {
    // Click the Sign Up link
    cy.contains("a", "Sign Up").click({ force: true });

    // Wait for client-side navigation
    cy.wait(500); // Adjust based on app's rendering speed
    cy.url().should("include", "/auth/signup");
  });

  it("should toggle the Remember me checkbox", () => {
    // Check the checkbox
    cy.get('input[type="checkbox"]').check().should("be.checked");

    // Uncheck the checkbox
    cy.get('input[type="checkbox"]').uncheck().should("not.be.checked");
  });

  it("should disable inputs and buttons during loading", () => {
    // Simulate loading state by intercepting and delaying the login request
    cy.intercept("POST", "/api/auth/callback/credentials", (req) => {
      req.reply((res) => {
        res.delay(1000); // Simulate loading
        res.send({ statusCode: 200, body: { message: "Login successful" } });
      });
    }).as("loginRequest");

    // Mock CSRF token request
    cy.intercept("GET", "/api/auth/csrf", {
      statusCode: 200,
      body: { csrfToken: "mock-csrf-token" },
    }).as("csrfToken");

    // Type credentials and submit
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get("form").submit();

    // Verify inputs and buttons are disabled
    cy.get('input[type="email"]').should("be.disabled");
    cy.get('input[type="password"]').should("be.disabled");
    cy.contains("button", "Login").should("be.disabled");
    cy.contains("button", "Login with Google").should("be.disabled");
    cy.get('input[type="checkbox"]').should("be.disabled");

    // Wait for the request to complete
    cy.wait(["@csrfToken", "@loginRequest"]);
  });
});
