Cypress._.times(2, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial') ];
    const accType = [ 'Individual', 'Commercial'];
    describe('T37 - EZ Pass - Financials - Grid' + ' - ' + accType[i], () => {
        const gridHeaders = ['Date', 'Description', 'Payment Type', 'Credit', 'Debit', 'Balance', 'FJNo', 'Transaction Type', 'Message', 'PNRef', 'Payment Detail', 'Check Date', 'CSR Id', 'ICN Id', 'Reversal FjNo']
        const functionItems = ['Reverse Payment', 'Payment Transfer']
        const dropdownItems = ['All', 'Reversal  FJ No', 'Credit', 'Debit', 'FJ No', 'Balance', 'Message', 'Description', 'Today', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
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

        it('Dropdown items', () => {
            cy.dropdownItems('app-account-financial kendo-grid-toolbar', dropdownItems)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-financial', '', '/Financial/AccountTransactionsList')
        });

        it('Pagination', () => {
            cy.page('app-account-financial', '/Financial/AccountTransactionsList')
            cy.get('app-account-financial kendo-pager kendo-dropdownlist').click()
            cy.contains('kendo-popup li', /^5$/).click()
            cy.wait(1000)
        });

        it('Verify search', () => {
            cy.verifySearch('app-account-financial', 'Reversal FJ No', 'Reversal FjNo', '/Financial/AccountTransactionsList')
            cy.verifyMoney('app-account-financial', 'Credit', 'Credit', '/Financial/AccountTransactionsList')
            cy.verifyMoney('app-account-financial', 'Debit', 'Debit', '/Financial/AccountTransactionsList')
            cy.verifySearch('app-account-financial', /^FJ No$/, 'FJNo', '/Financial/AccountTransactionsList')
            cy.verifyMoney('app-account-financial', 'Balance', 'Balance', '/Financial/AccountTransactionsList')
            cy.verifySearch('app-account-financial', 'Message', 'Message', '/Financial/AccountTransactionsList')
            cy.verifySearch('app-account-financial', 'Description', 'Description', '/Financial/AccountTransactionsList')
            cy.verifyDateSearch('app-account-financial', 'Date', 'Today', '/Financial/AccountTransactionsList')
            cy.verifyDateSearch('app-account-financial', 'Date', 'Last 7 Days', '/Financial/AccountTransactionsList')
            cy.verifyDateSearch('app-account-financial', 'Date', 'Last 14 Days', '/Financial/AccountTransactionsList')
            cy.verifyDateSearch('app-account-financial', 'Date', 'Last 30 Days', '/Financial/AccountTransactionsList')
        });

        it('Exclude tolls', () => {
            cy.get('app-account-financial kendo-grid-toolbar kendo-dropdownlist').first().click()
            cy.contains('kendo-popup li', 'All').click()

            cy.get('app-account-financial kendo-pager kendo-dropdownlist').click()
            cy.contains('kendo-popup li', /^100$/).click()
            cy.wait(2000)

            cy.get('app-account-financial [data-kendo-grid-column-index="7"]').then(($type) => {
                const before = $type.length
                cy.get($type).each(($td) => {
                    cy.get($td).should('not.contain.text', 'TOLL')
                })
                cy.get('app-account-financial kendo-grid-toolbar [type="checkbox"]').uncheck()
                cy.wait(500)
                cy.get('app-account-financial kendo-pager-info').then(($numberOfItems) => {
                    const numberOfItems = $numberOfItems.text()
                    if (numberOfItems.includes(before)) {
                    }
                    else {
                        cy.get('app-account-financial [data-kendo-grid-column-index="7"]').should('contain.text', 'TOLL')
                    }
                })
            })
        });

        it('Download', () => {
            cy.contains('app-account-financial kendo-dropdownbutton', 'Download').click()
            cy.get('li:first').click()
        });
    });
})