describe('T3 - Invoice Search - General design and grid functionality', () => {
    const gridHeaders = ['Invoice Number', 'Invoice Status', 'Open Date', 'Notice Date', 'Notice Status', 'Financial Transaction Count', 'First Name', 'Last Name', 'Company Name',
    'Account Address', 'Open Transaction Count', 'Close Transaction Count', 'Disputed Transaction Count']
    const dropdownItems = ['Invoice Number', 'First Name', 'Last Name', 'Company Name', 'Plate Number', 'Account Address', 'FJNo', 'Last 4 Digits Card']
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open the inovice search', () => {
        cy.sidenav('Invoice Search', 'Invoice Search')
    });

    it('Verify grid headers', () => {
        cy.headers('app-invoice-search', ':first', gridHeaders)
    });

    it('Search drop down options', () => {
        cy.dropdownItems('app-invoice-search kendo-grid-toolbar', dropdownItems)
    });

    it('Verify search functionalities', () => {
        cy.input('kendo-grid-toolbar', 'kendo-textbox', 'Text')
        cy.get('[title="Clear"]').click()
        cy.get('[title="Clear"]').should('not.exist')

        cy.get('[placeholder="Search"]').parents('kendo-textbox').find('button').click()
        cy.popup('Warning', 'Please enter a search term first.', 'Ok')

        cy.search('app-invoice-search kendo-grid-toolbar', 'First Name', 'John', '/Search/MatchingInvoicesList')
    });

    it('Grid sorting', () => {
        cy.sortGrid('app-invoice-search', ':first', '/Search/MatchingInvoicesList')
    });

    it('Click on an invoice', () => {
        cy.intercept('GET', '/Invoice/**').as('getAcc');
        cy.get('app-invoice-search kendo-grid-list tr:first').click()
        cy.wait('@getAcc').its('response.statusCode').should('eq', 200)

        cy.get('[title="Close"]').click()
    });

    it('Pagination', () => {
        cy.page('app-invoice-search', '/Search/MatchingInvoicesList')
    });
});