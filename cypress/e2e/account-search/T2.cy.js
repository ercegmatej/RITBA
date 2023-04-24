describe('T2 - Account Search - Search by account number type (Individual, commercial, non-revenue, violation/unregistered, violation/violation)', () => {
    const accNumber = [ '50002183', '52112656', '1005068855', '1002231379', '52034047' ];
    const acc = [ 'Individual', 'Commercial', 'Unregistered', 'Violation', 'Non Revenue' ];
    it('Login', () => {
        cy.login('merceg', 'ritbaVPN%$532', 'Call Center')
    });

    it('Open the account', () => {
        for (let i=0; i<accNumber.length; i++) {
            cy.openAccount('Account Number', accNumber[i])
            if (acc[i] === 'Unregistered' || acc[i] === 'Violation') {
                cy.get('app-unregistered-account-basic-info').find('div').should('contain.text', acc[i])
                cy.get('app-unregistered-account-basic-info').find('div').should('contain.text', accNumber[i])
            }
            else {
                cy.get('app-account-basic-info').find('div').should('contain.text', acc[i])
                cy.get('app-account-basic-info').find('div').should('contain.text', accNumber[i])
            }
            cy.get('kendo-dialog-titlebar button').click()
            cy.get('app-account-search').should('be.visible')
            cy.get('app-account-manager').should('not.exist')
        }
    });
});