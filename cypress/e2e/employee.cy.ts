describe('Employee Management', () => {
  beforeEach(() => {
    cy.loginViaUI('test@example.com', 'password123'); // Using the correct login command
    cy.visit('/employee/add');
  });

  it('should display employee profile information', () => {
    cy.get('[data-testid="employee-profile"]').should('be.visible');
    cy.get('[data-testid="employee-name"]').should('contain', 'Test User');
    cy.get('[data-testid="employee-email"]').should('contain', 'test@example.com');
  });

  it('should update employee profile information', () => {
    cy.get('[data-testid="edit-profile-button"]').click();
    cy.get('[data-testid="mobile-number-input"]').clear().type('1234567890');
    cy.get('[data-testid="address-input"]').clear().type('New Address');
    cy.get('[data-testid="save-profile-button"]').click();
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should upload and manage documents', () => {
    cy.get('[data-testid="documents-section"]').click();
    cy.get('[data-testid="upload-appointment-letter"]').attachFile('appointment-letter.pdf');
    cy.get('[data-testid="upload-success"]').should('be.visible');
  });

  it('should handle pending employee approval', () => {
    cy.visit('/admin/pending-employees');
    cy.get('[data-testid="pending-employee-list"]').should('be.visible');
    cy.get('[data-testid="approve-button"]').first().click();
    cy.get('[data-testid="approval-success"]').should('be.visible');
  });

  it('should manage professional information', () => {
    cy.get('[data-testid="professional-info"]').click();
    cy.get('[data-testid="department-select"]').select('IT');
    cy.get('[data-testid="designation-input"]').clear().type('Senior Developer');
    cy.get('[data-testid="save-professional-info"]').click();
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
}); 