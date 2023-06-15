Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T53 - EZ Pass - Tolls - Grid' + ' - ' + accType[i], () => {
        const gridHeaders = ['Dispute', 'Agency', 'Transponder', 'Lic. Plate', 'Trans Type', 'Trans Date', 'Post Date', 'Entry Time', 'Exit Time', 'Entry Plaza',
    'Exit Plaza', 'Entry Lane', 'Exit Lane', 'Veh. Class', 'Plan/Promotion', 'Fare Type', 'Balance', 'Fare', 'Reversed', 'Adjusted']
        const functionItems = ['Toll Transfer', 'View Image', 'Dispute Toll', 'Toll Reversal', 'Toll Adjustment']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Transponders tab', () => {
            cy.tab('Tolls')
        });

        it('Grid headers', () => {
            cy.headers('app-account-tolls kendo-grid:eq(0)', '', gridHeaders)
        });

        it('Tolls dropdown items', () => {
            cy.functionItems('app-account-tolls kendo-grid-toolbar:eq(0)', functionItems)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-tolls kendo-grid:eq(0)', ':eq(0)', '/Tolls/AccountPassagesList')
        });

        it('Pagination', () => {
            cy.page('app-account-tolls kendo-grid:eq(0)', '/Tolls/AccountPassagesList')
        });

        it('Show All Tolls', () => {
            cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').should('not.be.checked')
            cy.get('app-account-tolls kendo-pager kendo-dropdownlist').click()
            cy.contains('kendo-popup li', /^100$/).click()
            cy.wait(2000)

            cy.get('app-account-tolls [data-kendo-grid-column-index="18"]').then(($reversed) => {
                const before = $reversed.length
                cy.get($reversed).each(($td) => {
                    cy.get($td).should('not.be.checked')
                })
                cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').check()
                cy.wait(500)
                cy.get('app-account-tolls kendo-pager-info').then(($numberOfItems) => {
                    const numberOfItems = $numberOfItems.text()
                    if (numberOfItems.includes(before)) {
                    }
                    else {
                        cy.get('app-account-tolls [data-kendo-grid-column-index="18"]').should('be.checked')
                    }
                })
            })
        });

        it('Download button', () => {
            cy.intercept('POST', '/Tolls/TollsToCsvExport').as('download');
            cy.contains('app-account-tolls button', 'Download').click()
            cy.wait('@download').its('response.statusCode').should('eq', 200);
        });//! API
    });
})