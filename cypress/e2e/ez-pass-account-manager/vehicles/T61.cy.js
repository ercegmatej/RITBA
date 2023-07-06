Cypress._.times(1, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T61 - EZ Pass - Vehicles - Add, Edit, Delete' + ' - ' + accType[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Vehicles tab', () => {
            cy.tab('Vehicles')
        });

        it('Add New Vehicle window', () => {
            cy.get('app-account-vehicles kendo-grid-toolbar [title="Add"]').click()
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.requiredError('app-add-vehicle', 'Lic. Plate Number')
            cy.requiredError('app-add-vehicle', 'Veh. Make')
            cy.requiredError('app-add-vehicle', 'IAG Codes')
        });

        it('Populate the fields with data', () => {
            cy.field('app-add-vehicle', 'Veh. State/Province', 'Alabama')
            cy.contains('kendo-formfield', 'Plate Type').should('not.be.visible')
            cy.field('app-add-vehicle', 'Veh. State/Province', 'Rhode Island')
            cy.field('app-add-vehicle', 'Plate Type', ':first')

            cy.field('app-add-vehicle', 'Veh. Year', '2022')
            cy.field('app-add-vehicle', 'Veh. Make', 'AUDI')
            cy.field('app-add-vehicle', 'Veh. Model', 'A4')
            cy.field('app-add-vehicle', 'GVW', '2000')

            cy.field('app-add-vehicle', 'IAG Codes', '203')
            cy.verifyField('app-add-vehicle', 'Dual Tires', 'be.checked')

            cy.field('app-add-vehicle', 'Lic. Plate Number', '7357QA')
        });

        it('Temporary plate', () => {
            cy.field('app-add-vehicle', 'This is a temporary plate', 'check')
            cy.contains('app-add-vehicle kendo-formfield', 'Start Date').should('exist')
            cy.contains('app-add-vehicle kendo-formfield', 'End Date').should('exist')

            cy.calendar(1, '2023', 'Dec', '25')
        });

        it('Save', () => {
            cy.intercept('POST', '/Account/VehicleAdd').as('addVehicle');
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.wait('@addVehicle').its('response.statusCode').should('eq', 200)
            cy.popup('Success', 'New Vehicle has been added', 'Ok')
            cy.verifyGridData('app-account-vehicles', 'Lic. Plate', 0, '7357QA')
            cy.verifyGridData('app-account-vehicles', 'State', 0, 'RI')
            cy.verifyGridData('app-account-vehicles', 'End Date', 0, '12/25/2023')
            cy.get('app-account-vehicles kendo-grid-list tr:first [aria-colindex="16"] input').should('be.checked')
        });

        it('Click add again', () => {
            cy.get('app-account-vehicles kendo-grid-toolbar [title="Add"]').click()
        });

        it('Populate the fields with same data', () => {
            cy.field('app-add-vehicle', 'Plate Type', ':first')

            cy.field('app-add-vehicle', 'Veh. Year', '2022')
            cy.field('app-add-vehicle', 'Veh. Make', 'AUDI')
            cy.field('app-add-vehicle', 'Veh. Model', 'A4')
            cy.field('app-add-vehicle', 'GVW', '2000')

            cy.field('app-add-vehicle', 'IAG Codes', '203')
            cy.verifyField('app-add-vehicle', 'Dual Tires', 'be.checked')

            cy.field('app-add-vehicle', 'Lic. Plate Number', '7357QA')
        });

        it('Try to save', () => {
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.popup('Error', 'Vehicle already exists', 'Ok')
        });

        it('Change to valid vehicle data and save', () => {
            cy.intercept('POST', '/Account/VehicleAdd').as('addVehicle');
            cy.field('app-add-vehicle', 'Lic. Plate Number', '6357QA')
            cy.field('app-add-vehicle', 'This is a rental plate', 'check')
            cy.contains('app-add-vehicle kendo-formfield', 'Start Date').should('exist')
            cy.contains('app-add-vehicle kendo-formfield', 'End Date').should('exist')
            cy.calendar(1, '2023', 'Dec', '25')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.wait('@addVehicle').its('response.statusCode').should('eq', 200)
            cy.popup('Success', 'New Vehicle has been added', 'Ok')
            cy.wait(1000)
            cy.verifyGridData('app-account-vehicles', 'Lic. Plate', 0, '6357QA')
            cy.verifyGridData('app-account-vehicles', 'State', 0, 'RI')
        });

        it('Add new vehicle with no plate type', () => {
            cy.intercept('POST', '/Account/VehicleAdd').as('addVehicle');
            cy.get('app-account-vehicles kendo-grid-toolbar .k-i-plus').click()
            cy.field('app-add-vehicle', 'Veh. State/Province', 'Alabama')
            cy.contains('kendo-formfield', 'Plate Type').should('not.be.visible')
            cy.field('app-add-vehicle', 'Lic. Plate Number', '5357QA')
            cy.field('app-add-vehicle', 'Veh. Year', '2022')
            cy.field('app-add-vehicle', 'Veh. Make', 'AUDI')
            cy.field('app-add-vehicle', 'Veh. Model', 'A4')
            cy.field('app-add-vehicle', 'IAG Codes', ':first')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.wait('@addVehicle').its('response.statusCode').should('eq', 200)
            cy.popup('Success', 'New Vehicle has been added', 'Ok')
            cy.verifyGridData('app-account-vehicles', 'Lic. Plate', 0, '5357QA')
            cy.verifyGridData('app-account-vehicles', 'Plate Type', 0, '')
        });

        it('Edit the newly created vehicle', () => {
            cy.contains('app-account-vehicles kendo-grid-list td', '5357QA').click()
            cy.get('app-account-vehicles kendo-grid-toolbar [title="Edit"]').click()
            cy.field('app-add-vehicle', 'Veh. Model', 'QUATTRO')
            cy.get('app-add-vehicle [title="Update Plate Number"]').click()
            cy.field('app-new-lic-plate', 'New Lic. Plate', '6357QA')
            cy.contains('kendo-dialog-actions button', 'Confirm and Save').click()
            cy.popup('Error', 'Vehicle already exists', 'Ok')
            cy.field('app-new-lic-plate', 'New Lic. Plate', '4357QA')
            cy.contains('kendo-dialog-actions button', 'Confirm and Save').click()
            cy.contains('app-add-vehicle kendo-formfield', 'This is a temporary plate').find('input')
            .should('have.attr', 'readonly')
            cy.contains('app-add-vehicle kendo-formfield', 'This is a rental plate').find('input')
            .should('have.attr', 'readonly')
        });

        it('Click Save', () => {
            cy.intercept('POST', '/Account/VehicleUpdate').as('editVehicle');
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.wait('@editVehicle').its('response.statusCode').should('eq', 200)
            cy.popup('Success', 'Selected Vehicle has been updated', 'Ok')
            cy.verifyGridData('app-account-vehicles', 'Lic. Plate', 0, '4357QA')
            cy.verifyGridData('app-account-vehicles', 'Veh. Model', 0, 'QUATTRO')
        });

        it('Delete all created vehicles', () => {
            const plates = ['7357QA', '6357QA', '4357QA']
            plates.forEach(el => {
                cy.contains('app-account-vehicles kendo-grid-list td', el).click()
                cy.get('app-account-vehicles kendo-grid-toolbar [title="Delete"]').click()
                cy.popup('Warning', 'Would you like to remove the selected vehicle?', 'Yes')
                cy.wait(1000)
                cy.contains('app-account-vehicles kendo-grid-list td', el).should('not.exist')
            })
        });
    });
})