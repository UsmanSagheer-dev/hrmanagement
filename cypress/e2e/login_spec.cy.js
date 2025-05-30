describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("should display logo and welcome message", () => {
    cy.get('img[alt="Logo"]').should("be.visible");
    cy.contains("Welcome").should("be.visible");
    cy.contains("Please login here").should("be.visible");
  });

  it("should have email and password fields", () => {
    cy.get('input[type="email"]').should("exist");
    cy.get('input[type="password"]').should("exist");
  });

  it("should allow typing into email and password fields", () => {
    cy.get('input[type="email"]')
      .type("usman@example.com")
      .should("have.value", "usman@example.com");
    cy.get('input[type="password"]')
      .type("123456")
      .should("have.value", "123456");
  });

  it("should show 'Remember me' checkbox and allow toggle", () => {
    cy.get('input[type="checkbox"]')
      .should("exist")
      .check()
      .should("be.checked");
  });

  it("should have 'Forgot Password' link", () => {
    cy.contains("Forgot Password?")
      .should("have.attr", "href")
      .and("include", "/auth/forgetpassword");
  });

  it("should submit the form", () => {
    cy.get('input[type="email"]').type("usman@example.com");
    cy.get('input[type="password"]').type("123456");
    cy.get('button[type="submit"]').click();
  });

  it("should navigate to Sign Up page", () => {
    cy.contains("Sign Up")
      .should("have.attr", "href")
      .and("include", "/auth/signup");
  });
  it("should redirect to /employee/add after successful login", () => {
    cy.intercept("POST", "/api/auth/callback/credentials").as("loginRequest");

    cy.get('input[type="email"]').type("mufti@gmail.com");
    cy.get('input[type="password"]').type("12345678");
    cy.get('button[type="submit"]').click();

    cy.wait(30000);

    cy.url().should("include", "/employee/add");
  });
});
