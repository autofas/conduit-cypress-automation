describe('Articles', () => {
    const { faker } = require('@faker-js/faker');

    beforeEach('Log in', () => {
        cy.readFile('cypress/e2e/conduit-automation/test_accounts.json').then((account) => {
            cy.sign_in(account.test_email, account.test_password);
        });
    });

    it('Create new article', () => {
        cy.wait(2000);
        cy.get('.container > .nav > :nth-child(2) > .nav-link').click();

        // Title
        const test_title = faker.hacker.phrase();
        cy.get(':nth-child(1) > .form-control').type(test_title)

        // Description
        const test_description = faker.hacker.phrase() + ' ' + faker.hacker.phrase();
        cy.get(':nth-child(2) > .form-control').type(test_description);

        // Body
        const test_body = faker.hacker.phrase() + ' ' + faker.hacker.phrase() + ' ' + faker.hacker.phrase();
        cy.get(':nth-child(3) > .form-control').type(test_body);

        // Tags
        const test_tags = test_description.split(' ').join(',');
        cy.get(':nth-child(4) > .form-control').type(test_tags);

        // Publish!
        cy.get('.btn.btn-lg.pull-xs-right.btn-primary').click();

        // Assertion: verify URL redirect
        cy.location('pathname').should('contain', '/article/');
        cy.url().then((current_url) => {
            cy.writeFile('cypress/e2e/conduit-automation/test_article.json', {
                test_title: test_title,
                test_description: test_description,
                test_body: test_body,
                test_url: current_url
            });
        });

        // Assertion: verify that the title matches with our input
        cy.get('h1').should('have.text', test_title);
        // Assertion: verify that the author is our username
        cy.readFile('cypress/e2e/conduit-automation/test_accounts.json').then((account) => {
            cy.get('.author').should('have.text', account.test_username);
        });
        // Assertion: verify that the date is our today's date
        cy.today().then((test) => {
            cy.get('.date').should('have.text', test.date);
        });
        // Assertion: verify that the description matches our input
        cy.get('.article-content > .col-xs-12 > :nth-child(1)').should('have.text', test_description);
        // Assertion: verify that the article body matches our input
        cy.get('.col-xs-12 > div > p').should('have.text', test_body);
    });

    it('Verify articles existence after logging out', () => {
        cy.log_out();
        cy.readFile('cypress/e2e/conduit-automation/test_article.json').then((article) => {
            cy.visit(article.test_url);

            // Verify the existence of the URL
            // Had to decode the current URL to match the saved URL
            cy.url().then((url) => {
                cy.wrap(decodeURI(url)).should('eq', article.test_url);
            });

            // Assertion: verify that the title matches with our input
            cy.get('h1').should('have.text', article.test_title);
            // Assertion: verify that the author is our username
            cy.readFile('cypress/e2e/conduit-automation/test_accounts.json').then((account) => {
                cy.get('.author').should('have.text', account.test_username);
            });
            // Assertion: verify that the date is our today's date
            cy.today().then((test) => {
                cy.get('.date').should('have.text', test.date);
            });
            // Assertion: verify that the description matches our input
            cy.get('.article-content > .col-xs-12 > :nth-child(1)').should('have.text', article.test_description);
            // Assertion: verify that the article body matches our input
            cy.get('.col-xs-12 > div > p').should('have.text', article.test_body);
        });
    });

    it('Verify article association to user account', () => {
        cy.wait(2000);
        cy.get('.col-md-9 > :nth-child(2)').should('not.have.text', 'No articles are here... yet.');
    });

    it('Create a comment after logging in', () => {
        cy.readFile('cypress/e2e/conduit-automation/test_article.json').then((article) => {
            cy.visit(article.test_url);
            //cy.get(':nth-child(3) > .col-xs-12 > p').should('not.have.text', 'Sign in  or  Sign up  to add comments on this article.');
        });
    });
});