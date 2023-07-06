Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T34 - EZ Pass - Account Links - Grid functionality' + ' - ' + accType[i], () => {
        const gridHeaders = ['Account Number', 'Plate No', 'Number of Citations', 'Amount Due', 'Address', 'Linked Account Type']
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

        it('Pagination', () => {
            cy.page('app-account-linked-accounts', '')
        });

        it('Total amount', () => {
            let total = 0;
            cy.get('app-account-linked-accounts kendo-grid-list tr').then(($tr) => {
                if (!$tr.text().includes('No records available.')) {
                    cy.get($tr).find('td:eq(3)').each(($amountDue) => {
                        const trAmount = $amountDue.text()
                        const slice = trAmount.slice(1, 0)
                        const amount = parseFloat(slice).toFixed(2)
                        total += amount;
                    })
                }
            })
            cy.get('app-account-linked-accounts kendo-grid-toolbar').should('contain.text', 'Total Amount: $' + total)
        });
        //TODO Open acc from grid
    });
})
