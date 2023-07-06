describe('T6 - Unbilled Transaction Search - Search (valid, invalid, partial)', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open the unbilled transaction search', () => {
        cy.sidenav('Unbilled Transaction Search', 'Unbilled Transaction Search')
    });

    it('Search by full plate', () => {
        cy.intercept('GET', '/Invoice/**').as('getAcc');
        cy.search('app-unbilled-transactions-search kendo-grid-toolbar', 'Plate Number', '123490', '/Search/MatchingUnbilledTransactionList')
        // cy.get('app-unbilled-transactions-search kendo-grid-list tr:first').click().dblclick()
        // cy.wait('@getAcc').its('response.statusCode').should('eq', 200)
        // cy.get('[title="Close"]').click()
    });

    it('Search by full invalid plate', () => {
        cy.search('app-unbilled-transactions-search kendo-grid-toolbar', 'Plate Number', '1234901', '/Search/MatchingUnbilledTransactionList')
        cy.get('app-unbilled-transactions-search kendo-grid-toolbar > div > div > span').should('contain.text', ' Global Search  0 Records Found ')
    });

    it('Search by partial plate', () => {
        cy.intercept('GET', '/Invoice/**').as('getAcc');
        cy.search('app-unbilled-transactions-search kendo-grid-toolbar', 'Plate Number', '1234', '/Search/MatchingUnbilledTransactionList')
        cy.get('app-unbilled-transactions-search kendo-grid-list [aria-colindex="2"]').each(($td) => {
            cy.get($td).should('contain.text', '1234')
        })
        // cy.get('app-unbilled-transactions-search kendo-grid-list tr:first').click().dblclick()
        // cy.wait('@getAcc').its('response.statusCode').should('eq', 200)
        // cy.get('[title="Close"]').click()
    });

    it('Search by valid Transaction ID number', () => {
        cy.intercept('GET', '/Invoice/**').as('getAcc');
        cy.search('app-unbilled-transactions-search kendo-grid-toolbar', 'Transaction ID', '53459870', '/Search/MatchingUnbilledTransactionList')
        cy.get('app-unbilled-transactions-search kendo-grid-list [aria-colindex="1"]').each(($td) => {
            cy.get($td).should('contain.text', '53459870')
        })
        // cy.get('app-unbilled-transactions-search kendo-grid-list tr:first').click().dblclick()
        // cy.wait('@getAcc').its('response.statusCode').should('eq', 200)
        // cy.get('[title="Close"]').click()
    });

    it('Search by invalid Transaction ID number', () => {
        cy.search('app-unbilled-transactions-search kendo-grid-toolbar', 'Transaction ID', '998899', '/Search/MatchingUnbilledTransactionList')
        cy.get('app-unbilled-transactions-search kendo-grid-toolbar > div > div > span').should('contain.text', ' Global Search  0 Records Found ')
    });
});