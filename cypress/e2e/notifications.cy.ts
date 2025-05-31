describe('Notification System', () => {
  beforeEach(() => {
    cy.login(); // Custom command to handle login
    cy.visit('/notifications');
  });

  it('should display notifications list', () => {
    cy.get('[data-testid="notifications-list"]').should('be.visible');
    cy.get('[data-testid="notification-item"]').should('have.length.at.least', 1);
  });

  it('should mark notification as read', () => {
    cy.get('[data-testid="notification-item"]').first().click();
    cy.get('[data-testid="mark-as-read"]').click();
    cy.get('[data-testid="notification-item"]').first()
      .should('not.have.class', 'unread');
  });

  it('should filter notifications by type', () => {
    cy.get('[data-testid="notification-type-filter"]').select('EMPLOYEE_REQUEST');
    cy.get('[data-testid="notification-item"]').each(($el) => {
      cy.wrap($el).should('contain', 'Employee Request');
    });
  });

  it('should handle notification actions', () => {
    cy.get('[data-testid="notification-item"]').first().click();
    cy.get('[data-testid="approve-action"]').click();
    cy.get('[data-testid="notification-status"]').should('contain', 'APPROVED');
  });

  it('should delete notification', () => {
    cy.get('[data-testid="notification-item"]').first()
      .find('[data-testid="delete-notification"]').click();
    cy.get('[data-testid="confirm-delete"]').click();
    cy.get('[data-testid="notification-item"]').should('have.length.lessThan', 1);
  });
}); 