Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T86 - EZ Pass - Vehicles - DMV Hold and DMV release' + ' - ' + accType[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Vehicles tab', () => {
            cy.tab('Vehicles')
        });

        it('DMV Hold - no vehicles selected', () => {
            cy.contains('app-account-vehicles kendo-dropdownbutton', 'Vehicles').click()
            cy.contains('kendo-popup li', 'DMV Hold').click()
            cy.popup('Info', 'No Vehicles selected', 'Ok')
        });

        it('DMV Hold - valid vehicle selected', () => {
            cy.intercept('POST', '/Account/VehicleDmvHoldStatusUpdate').as('dmvHold');
            cy.get('app-account-vehicles kendo-grid-list tr:first').click()
            cy.contains('app-account-vehicles kendo-dropdownbutton', 'Vehicles').click()
            cy.contains('kendo-popup li', 'DMV Hold').click()
            cy.popup('Confirm', 'Do you want to place a DMV Hold on selected vehicle?', 'Yes')
            cy.calendar(0, '2023', 'Dec', '25')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.wait('@dmvHold').its('response.statusCode').should('eq', 200)
            cy.wait(500)
        });

        it('Verify change', () => {
            cy.verifyGridData('app-account-vehicles', 'DMV Hold', 0, 'DMV HOLD')
        });

        it('DMV Hold - hold vehicle selected', () => {
            cy.get('app-account-vehicles kendo-grid-list tr:first').click()
            cy.contains('app-account-vehicles kendo-dropdownbutton', 'Vehicles').click()
            cy.contains('kendo-popup li', 'DMV Hold').click()
            cy.popup('Warning', 'DMV Hold is already placed on selected vehicle', 'Ok')
        });

        it('Reopen account and check header update', () => {
            cy.get('[title="Close"]').click()
            cy.openAccount('Account Number', accNumber[i])
            cy.get('app-account-manager app-account-basic-info div .dmv-hold').should('exist')
        });

        it('DMV Release - no vehicles selected', () => {
            cy.tab('Vehicles')
            cy.contains('app-account-vehicles kendo-dropdownbutton', 'Vehicles').click()
            cy.contains('kendo-popup li', 'DMV Release').click()
            cy.popup('Info', 'No Vehicles selected', 'Ok')
        });

        it('DMV Release - hold vehicle selected', () => {
            cy.intercept('POST', '/Account/VehicleDmvHoldStatusUpdate').as('dmvHold');
            cy.get('app-account-vehicles kendo-grid-list tr:first').click()
            cy.contains('app-account-vehicles kendo-dropdownbutton', 'Vehicles').click()
            cy.contains('kendo-popup li', 'DMV Release').click()
            cy.popup('Confirm', 'Do you want to place a DMV Release on selected vehicle?', 'Yes')
            cy.wait('@dmvHold').its('response.statusCode').should('eq', 200)
            cy.verifyGridData('app-account-vehicles', 'DMV Hold', 0, '')
        });
    });
})