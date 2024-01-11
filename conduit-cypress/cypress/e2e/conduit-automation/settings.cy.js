describe('Settings', () => {
    before('Log in', () => {
        cy.get_account().then((account) => {
            cy.sign_in(account.test_email, account.test_password);
        });
    });

    it('Update user settings', () => {
        cy.visit('/settings');

        const { faker } = require('@faker-js/faker');

        const test_avatar = faker.internet.avatar();
        cy.get(':nth-child(1) > .form-control').clear().type(test_avatar);
        const test_bio = faker.hacker.phrase();
        cy.get(':nth-child(3) > .form-control').type(test_bio);
        const new_test_email = faker.internet.email();
        cy.get(':nth-child(4) > .form-control').type(new_test_email);
        const new_test_password = faker.internet.password();
        cy.get(':nth-child(5) > .form-control').type(new_test_password);
        // Update!
        cy.get('.btn.btn-lg.btn-primary.pull-xs-right').click();
        // This test will fail because the page code throws an exception
        // Adding details
        cy.on('uncaught:exception', (err, runnable) => {
            throw new Error("Cypress details: " + err);
        });
    });
});