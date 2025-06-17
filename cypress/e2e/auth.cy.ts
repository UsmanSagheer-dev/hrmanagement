describe("Login Page UI", () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit("/auth/login");

    cy.intercept(
      {
        method: "POST",
        url: "**/api/auth/callback/credentials**", 
      },
      (req) => {
       
        req.alias = "loginRequest"; 
      }
    ).as("loginRequest");

    cy.log("Intercept registered for @loginRequest");
  });

  // it("should display the logo", () => {
  //   cy.get("img[alt='Logo']").should("be.visible");
  // });

  // it("should display welcome message", () => {
  //   cy.contains("h1", "Welcome").should("be.visible");
  //   cy.contains("p", "Please login here").should("be.visible");
  // });

  // it("should render email and password input fields", () => {
  //   cy.get("input[type='email']").should("be.visible").and("not.be.disabled");
  //   cy.get("input[type='password']").should("be.visible").and("not.be.disabled");
  // });

  // it("should render remember me checkbox", () => {
  //   cy.get("[data-testid='remember-me-checkbox']")
  //     .should("exist")
  //     .and("have.attr", "type", "checkbox");
  // });

  // it("should render forgot password link", () => {
  //   cy.contains("a", "Forgot Password?").should("have.attr", "href").and("include", "/auth/forgetpassword");
  // });

  // it("should render login button", () => {
  //   cy.get("[data-testid='button']").should("exist").and("contain", "Login");
  // });

  // it("should render sign up link", () => {
  //   cy.contains("a", "Sign Up").should("have.attr", "href").and("include", "/auth/signup");
  // });

  // it("should allow typing in email and password fields", () => {
  //   cy.get("input[type='email']").type("test@example.com").should("have.value", "test@example.com");
  //   cy.get("input[type='password']").type("123456").should("have.value", "123456");
  // });
  it("redirects to /dashboard for Admin login", () => {
    cy.get("input[type='email']").type("usmanadmin@gmail.com");
    cy.get("input[type='password']").type("admin5839");
    cy.get("[data-testid='button']").click();

    cy.wait("@loginRequest", { timeout: 35000 }).then((interception) => {
      cy.log("Intercepted response:", interception.response);
    });

    cy.url({ timeout: 30000 }).should("include", "/dashboard");
  });

  it("redirects to /employee/add for Employee login", () => {
    cy.get("input[type='email']").type("mufti@gmail.com");
    cy.get("input[type='password']").type("12345678");
    cy.get("[data-testid='button']").click();

    cy.wait("@loginRequest", { timeout: 35000 }).then((interception) => {
      cy.log("Intercepted response:", interception.response);
    });

    cy.url({ timeout: 40000 }).should("include", "/employee/add");
  });
});
