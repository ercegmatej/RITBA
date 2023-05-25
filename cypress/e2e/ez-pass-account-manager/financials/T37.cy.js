Cypress._.times(1, (i) => {
    const accNumber = [ '51355556', '52112656', '52034047' ];
    describe('T37 - EZ Pass - Financials - Grid', () => {
        const gridHeaders = ['Date', 'Description', 'Payment Type', 'Credit', 'Debit', 'Balance', 'FJNo', 'Transaction Type', 'Message', 'PNRef', 'Payment Details', 'Cheque Date', 'CSR Id']
        const functionItems = ['Reverse Payment', 'Payment Transfer']
        const dropdownItems = ['All', 'Reversal FJNo', 'Credit', 'Debit', 'FJNo', 'Balance', 'Message', 'Description', 'Today', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'))
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Financials tab', () => {
            cy.tab('Financials')
        });

        it('Grid headers', () => {
            cy.headers('app-account-financial', '', gridHeaders)
        });

        it('Function items', () => {
            cy.functionItems('app-account-financial', functionItems)
        });

        // it('Dropdown items', () => {
        //     cy.dropdownItems('app-account-financial kendo-grid-toolbar', dropdownItems)
        // });

        // it('Grid sort', () => {
        //     cy.sortGrid('app-account-financial', '', '/Financial/AccountTransactionsList')
        // });

        // it('Pagination', () => {
        //     cy.page('app-account-financial', '/Financial/AccountTransactionsList')
        //     cy.get('app-account-financial kendo-pager kendo-dropdownlist').click()
        //     cy.contains('kendo-popup li', /^5$/).click()
        //     cy.wait(1000)
        // });

        // it('Verify search', () => {
        //     // cy.verifySearch('app-account-financial', 'Reversal FJNo', 'PNRef', '/Financial/AccountTransactionsList')
        //     // cy.verifySearch('app-account-financial', 'Credit', 'Credit', '/Financial/AccountTransactionsList')
        //     // cy.verifySearch('app-account-financial', 'Debit', 'Debit', '/Financial/AccountTransactionsList')
        //     // cy.verifySearch('app-account-financial', 'FJNo', 'FJNo', '/Financial/AccountTransactionsList')
        //     cy.verifyMoney('app-account-financial', 'Balance', 'Balance', '/Financial/AccountTransactionsList')
        //     cy.verifySearch('app-account-financial', 'Message', 'Message', '/Financial/AccountTransactionsList')
        //     cy.verifySearch('app-account-financial', 'Description', 'Description', '/Financial/AccountTransactionsList')
        //     cy.verifyDateSearch('app-account-financial', 'Date', 'Today')
        //     cy.verifyDateSearch('app-account-financial', 'Date', 'Last 7 Days')
        //     cy.verifyDateSearch('app-account-financial', 'Date', 'Last 14 Days')
        //     cy.verifyDateSearch('app-account-financial', 'Date', 'Last 30 Days')
        // });

        it('Exclude tolls', () => {
            cy.get('app-account-financial kendo-grid-toolbar kendo-dropdownlist').first().click()
            cy.contains('kendo-popup li', 'All').click()

            cy.get('app-account-financial kendo-pager kendo-dropdownlist').click()
            cy.contains('kendo-popup li', /^100$/).click()
            cy.wait(2000)

            cy.get('app-account-financial [data-kendo-grid-column-index="7"]').each(($type) => {
                cy.get($type).should('not.contain.text', 'TOLL')
            })
            //TODO Length before and after
            cy.get('app-account-financial app-account-financial kendo-grid-toolbar [type="checkbox"]').uncheck()
            cy.get('[data-kendo-grid-column-index="7"]').each(($type) => {
                cy.get($type).should('contain.text', 'TOLL')
            })
        });

        it('Download', () => {
            
        });
    });
})