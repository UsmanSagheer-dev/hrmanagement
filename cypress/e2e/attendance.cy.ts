describe('Attendance Management', () => {
  beforeEach(() => {
    cy.loginViaUI('test@example.com', 'password123'); // Using the correct login command
    cy.visit('/attendance');
  });

  it('should record check-in time', () => {
    cy.get('[data-testid="check-in-button"]').click();
    cy.get('[data-testid="check-in-time"]').should('be.visible');
    cy.get('[data-testid="attendance-status"]').should('contain', 'ON_TIME');
  });

  it('should record check-out time', () => {
    cy.get('[data-testid="check-out-button"]').click();
    cy.get('[data-testid="check-out-time"]').should('be.visible');
  });

  it('should display attendance history', () => {
    cy.get('[data-testid="attendance-history"]').should('be.visible');
    cy.get('[data-testid="attendance-record"]').should('have.length.at.least', 1);
  });

  it('should filter attendance records by date range', () => {
    cy.get('[data-testid="date-range-picker"]').click();
    cy.get('[data-testid="start-date"]').type('2024-01-01');
    cy.get('[data-testid="end-date"]').type('2024-01-31');
    cy.get('[data-testid="apply-filter"]').click();
    cy.get('[data-testid="attendance-record"]').should('exist');
  });

  it('should add comments to attendance record', () => {
    cy.get('[data-testid="attendance-record"]').first().click();
    cy.get('[data-testid="add-comment"]').click();
    cy.get('[data-testid="comment-input"]').type('Working from home');
    cy.get('[data-testid="save-comment"]').click();
    cy.get('[data-testid="comment-text"]').should('contain', 'Working from home');
  });
}); 