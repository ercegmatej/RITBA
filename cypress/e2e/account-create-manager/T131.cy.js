Cypress._.times(1, (i) => {
    const type = ['Individual', 'Commercial', 'Non Revenue']
    describe('T131 - Create new E-Z pass acc - duplicate vehicles - ' + type[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });
    
        it('Open create new account', () => {
            cy.sidenav('Account Establishment', 'New E-ZPass Account')
        });
    
        it('Fill out required fields', () => {
            cy.mandatoryFields()
        });
    
        it('Account Plan', () => {
            cy.accountPlan(type[i], 'Credit Card', 'Email', 'Email')
            if (type[i] !== 'Non Revenue') {
                cy.newCreditCard(Cypress.env('VISA'))
            }
            if (type[i] !== 'Individual') {
                cy.field('app-contact-information', 'Company Name', type[i])
            }
        });

        it('Add new vehicle (already used)', () => {
            cy.contains('li', 'Vehicles').click()
            cy.get('app-account-vehicles [title="Add"]').click()
            cy.wait(500)
            cy.field('app-add-vehicle', 'Veh. Country', 'United States')
            cy.field('app-add-vehicle', 'Veh. State/Province', 'Colorado')
            cy.field('app-add-vehicle', 'Lic. Plate Number', 'WW33')
            cy.field('app-add-vehicle', 'Veh. Year', '2019')
            cy.field('app-add-vehicle', 'Veh. Make', 'AUDI')
            cy.field('app-add-vehicle', 'Veh. Model', 'A7')
            cy.field('app-add-vehicle', 'GVW', '3000')
            cy.field('app-add-vehicle', 'IAG Codes', ':first')
            cy.contains('app-add-vehicle kendo-formfield', 'Lic. Plate Number').parents('div').find('kendo-formerror').should('contain.text', 'Lic. Plate Number already exists')
        });

        it('Add vehicle with valid data', () => {
            cy.contains('kendo-dialog-actions button', 'Cancel').click()
            cy.addVehicle()
        });

        it('Try to add vehicle with the same plate', () => {
            cy.get('app-account-vehicles kendo-grid-list tr:first [aria-colindex="1"]').then(($td) => {
                const plate = $td.text()
                
                cy.get('app-account-vehicles [title="Add"]').click()
                cy.wait(500)
                cy.field('app-add-vehicle', 'Veh. Country', 'United States')
                cy.field('app-add-vehicle', 'Veh. State/Province', 'Rhode Island')
                cy.field('app-add-vehicle', 'Plate Type', ':first')
                cy.field('app-add-vehicle', 'Lic. Plate Number', plate)
                cy.field('app-add-vehicle', 'Veh. Year', '2019')
                cy.field('app-add-vehicle', 'Veh. Make', 'AUDI')
                cy.field('app-add-vehicle', 'Veh. Model', 'A7')
                cy.field('app-add-vehicle', 'GVW', '3000')
                cy.field('app-add-vehicle', 'IAG Codes', ':first')
                cy.contains('kendo-dialog-actions button', 'Save').click()
                cy.popup('Error', 'Vehicle already added', 'Ok')
            })
        });

        it('Try to delete the created vehicle', () => {
            cy.contains('kendo-dialog-actions button', 'Cancel').click()
            cy.get('app-account-vehicles kendo-grid-list tr:first [aria-colindex="1"]').click()
            cy.get('app-account-vehicles [title="Delete"]').click()
            cy.popup('Warning', 'At least one active vehicle is required in Account', 'Ok')
        });
    })
})
