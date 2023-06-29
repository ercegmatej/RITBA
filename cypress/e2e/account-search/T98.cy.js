describe('T98 - Account Search - Search by other terms (valid/invalid)', () => {
    const valid = [Cypress.env('individual'), 'KENNEDY', 'GERARD', '03200251011', 'DLY7416', '0987654321', 'TEST', 'test@test.com', '9903', 'BUSINESS', '12345', '134242431', '116489267052', '1234']
    const invalid = ['0000', 'xyz', 'xyz', '0000', 'XYZ123', '30000', 'xyz', 'xyz@xyz.com', '0000', 'xyz', '00000', '30000', '30000', '0000']
    const dropdownItems = ['Account Number', 'Last Name', 'First Name', 'Transponder Number', 'Plate Number', 'Day Time Phone', 'Address',
    'Email Address', 'Last 4 digits Card', 'Company Name', 'Check Number', 'FJNo', 'PNRef', 'ACH Last 4 Digits']
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Search valid and invalid terms', () => {
        for(let i=0; i<valid.length; i++) {
            cy.search('app-account-search kendo-grid-toolbar', dropdownItems[i], valid[i], '/Search/MatchingAccountsList')
            cy.wait(3000)
            cy.get('app-root').then(($root) => {
                if($root.find('app-account-manager').length > 0) {
                    cy.get('kendo-dialog-titlebar [title="Close"]').click()
                }
            })
            cy.search('app-account-search kendo-grid-toolbar', dropdownItems[i], invalid[i], '')
            cy.get('app-account-search kendo-grid-toolbar > div > div > span').should('contain.text', ' Global Search  0 Records Found ')
        }
    });
});