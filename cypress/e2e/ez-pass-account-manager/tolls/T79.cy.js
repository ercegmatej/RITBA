const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
const i = 0;
describe('T79 - EZ Pass - Tolls - Toll transfer', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open the account', () => {
        cy.openAccount('Account Number', accNumber[i])
    });

    it('Open the Tolls tab', () => {
        cy.tab('Tolls')
    });

    it('Warning pop up', () => {
        cy.contains('kendo-dropdownbutton', 'Tolls').click()
        cy.contains('kendo-popup li', 'Toll Transfer').click()
        cy.popup('Warning', 'Please select a toll to transfer', 'Ok')
    });

    it('Select a valid toll and go to transfer', () => {
        cy.itemsPerPage('app-account-tolls', '50', '/Tolls/AccountPassagesList')
        cy.get('app-account-tolls kendo-grid-list [aria-colindex="5"]').filter(':contains("Transponder")')
        .first().parents('tr').find('[type="checkbox"]:eq(0)').check()
        cy.contains('kendo-dropdownbutton', 'Tolls').click()
        cy.contains('kendo-popup li', 'Toll Transfer').click()
        
        cy.get('kendo-dialog-titlebar').should('contain.text', 'Toll Transfer')
        cy.contains('kendo-dialog-actions button', 'Save').click()
        cy.requiredError('app-toll-transfer', 'Reason For Transfer')
        cy.requiredError('app-toll-transfer', 'Comments')
    });

    it('Select a reason for transfer', () => {
        cy.field('app-toll-transfer', 'Reason For Transfer', ':first')
        cy.contains('kendo-dialog-actions button', 'Save').click()
        cy.popup('Warning', 'You must select an account first', 'Ok')
    });

    it('Populate the account search field', () => {
        cy.intercept('GET', '/Account/**').as('getAccount');
        cy.field('app-toll-transfer', 'Account Search', '50000000')
        cy.contains('app-toll-transfer button', 'Search Account').click()
        cy.popup('Warning', 'You have entered invalid account number', 'Ok')

        cy.field('app-toll-transfer', 'Account Search', accNumber[i])
        cy.contains('app-toll-transfer button', 'Search Account').click()
        cy.popup('Warning', 'Cannot be transferred to the same account.', 'Ok')

        cy.field('app-toll-transfer', 'Account Search', accNumber[i+1])
        cy.contains('app-toll-transfer button', 'Search Account').click()
        cy.wait('@getAccount').its('response.statusCode').should('eq', 200)
    });

    it('Save the transfer', () => {
        cy.intercept('POST', '/Tolls/TransferPassage').as('transferToll');
        cy.contains('kendo-dialog-actions button', 'Save').click()
        cy.wait('@transferToll').its('response.statusCode').should('eq', 200)
        cy.popup('Success', 'Toll Transfer successful', 'Ok')
    });

    it('Select a toll that has been reversed and choose the Toll Transfer', () => {
        cy.intercept('POST', '/Tolls/AccountPassagesList').as('getTolls');
        cy.get('#showAllTollsCheckbox').check()
        cy.wait('@getTolls').its('response.statusCode').should('eq', 200)

        cy.get('app-account-tolls kendo-grid-list [aria-colindex="19"] input:checked')
        .first().parents('tr').find('[type="checkbox"]:eq(0)').check()
        cy.contains('kendo-dropdownbutton', 'Tolls').click()
        cy.contains('kendo-popup li', 'Toll Transfer').click()
        cy.popup('Warning', 'Selected passage is not eligible for transfer', 'Ok')
    });

    it('Go to the transferred account and verify that the last toll is transferred type', () => {
        cy.get('[title="Close"]').click()
        cy.openAccount('Account Number', accNumber[i+1])
        cy.tab('Tolls')
        cy.verifyGridData('app-account-tolls', 'Trans Type', 0, 'Transferred')
    });
})