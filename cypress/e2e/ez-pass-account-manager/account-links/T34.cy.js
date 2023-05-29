Cypress._.times(3, (i) => {
    const accNumber = [ '51355556', '52112656', '52034047' ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T34 - EZ Pass - Account Links - Grid functionality' + ' - ' + accType[i], () => {
        const gridHeaders = ['Account Number', 'Plate No.', 'Number of Citations', 'Amount Dute', 'Address', 'Linked Account Type']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });
    
        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Account Links tab', () => {
            cy.tab('Account Links')
        });

        it('Grid headers', () => {
            cy.headers('app-account-linked-accounts', '', gridHeaders)
            cy.sortGrid('app-account-linked-accounts', '', '')
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-linked-accounts', '', '')
        });

        //TODO WIP
    });
})
