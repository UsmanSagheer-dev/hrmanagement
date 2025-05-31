/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    fillPersonalInfoForm(data: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      gender: string;
      profileImage?: string;
    }): Chainable<void>;

    fillProfessionalInfoForm(data: {
      username: string;
      workEmail: string;
      jobType: string;
    }): Chainable<void>;
  }
}
