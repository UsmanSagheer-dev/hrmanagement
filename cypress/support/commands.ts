/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginViaUI(email: string, password: string): Chainable<Element>
    fillPersonalInfoForm(data: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      gender: string;
      profileImage?: string;
    }): Chainable<Element>
    fillProfessionalInfoForm(data: {
      username: string;
      workEmail: string;
      jobType: string;
    }): Chainable<Element>
    attachFile(fileName: string): Chainable<Element>
  }
}

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

Cypress.Commands.add('loginViaUI', (email, password) => {
  cy.intercept('POST', '/api/login', {
    statusCode: 200,
    body: {
      token: 'fake-jwt-token',
      user: {
        id: 1,
        email,
        name: 'Usman'
      }
    }
  }).as('loginRequest');

  cy.visit('/auth/login');

  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('input[type="checkbox"]').check();
  cy.get('button[type="submit"]').click();

  cy.wait('@loginRequest');
});


// Personal Information Form fill
Cypress.Commands.add("fillPersonalInfoForm", (data) => {
  cy.get("input[placeholder='First Name']").type(data.firstName);
  cy.get("input[placeholder='Last Name']").type(data.lastName);
  cy.get("input[placeholder='Phone Number']").type(data.phone);
  cy.get("input[placeholder='Personal Email']").type(data.email);
  cy.get("select").select(data.gender);

  if (data.profileImage) {
    cy.get("input[type='file']").selectFile(`cypress/fixtures/${data.profileImage}`, { force: true });
  }
});

// Professional Information Form fill
Cypress.Commands.add("fillProfessionalInfoForm", (data) => {
  cy.get("input[placeholder='User Name']").type(data.username);
  cy.get("input[placeholder='Work Email Address']").type(data.workEmail);
  cy.get("select").select(data.jobType);
});

// Add file upload command
Cypress.Commands.add('attachFile', (fileName: string) => {
  cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, { force: true });
});
