Cypress._.times(3, (i) => {
    const accNumber = [ '51355556', '52112656', '52034047' ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T38 - EZ Pass - History - Grid' + ' - ' + accType[i], () => {
        const gridHeaders = ['Date/Time', 'Operation', 'Field', 'Original Value', 'New Value', 'Reference Id', 'User', 'Access Channel']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the History tab', () => {
            cy.tab('History')
        });

        it('Grid headers', () => {
            cy.headers('app-account-history', '', gridHeaders)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-history', '', '/Account/HistoryList')
        });

        it('Pagination', () => {
            cy.page('app-account-history', '/Account/HistoryList')
        });
    });
})