describe('HR Management System', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  describe('Authentication', () => {
    it('should successfully login with valid credentials', () => {
      cy.get('[data-cy="email-input"]').type('admin@example.com');
      cy.get('[data-cy="password-input"]').type('password123');
      cy.get('[data-cy="login-button"]').click();
      cy.url().should('include', '/dashboard');
    });

    it('should show error message with invalid credentials', () => {
      cy.get('[data-cy="email-input"]').type('invalid@example.com');
      cy.get('[data-cy="password-input"]').type('wrongpassword');
      cy.get('[data-cy="login-button"]').click();
      cy.get('[data-cy="error-message"]').should('be.visible');
    });

    it('should successfully logout', () => {
      // Login first
      cy.get('[data-cy="email-input"]').type('admin@example.com');
      cy.get('[data-cy="password-input"]').type('password123');
      cy.get('[data-cy="login-button"]').click();
      
      // Then logout
      cy.get('[data-cy="logout-button"]').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Employee Management', () => {
    beforeEach(() => {
      // Login before each employee management test
      cy.get('[data-cy="email-input"]').type('admin@example.com');
      cy.get('[data-cy="password-input"]').type('password123');
      cy.get('[data-cy="login-button"]').click();
      cy.visit('/employees');
    });

    it('should add a new employee', () => {
      cy.get('[data-cy="add-employee-button"]').click();
      cy.get('[data-cy="employee-name"]').type('John Doe');
      cy.get('[data-cy="employee-email"]').type('john@example.com');
      cy.get('[data-cy="employee-position"]').type('Software Engineer');
      cy.get('[data-cy="employee-department"]').select('Engineering');
      cy.get('[data-cy="save-employee"]').click();
      cy.get('[data-cy="success-message"]').should('be.visible');
    });

    it('should edit an existing employee', () => {
      cy.get('[data-cy="employee-list"]').first().click();
      cy.get('[data-cy="edit-employee"]').click();
      cy.get('[data-cy="employee-position"]').clear().type('Senior Software Engineer');
      cy.get('[data-cy="save-employee"]').click();
      cy.get('[data-cy="success-message"]').should('be.visible');
    });

    it('should delete an employee', () => {
      cy.get('[data-cy="employee-list"]').first().click();
      cy.get('[data-cy="delete-employee"]').click();
      cy.get('[data-cy="confirm-delete"]').click();
      cy.get('[data-cy="success-message"]').should('be.visible');
    });
  });

  describe('Attendance Management', () => {
    beforeEach(() => {
      // Login before each attendance test
      cy.get('[data-cy="email-input"]').type('employee@example.com');
      cy.get('[data-cy="password-input"]').type('password123');
      cy.get('[data-cy="login-button"]').click();
      cy.visit('/attendance');
    });

    it('should mark attendance', () => {
      cy.get('[data-cy="mark-attendance"]').click();
      cy.get('[data-cy="attendance-success"]').should('be.visible');
    });

    it('should view attendance history', () => {
      cy.get('[data-cy="attendance-history"]').click();
      cy.get('[data-cy="attendance-list"]').should('be.visible');
    });

    it('should apply for leave', () => {
      cy.get('[data-cy="apply-leave"]').click();
      cy.get('[data-cy="leave-type"]').select('Sick Leave');
      cy.get('[data-cy="leave-start-date"]').type('2024-03-20');
      cy.get('[data-cy="leave-end-date"]').type('2024-03-22');
      cy.get('[data-cy="leave-reason"]').type('Not feeling well');
      cy.get('[data-cy="submit-leave"]').click();
      cy.get('[data-cy="success-message"]').should('be.visible');
    });
  });

  describe('Notifications', () => {
    beforeEach(() => {
      // Login before each notification test
      cy.get('[data-cy="email-input"]').type('admin@example.com');
      cy.get('[data-cy="password-input"]').type('password123');
      cy.get('[data-cy="login-button"]').click();
    });

    it('should display notifications', () => {
      cy.get('[data-cy="notifications-icon"]').click();
      cy.get('[data-cy="notifications-list"]').should('be.visible');
    });

    it('should mark notification as read', () => {
      cy.get('[data-cy="notifications-icon"]').click();
      cy.get('[data-cy="notification-item"]').first().click();
      cy.get('[data-cy="notification-read"]').should('have.class', 'read');
    });
  });

  describe('Profile Management', () => {
    beforeEach(() => {
      // Login before each profile test
      cy.get('[data-cy="email-input"]').type('employee@example.com');
      cy.get('[data-cy="password-input"]').type('password123');
      cy.get('[data-cy="login-button"]').click();
      cy.visit('/profile');
    });

    it('should update profile information', () => {
      cy.get('[data-cy="edit-profile"]').click();
      cy.get('[data-cy="phone-number"]').clear().type('1234567890');
      cy.get('[data-cy="address"]').clear().type('123 Main St');
      cy.get('[data-cy="save-profile"]').click();
      cy.get('[data-cy="success-message"]').should('be.visible');
    });

    it('should change password', () => {
      cy.get('[data-cy="change-password"]').click();
      cy.get('[data-cy="current-password"]').type('password123');
      cy.get('[data-cy="new-password"]').type('newpassword123');
      cy.get('[data-cy="confirm-password"]').type('newpassword123');
      cy.get('[data-cy="save-password"]').click();
      cy.get('[data-cy="success-message"]').should('be.visible');
    });
  });
}); 