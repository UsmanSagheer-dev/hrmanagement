/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.intercept('POST', '/api/auth/callback/credentials', {
    statusCode: 200,
    body: { ok: true },
  }).as('loginRequest');

  cy.intercept('GET', '/api/auth/session', {
    statusCode: 200,
    body: {
      user: {
        email: 'mufti@gmail.com',
        role: 'Admin',
      },
    },
  }).as('sessionCheck');

  cy.login('mufti@gmail.com', '12345678');
  cy.wait('@loginRequest');
  cy.wait('@sessionCheck');
  cy.wait(2000);
});

Cypress.Commands.add('loginAsEmployee', () => {
  cy.intercept('POST', '/api/auth/callback/credentials').as('loginRequest');
  cy.intercept('GET', '/api/auth/session').as('sessionCheck');

  cy.login('mufti@gmail.com', '12345678');
  cy.wait('@loginRequest');
  cy.wait('@sessionCheck');
  cy.wait(1000);
});

Cypress.Commands.add('loginWithInvalidCredentials', () => {
  cy.intercept('POST', '/api/auth/callback/credentials', {
    statusCode: 401,
    body: { error: 'Invalid credentials' },
  }).as('loginRequest');

  cy.login('wrong@example.com', 'wrongpassword');
  cy.wait('@loginRequest');
});

Cypress.Commands.add('loginWithNetworkError', () => {
  cy.intercept('POST', '/api/auth/callback/credentials', {
    forceNetworkError: true,
  }).as('loginRequest');

  cy.login('mufti@gmail.com', '12345678');
  cy.wait('@loginRequest');
});

// Type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
      loginAsEmployee(): Chainable<void>;
      loginWithInvalidCredentials(): Chainable<void>;
      loginWithNetworkError(): Chainable<void>;
    }
  }
}

export {};