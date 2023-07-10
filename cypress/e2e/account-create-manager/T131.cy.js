Cypress._.times(3, (i) => {
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
            cy.verifyField('app-add-vehicle', 'Veh. Country', 'United States')
            cy.field('app-add-vehicle', 'Veh. State/Province', 'Colorado')
            cy.field('app-add-vehicle', 'Lic. Plate Number', 'WW33')
            cy.field('app-add-vehicle', 'Veh. Year', '2019')
            cy.field('app-add-vehicle', 'Veh. Make', 'AUDI')
            cy.field('app-add-vehicle', 'Veh. Model', 'A7')
            cy.field('app-add-vehicle', 'GVW', '3000')
            cy.field('app-add-vehicle', 'IAG Codes', ':first')
            cy.formError('app-add-vehicle', 'Lic. Plate Number', 'Lic. Plate Number already exists')
        });
    })
})
