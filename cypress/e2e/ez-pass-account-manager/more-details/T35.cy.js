Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T35 - EZ Pass - More Details - Grid' + ' - ' + accType[i], () => {
        const gridHeaders1 = ['User Role', 'Contact Name', 'Email Address', 'Primary Phone', 'Evening Phone', 'PIN Number', 'User Password']
        const gridHeaders2 = ['Address Type', 'First Name', 'Last Name', 'Address 1', 'Address 2', 'City', 'State/Province', 'Country', 'Zip/Postal Code']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the More Details tab', () => {
            cy.tab('More Details')
        });

        it('Grid headers', () => {
            cy.headers('app-authorised-users', '', gridHeaders1)
            cy.headers('app-addresses-for', '', gridHeaders2)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-authorised-users', '', '')
            cy.sortGrid('app-addresses-for', '', '')
        });
    });
})