Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T51 - EZ Pass - Vehicles - Grid' + ' - ' + accType[i], () => {
        const gridHeaders = ['Lic. Plate', 'Plate Type', 'State', 'Veh. Make', 'Veh. Model', 'Veh. Year', 'Axles', 'GVW', 'IAG Code', 
        'IAG Class/desc.', 'Country', 'Start Date', 'End Date', 'DMV Hold', 'Is Rental', 'Is Temporary']
        const functionItems = ['DMV Hold', 'DMV Release']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Vehicles tab', () => {
            cy.tab('Vehicles')
        });

        it('Grid headers', () => {
            cy.headers('app-account-vehicles', '', gridHeaders)
        });

        it('Vehicles dropdown items', () => {
            cy.functionItems('app-account-vehicles', functionItems)
        });

        it('Grid sort', () => {
            cy.get('app-account-vehicles kendo-grid th:first').click().click()
            cy.sortGrid('app-account-vehicles', ':eq(9)', '')
        });
    });
})