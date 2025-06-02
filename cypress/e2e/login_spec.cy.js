describe("Full Login Page Test", () => {
  it("should render inputs, submit form, call API, and redirect on success", () => {
    cy.visit("/auth/login");

    cy.get('input[type="email"]').should("exist");
    cy.get('input[type="password"]').should("exist");
    cy.get('input[type="checkbox"]').should("exist");
    cy.contains("Forgot Password?").should("exist");
    cy.contains("Sign Up").should("exist");

    cy.contains("Forgot Password?").click();
    cy.url().should("include", "/auth/forgetpassword");
    cy.go("back");

    cy.contains("Sign Up").click();
    cy.wait(1000);
    cy.url().should("include", "/auth/signup");
    cy.go("back");

    cy.intercept("POST", "/api/auth/callback/credentials", {
      statusCode: 200,
      headers: {
        location: "/employee/add",
      },
    }).as("loginRequest");

    cy.get('input[type="email"]').type("mufti@gmail.com");
    cy.get('input[type="password"]').type("12345678");
    cy.get('input[type="checkbox"]').check();
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    cy.visit("/employee/add");
    cy.url().should("include", "/employee/add");
  });
});
