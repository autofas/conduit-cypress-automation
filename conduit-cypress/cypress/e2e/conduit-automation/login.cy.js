// Uses faker: https://www.npmjs.com/package/@faker-js/faker

describe('Login', () => {
    const landing_page = Cypress.config().baseUrl;

    it('Sign up', () => {
        cy.generate_account().then((account) => {
            cy.sign_up(account.test_username, account.test_email, account.test_password);
            cy.url('/').should('eq', landing_page);
        });
    });

    it('Sign up with same credentials', () => {
        cy.get_account().then((account) => {
            cy.sign_up(account.test_username, account.test_email, account.test_password);
            cy.url('/register').should('eq', landing_page + 'register');
            cy.get('.error-messages > :nth-child(1)').should('have.text', 'email has already been taken');
            cy.get('.error-messages > :nth-child(2)').should('have.text', 'username has already been taken');
        });
    });

    it('Log in', () => {
        cy.get_account().then((account) => {
            cy.sign_in(account.test_email, account.test_password);
            cy.url('/').should('eq', landing_page);
        });
    });

    it('Log in with wrong credentials', () => {
        let saveFile = false
        cy.generate_account(saveFile).then((account) => {
            cy.sign_in(account.test_email, account.test_password);
            cy.url('/').should('eq', landing_page + 'login');
            cy.get('.error-messages > li').should('have.text', 'email or password is invalid');
        });
    });

    it('Log out', () => {
        cy.get_account().then((account) => {
            cy.sign_in(account.test_email, account.test_password);
            cy.log_out();
            cy.url('/').should('eq', landing_page);
            cy.get('.nav-link').should('have.length', 4);
            cy.get(':nth-child(1) > .nav-link').should('contain.text', 'Home');
            cy.get(':nth-child(2) > .nav-link').should('have.text', 'Sign in');
            cy.get(':nth-child(3) > .nav-link').should('have.text', 'Sign up');
        });
    });
});