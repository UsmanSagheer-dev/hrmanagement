describe("Personal Info Form with command", () => {
  beforeEach(() => {
    cy.visit("/employee/add");
  });

  it("fills personal info using command", () => {
    cy.fillPersonalInfoForm({
      firstName: "Usman",
      lastName: "Ali",
      phone: "03001234567",
      email: "usman@example.com",
      gender: "Male",
      profileImage: "images/sample.jpg",
    });

    cy.contains("Next").click();
    cy.contains("Professional Information").should("exist");
  });
});
