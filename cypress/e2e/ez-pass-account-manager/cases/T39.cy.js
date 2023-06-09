Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T38 - EZ Pass - Cases - Grid' + ' - ' + accType[i], () => {
        const gridHeaders = ['', '', 'Created Date', 'Case Number', 'Description', 'Department', 'Case Type', 'Status', 'Priority', 'Due Date', 'Source', 'Notified',
    'Escalation Count', 'Post', 'Last Updated']
        const dropdownItems = ['All', 'Case No.', 'Description', 'Department', 'Case Type', 'Case Status', 'User', 'Current Date', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Unread Email']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Cases tab', () => {
            cy.tab('Cases')
        });

        it('Grid headers', () => {
            cy.headers('app-account-cases', '', gridHeaders)
        });

        it('Dropdown items', () => {
            cy.dropdownItems('app-account-cases kendo-grid-toolbar', dropdownItems)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-cases', ':eq(0),:eq(1),:eq(13)', '/CaseManagement/CasesList')
        });

        it('Pagination', () => {
            cy.page('app-account-cases', '/CaseManagement/CasesList')
        });

        it('Verify search', () => {
            cy.intercept('POST', Cypress.env('ip') + '/CaseManagement/CasesList').as('search')

            cy.verifySearch('app-account-cases', 'Case No.', 'Case Number', '/CaseManagement/CasesList')
            cy.verifySearch('app-account-cases', 'Description', 'Description', '/CaseManagement/CasesList')
            cy.verifySearch('app-account-cases', 'Department', 'Department', '/CaseManagement/CasesList')
            cy.verifySearch('app-account-cases', 'Case Type', 'Case Type', '/CaseManagement/CasesList')
            cy.verifySearch('app-account-cases', 'Case Status', 'Status', '/CaseManagement/CasesList')

            cy.get('app-account-cases kendo-grid-toolbar kendo-dropdownlist:first').click()
            cy.contains('kendo-popup li', 'User').click()
            cy.get('app-account-cases kendo-grid-toolbar kendo-dropdownlist:eq(1)').click()
            cy.get('kendo-popup li:eq(0)').click()
            cy.wait('@search').its('response.statusCode').should('eq', 200)

            cy.verifyDateSearch('app-account-cases', 'Created Date', 'Current Date')
            cy.verifyDateSearch('app-account-cases', 'Created Date', 'Last 7 Days')
            cy.verifyDateSearch('app-account-cases', 'Created Date', 'Last 14 Days')
            cy.verifyDateSearch('app-account-cases', 'Created Date', 'Last 30 Days')

            cy.get('app-account-cases kendo-grid-toolbar kendo-dropdownlist:first').click()
            cy.contains('kendo-popup li', 'Unread Email').click()
            cy.wait('@search').its('response.statusCode').should('eq', 200)
            cy.wait(1000)
            cy.get('app-account-cases kendo-grid-list tr').then(($tr) => {
                if (!$tr.text().includes('No records available.')) {
                    cy.get($tr).find('td:eq(0)').should('have.class', 'k-i-email')
                }
            })
        });
    });
})