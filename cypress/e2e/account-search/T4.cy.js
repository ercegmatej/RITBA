describe('T4 - Citation Search - General design and grid functionality', () => {
    const gridHeaders = ['Citation No.', 'Account No.', 'Entry Date', 'First Name', 'M. Name', 'Last Name', 'Address', 'City', 'State', 'ZIP', 'Lic. Plate', 'Plate State',
    'Cit. Status', 'Cit. Status Dt', 'Toll Balance', 'Fee Balance', 'Notice Status', 'Notice Status Dt', 'Plaza']
    const dropdownItems = ['Account Number', 'Citation Number', 'Last Name', 'First Name', 'Address', 'Plate Number', 'Company Name']
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open the citation search', () => {
        cy.sidenav('Citation Search', 'Citation Search')
    });

    it('Verify grid headers', () => {
        cy.headers('app-citation-search', ':first', gridHeaders)
    });

    it('Search drop down options', () => {
        cy.dropdownItems('app-citation-search kendo-grid-toolbar', dropdownItems)
    });

    it('Verify search functionalities', () => {
        cy.input('kendo-grid-toolbar', 'kendo-textbox', 'Text')
        cy.get('[title="Clear"]').click()
        cy.get('[title="Clear"]').should('not.exist')

        cy.get('[placeholder="Enter Account Number"]').parents('kendo-textbox').find('button').click()
        cy.popup('Warning', 'Please enter a search term first.', 'Ok')

        cy.search('app-citation-search kendo-grid-toolbar', 'First Name', 'John', '/Search/MatchingLegacyNoticesList')
    });

    it('Grid sorting', () => {
        cy.sortGrid('app-citation-search', ':first', '/Search/MatchingLegacyNoticesList')
    });

    it('Double click on a citation', () => {
        cy.intercept('GET', '/Invoice/**').as('getAcc');
        cy.get('app-citation-search kendo-grid-list tr:first').click()
        cy.wait('@getAcc').its('response.statusCode').should('eq', 200)

        cy.get('[title="Close"]').click()
    });

    it('Pagination', () => {
        cy.page('app-citation-search', '/Search/MatchingLegacyNoticesList')
    });
});