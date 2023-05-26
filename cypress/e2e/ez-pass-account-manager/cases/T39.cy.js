Cypress._.times(1, (i) => {
    const accNumber = [ '50037164', '52112656', '52034047' ];
    describe('T38 - EZ Pass - Cases - Grid', () => {
        const gridHeaders = ['', '', 'Created Date', 'Case Number', 'Description', 'Department', 'Case Type', 'Status', 'Priority', 'Due Date', 'Source', 'Notified',
    'Escalation Count', 'Post', 'Last Updated']
        const dropdownItems = ['All', 'Case No.', 'Description', 'Department', 'Case Type', 'Case Status', 'User', 'Current Date', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Unread Email']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'))
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
            // cy.get('app-account-cases kendo-pager kendo-dropdownlist').click()
            // cy.contains('kendo-popup li', /^5$/).click()
            // cy.wait(1000)
        });

        it('Verify search', () => {
            cy.verifySearch('app-account-cases', 'Case No.', 'Case Number', '/CaseManagement/CasesList')
            cy.verifySearch('app-account-cases', 'Description', 'Description', '/CaseManagement/CasesList')
            cy.verifySearch('app-account-cases', 'Department', 'Department', '/CaseManagement/CasesList')
            cy.verifySearch('app-account-cases', 'Case Type', 'Case Type', '/CaseManagement/CasesList')
            cy.verifySearch('app-account-cases', 'Case Status', 'Case Status', '/CaseManagement/CasesList')
            cy.verifySearch('app-account-cases', 'User', 'User', '/CaseManagement/CasesList')
            cy.verifyDateSearch('app-account-cases', 'Date', 'Current Date')
            cy.verifyDateSearch('app-account-cases', 'Date', 'Last 7 Days')
            cy.verifyDateSearch('app-account-cases', 'Date', 'Last 14 Days')
            cy.verifyDateSearch('app-account-cases', 'Date', 'Last 30 Days')
        });
        //TODO WIP
    });
})