Cypress._.times(1, (i) => {
    const accNumber = [ '50002183', '52112656', '52034047' ];
    describe('T34 - EZ Pass - Account Links - Grid functionality', () => {
        it('Login', () => {
            cy.login('merceg', 'RITBAvpn%$532', 'Call Center')
        });
    
        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });
    });
})
