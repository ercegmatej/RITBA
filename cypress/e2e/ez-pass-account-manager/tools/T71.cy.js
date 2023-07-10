describe('T71 - EZ Pass - Tools - Convert to Commercial', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Create a new individual account', () => {
        //cy.createAcc('Individual')
    });

    it('Open the account', () => {
        
    });

    it('Convert to commercial', () => {
        cy.intercept('POST', '/Account/AccountConvertToCommercial').as('convert');
        cy.contains('app-account-manager button', 'Tools').click()
        cy.contains('kendo-popup li', 'Convert to Commercial').click()
        cy.popup('Convert to Commercial', 'Are you sure you want to Convert to Commercial?', 'Yes')
        
        cy.contains('kendo-dialog-titlebar', 'Convert to Commercial').should('be.visible')
        cy.field('app-convert-to-commercial', 'Company Name', 'CONVERT')
        cy.contains('kendo-dialog-actions button', 'Save').click()

        cy.popup('Convert to Commercial', 'Account has successfully converted to commercial.', 'Ok')
        cy.wait('@convert').its('response.statusCode').should('eq', 200)
    });

    it('Verify conversion', () => {
        cy.intercept('POST', '/Search/MatchingAccountsList').as('grid');
        cy.tab('History')
        cy.verifyGridData('app-account-history', 'New Value', 0, 'CONVERT')

        cy.get('[title="Close"]').click()
        cy.wait('@grid').its('response.statusCode').should('eq', 200)
        cy.verifyGridData('app-account-search', 'Company Name', 0, 'CONVERT')
    });
})