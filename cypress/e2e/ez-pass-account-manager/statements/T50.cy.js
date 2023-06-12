Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T50 - EZ Pass - Statements - Grid' + ' - ' + accType[i], () => {
        const gridHeaders = ['Statement Number', 'Statement Date', 'New Charge', 'Closing Balance', 
        'Toll Charges', 'Video Toll Charges', 'Fee', 'Payments', 'Refunds', 'Due Date', 'Delivery Status']
        const dropdownItems = ['All', 'Statement Number', 'Today', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Statements tab', () => {
            cy.tab('Statements')
        });

        it('Grid headers', () => {
            cy.headers('app-account-billing-statements', '', gridHeaders)
        });

        it('Function items', () => {
            cy.functionItems('app-account-billing-statements', 'Resend Statement')
        });

        it('Dropdown items', () => {
            cy.dropdownItems('app-account-billing-statements kendo-grid-toolbar', dropdownItems)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-billing-statements', ':eq(0)', '/Account/StatementsList')
        });

        it('Pagination', () => {
            cy.page('app-account-billing-statements', '/Account/StatementsList')
        });

        it('Verify search', () => {
            cy.verifySearch('app-account-billing-statements', 'Statement Number', 'Statement Number', '/Account/StatementsList')
            cy.verifyDateSearch('app-account-billing-statements', 'Statement Date', 'Today', '/Account/StatementsList')
            cy.verifyDateSearch('app-account-billing-statements', 'Statement Date', 'Last 7 Days', '/Account/StatementsList')
            cy.verifyDateSearch('app-account-billing-statements', 'Statement Date', 'Last 14 Days', '/Account/StatementsList')
            cy.verifyDateSearch('app-account-billing-statements', 'Statement Date', 'Last 30 Days', '/Account/StatementsList')
        });
    });
})