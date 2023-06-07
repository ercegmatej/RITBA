describe('T2 - Account Search - Search by account number type (Individual, commercial, non-revenue, violation/unregistered, violation/violation)', () => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue'), Cypress.env('unregistered'), Cypress.env('violation') ];
    const accType = [ 'Individual', 'Commercial', 'Non Revenue', 'Unregistered', 'Violation'];
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open the account', () => {
        for (let i=0; i<accNumber.length; i++) {
            cy.openAccount('Account Number', accNumber[i])
            if (accType[i] === 'Unregistered' || accType[i] === 'Violation') {
                cy.get('app-unregistered-account-basic-info').find('div').should('contain.text', accType[i])
                cy.get('app-unregistered-account-basic-info').find('div').should('contain.text', accNumber[i])
            }
            else {
                cy.get('app-account-basic-info').find('div').should('contain.text', accType[i])
                cy.get('app-account-basic-info').find('div').should('contain.text', accNumber[i])
            }
            cy.get('kendo-dialog-titlebar button').click()
            cy.get('app-account-search').should('be.visible')
            cy.get('app-account-manager').should('not.exist')
        }
    });

    it('Non Revenue account requirements', () => {
        cy.openAccount('Account Number', accNumber[2])
        cy.contains('li', 'Replenishment').should('not.exist')
        cy.contains('li', 'Financials').should('not.exist')

        cy.contains('app-account-plan-information', 'Billing Type').should('not.be.visible')
        cy.contains('app-account-plan-information', 'Payment Method').should('not.be.visible')
        cy.contains('app-account-plan-information h5', 'Balance').should('not.be.visible')
        cy.contains('app-account-plan-information h5', 'Automatic Replenishment').should('not.be.visible')
        cy.contains('app-account-plan-information h5', 'Thresholds').should('not.be.visible')

        //TODO Tools verification
    });
});