// ***********************************************
// This example commands.js shows you how to
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

Cypress.Commands.add('today', () => {
    const today = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate = today.toLocaleDateString('en-US', options);
    return cy.wrap({ date: formattedDate });
});

Cypress.Commands.add('sign_in', (test_email, test_password) => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(test_email);
    cy.get('input[name="password"]').type(test_password);
    cy.get('.btn.btn-lg.btn-primary.pull-xs-right').click();
});

Cypress.Commands.add('log_out', () => {
    // Go to Settings
    cy.visit('/settings');
    // Log out
    cy.get('.btn.btn-outline-danger').click();
});

Cypress.Commands.add('generate_account', (saveFile = true) => {
    const { faker } = require('@faker-js/faker');
    const new_account = {
        test_email: faker.internet.email(),
        test_username: faker.internet.userName(),
        test_password: faker.internet.password()
    };

    if (saveFile) {
        cy.writeFile('cypress/e2e/conduit-automation/test_accounts.json', {
            test_email: new_account.test_email,
            test_username: new_account.test_username,
            test_password: new_account.test_password
        });
    }
    return cy.wrap(new_account);
});

Cypress.Commands.add('get_account', () => {
    cy.readFile('cypress/e2e/conduit-automation/test_accounts.json').then((account) => { 
        return cy.wrap(account);
    });
});

Cypress.Commands.add('sign_up', (test_username, test_email, test_password) => {
    cy.visit('/register');
    cy.get('input[name="username"]').type(test_username);
    cy.get('input[name="email"]').type(test_email);
    cy.get('input[name="password"]').type(test_password);
    cy.get('.btn.btn-lg.btn-primary.pull-xs-right').click();
});