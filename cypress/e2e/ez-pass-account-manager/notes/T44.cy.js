Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('speed-violations'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T44 - EZ pass - Notes - Grid Functionality and search' + ' - ' + accType[i], () => {
        const gridHeaders = ['Date', 'Note Type', 'User', 'Content', 'Status', 'Notification', 'Attachment']
        const dropdownItems = ['All', 'Last 30 Days', 'Last 60 Days', 'Last 90 Days', 'Content']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Notes tab', () => {
            cy.tab('Notes')
            cy.contains('app-notes button', 'Show All Notes').should('exist')
            cy.contains('app-notes button', 'Show All Notes').click()
        });

        it('Grid headers', () => {
            cy.headers('app-account-all-notes', '', gridHeaders)
        });

        it('Search dropdown items', () => {
            cy.dropdownItems('app-notes .card-header', dropdownItems)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-all-notes', ':eq(0), :eq(6)', '/Account/NotesList')
        });

        it('Pagination', () => {
            cy.page('app-notes', '/Account/NotesList')
        });

        it('Content search', () => {
            cy.get('app-notes .card-header kendo-dropdownlist').click()
            cy.contains('kendo-popup li', 'Content').click()
            cy.contains('app-notes th', 'Content').click().click()
            cy.get(`app-notes kendo-grid-list tr:eq(2) [data-kendo-grid-column-index="3"]`).then(($td) => {
                const search = $td.text()
                cy.get(`app-notes kendo-textbox`).type(search + '{enter}')
                cy.wait(500)
                cy.get(`app-notes [data-kendo-grid-column-index="3"]`).each(($val) => {
                    const value = $val.text().toLocaleLowerCase()
                    expect(value).to.eq(search.toLocaleLowerCase())
                })
                cy.get(`app-notes [aria-label="Clear"]`).click()
            })
            cy.get(`app-notes .card-header kendo-dropdownlist`).first().click()
            cy.contains('kendo-popup li', 'All').click()
        });

        it('Date search functionality', () => {
            cy.verifyDateSearch('app-notes', 'Date', 'Last 30 Days', '/Account/NotesList')
            cy.verifyDateSearch('app-notes', 'Date', 'Last 60 Days', '/Account/NotesList')
            cy.verifyDateSearch('app-notes', 'Date', 'Last 90 Days', '/Account/NotesList')
        });

        it('Show Only User Notes', () => {
            cy.contains('app-notes button', 'Show Only User Notes').click()
            cy.dropdown('app-notes .card-header', 'All')
            cy.get('app-account-all-notes kendo-grid-list').should('not.exist')
            cy.get('app-account-user-notes kendo-grid-list').should('not.exist')
            cy.get('app-account-user-notes ul').should('exist')
        });

        it('Download button', () => {
            cy.intercept('POST', '/Account/NoteToCsvExport').as('download');
            cy.contains('app-notes button', 'Download').click()
            cy.wait('@download').its('response.statusCode').should('eq', 200);
        });
    });
})