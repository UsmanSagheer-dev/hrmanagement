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
    // You can add custom logic like checking for loader, toast, or redirection.
  });

  it("should trigger Google login button", () => {
    cy.contains("Login with Google").click();
    // Add assertion if you can mock the behavior or see side effects
  });

  it("should navigate to Sign Up page", () => {
    cy.contains("Sign Up")
      .should("have.attr", "href")
      .and("include", "/auth/signup");
  });
});
