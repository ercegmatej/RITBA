describe('T5 - Unbilled Transaction Search - General design and grid functionality', () => {
    const gridHeaders = ['Transaction Number', 'Plate Number', 'Plate State', 'Plate Type', 'Transaction Date', 'Toll Amount']
    const dropdownItems = ['Plate Number', 'Transaction ID']
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open the unbilled transaction search', () => {
        cy.sidenav('Unbilled Transaction Search', 'Unbilled Transaction Search')
    });

    it('Verify grid headers', () => {
        cy.headers('app-unbilled-transactions-search', ':first', gridHeaders)
    });

    it('Search drop down options', () => {
        cy.dropdownItems('app-unbilled-transactions-search kendo-grid-toolbar', dropdownItems)
    });

    it('Verify search functionalities', () => {
        cy.input('kendo-grid-toolbar', 'kendo-textbox', 'Text')
        cy.get('[title="Clear"]').click()
        cy.get('[title="Clear"]').should('not.exist')

        cy.get('[placeholder="Search"]').parents('kendo-textbox').find('button').click()
        cy.popup('Warning', 'Please enter a search term first.', 'Ok')

        cy.search('app-unbilled-transactions-search kendo-grid-toolbar', 'Plate Number', '1234', '/Search/MatchingUnbilledTransactionList')
    });

    it('Grid sorting', () => {
        cy.sortGrid('app-unbilled-transactions-search', ':first', '/Search/MatchingUnbilledTransactionList')
    });

    it('Double click on a citation', () => {
        cy.intercept('GET', '/Invoice/**').as('getAcc');
        cy.get('app-unbilled-transactions-search kendo-grid-list tr:first').click()
        cy.wait('@getAcc').its('response.statusCode').should('eq', 200)

        cy.get('[title="Close"]').click()
    });

    it('Pagination', () => {
        cy.page('app-unbilled-transactions-search', '/Search/MatchingUnbilledTransactionList')
    });
});