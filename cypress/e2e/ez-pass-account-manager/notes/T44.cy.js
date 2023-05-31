Cypress._.times(1, (i) => {
    const accNumber = [ '50037164', '52112656', '52034047' ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T44 - EZ pass - Notes - Grid Functionality and search' + ' - ' + accType[i], () => {
        const gridHeaders = ['Date', 'Note Type', 'User', 'Content', 'Status', 'Notification']
        const dropdownItems = ['Last 30 days', 'Last 60 days', 'Last 90 days']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the History tab', () => {
            cy.tab('Notes')
            cy.contains('app-account-all-notes kendo-grid-toolbar button', 'Show All Notes').should('exist')
        });

        it('Grid headers', () => {
            cy.headers('app-account-all-notes', '', gridHeaders)
        });

        it('Search dropdown items', () => {
            cy.dropdownItems('app-account-all-notes kendo-grid-toolbar', dropdownItems)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-all-notes', ':eq(0)', '/Account/NotesList')
        });

        it('Pagination', () => {
            cy.page('app-account-all-notes', '/Account/NotesList')
        });

        it('Search functionality', () => {
            cy.verifyDateSearch('app-account-all-notes', 'Date', 'Last 30 days')
            cy.verifyDateSearch('app-account-all-notes', 'Date', 'Last 60 days')
            cy.verifyDateSearch('app-account-all-notes', 'Date', 'Last 90 days')
        });

        it('Show All/Only User Notes', () => {
            cy.contains('app-account-all-notes kendo-grid-toolbar button', 'Show All Notes').click()
            cy.pause()
            //TODO WIP
        });

        it('Download button', () => {
            cy.intercept('POST', '/Account/NoteToCsvExport').as('download');
            cy.contains('app-account-all-notes kendo-grid-toolbar button', 'Download').click()
            cy.wait('@download').its('response.statusCode').should('eq', 200);
        });
    });
})