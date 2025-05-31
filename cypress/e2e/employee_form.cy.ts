describe('Employee Form Tests', () => {
  beforeEach(() => {
    // Login as admin first
    cy.loginViaUI('admin@example.com', 'password123');
    cy.visit('/employee/add');
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', () => {
      cy.get('button[type="submit"]').click();
      
      // Check for required field error messages
      cy.get('[data-cy="name-error"]').should('be.visible');
      cy.get('[data-cy="email-error"]').should('be.visible');
      cy.get('[data-cy="phone-error"]').should('be.visible');
      cy.get('[data-cy="department-error"]').should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('[data-cy="email-input"]').type('invalid-email');
      cy.get('button[type="submit"]').click();
      cy.get('[data-cy="email-error"]').should('be.visible');
    });

    it('should validate phone number format', () => {
      cy.get('[data-cy="phone-input"]').type('123'); // Too short
      cy.get('button[type="submit"]').click();
      cy.get('[data-cy="phone-error"]').should('be.visible');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Intercept the API call
      cy.intercept('POST', '/api/employees', {
        statusCode: 201,
        body: {
          message: 'Employee added successfully'
        }
      }).as('createEmployee');
    });

    it('should successfully submit form with valid data', () => {
      // Fill in all required fields
      cy.get('[data-cy="name-input"]').type('John Doe');
      cy.get('[data-cy="email-input"]').type('john.doe@example.com');
      cy.get('[data-cy="phone-input"]').type('1234567890');
      cy.get('[data-cy="department-select"]').select('Engineering');
      cy.get('[data-cy="position-input"]').type('Software Engineer');
      cy.get('[data-cy="salary-input"]').type('75000');
      cy.get('[data-cy="join-date-input"]').type('2024-03-20');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Verify API call
      cy.wait('@createEmployee');
      
      // Check success message
      cy.get('[data-cy="success-message"]').should('be.visible');
      
      // Verify redirect to employee list
      cy.url().should('include', '/employees');
    });

    it('should handle API error gracefully', () => {
      // Mock API error
      cy.intercept('POST', '/api/employees', {
        statusCode: 400,
        body: {
          message: 'Email already exists'
        }
      }).as('createEmployeeError');

      // Fill form
      cy.get('[data-cy="name-input"]').type('John Doe');
      cy.get('[data-cy="email-input"]').type('existing@example.com');
      cy.get('[data-cy="phone-input"]').type('1234567890');
      cy.get('[data-cy="department-select"]').select('Engineering');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Verify error message
      cy.get('[data-cy="error-message"]').should('be.visible');
    });
  });

  describe('Form Reset', () => {
    it('should clear form when reset button is clicked', () => {
      // Fill form
      cy.get('[data-cy="name-input"]').type('John Doe');
      cy.get('[data-cy="email-input"]').type('john@example.com');
      cy.get('[data-cy="phone-input"]').type('1234567890');
      
      // Click reset
      cy.get('[data-cy="reset-button"]').click();
      
      // Verify fields are cleared
      cy.get('[data-cy="name-input"]').should('have.value', '');
      cy.get('[data-cy="email-input"]').should('have.value', '');
      cy.get('[data-cy="phone-input"]').should('have.value', '');
    });
  });

  describe('File Upload', () => {
    it('should handle profile picture upload', () => {
      // Upload image
      cy.get('[data-cy="profile-picture-input"]').selectFile('cypress/fixtures/profile.jpg', { force: true });
      
      // Verify preview
      cy.get('[data-cy="image-preview"]').should('be.visible');
    });

    it('should validate file type', () => {
      // Try to upload invalid file
      cy.get('[data-cy="profile-picture-input"]').selectFile('cypress/fixtures/document.pdf', { force: true });
      
      // Verify error message
      cy.get('[data-cy="file-error"]').should('be.visible');
    });
  });

  describe('Form Navigation', () => {
    it('should navigate back to employee list', () => {
      cy.get('[data-cy="back-button"]').click();
      cy.url().should('include', '/employees');
    });

    it('should show confirmation dialog when leaving with unsaved changes', () => {
      // Make changes
      cy.get('[data-cy="name-input"]').type('John Doe');
      
      // Try to navigate away
      cy.get('[data-cy="back-button"]').click();
      
      // Verify confirmation dialog
      cy.get('[data-cy="confirm-dialog"]').should('be.visible');
    });
  });
}); 