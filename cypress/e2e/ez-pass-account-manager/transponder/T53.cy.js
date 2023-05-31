Cypress._.times(3, (i) => {
    const accNumber = [ '51355556', '52112656', '52034047' ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T53 - EZ Pass - Transponders - Grid' + ' - ' + accType[i], () => {
        const gridHeaders1 = ['Transponder No.', 'Request Mode', 'Status', 'Status Date', 'Start Date', 'IAG Code', 'IAG Class/Desc.', 'Device Type', 'Mount Type', 'Device Color']
        const gridHeaders2 = ['Request Mode', 'Status', 'Axles', 'IAG ID', 'Veh. Class/Desc', 'Device Type', 'Mount Type', 'Device Color']
        const gridHeaders3 = ['External Id', 'Status Date', 'From Status', 'To Status']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Transponders tab', () => {
            cy.tab('Transponders')
        });

        it('Grid headers', () => {
            cy.headers('app-account-transponder kendo-grid:eq(0)', ':eq(0)', gridHeaders1)
            cy.headers('app-account-transponder kendo-grid:eq(1)', '', gridHeaders2)
            cy.headers('app-account-transponder kendo-grid:eq(2)', '', gridHeaders3)
        });

        it('Transponders dropdown items', () => {
            cy.functionItems('app-account-transponder kendo-grid-toolbar:eq(0)', 'Transfer')
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-transponder kendo-grid:eq(0)', ':eq(0)', '/Account/TranspondersList')
            cy.sortGrid('app-account-transponder kendo-grid:eq(1)', '', '/Account/TranspondersList')
            cy.sortGrid('app-account-transponder kendo-grid:eq(2)', '', '/Account/TranspondersList')
        });

        it('Pagination', () => {
            cy.page('app-account-transponder kendo-grid:eq(0)', '/Account/TranspondersList')
            cy.page('app-account-transponder kendo-grid:eq(1)', '/Account/TranspondersList')
            cy.page('app-account-transponder kendo-grid:eq(2)', '/Account/TranspondersList')
        });
    });
})