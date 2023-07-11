//TODO Uncomment when everything is fixed

describe('T92 - Create new E-Z pass acc, type Individual - Cash - add multiple plans to the same transponder', () => {
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
        cy.accountPlan('Individual', 'Cash', 'Email', 'Email')
    });

    it('Add a vehicle', () => {
        cy.contains('li', 'Vehicles').click()
        cy.get('app-account-vehicles [title="Add"]').click()
        cy.wait(500)
        cy.contains('kendo-dialog-actions button', 'Save').click()
        cy.requiredError('app-add-vehicle', 'Plate Type')
        cy.requiredError('app-add-vehicle', 'Lic. Plate Number')
        cy.requiredError('app-add-vehicle', 'Veh. Make')
        cy.requiredError('app-add-vehicle', 'IAG Codes')
        cy.verifyField('app-add-vehicle', 'Veh. Country', 'United States')
        cy.verifyField('app-add-vehicle', 'Veh. State/Province', 'Rhode Island')
        cy.field('app-add-vehicle', 'Plate Type', ':first')
        cy.randomPlate().then(($plate) => {
            cy.field('app-add-vehicle', 'Lic. Plate Number', $plate)
        })
        cy.get('app-add-vehicle kendo-label:first').click() //!!Delete after fix
        cy.contains('kendo-dialog-actions button', 'Ok').click() //!!Delete after fix
        cy.field('app-add-vehicle', 'Veh. Year', '2019')
        cy.field('app-add-vehicle', 'Veh. Make', 'AUDI')
        cy.field('app-add-vehicle', 'Veh. Model', 'A7')
        cy.field('app-add-vehicle', 'GVW', '3000')
        cy.field('app-add-vehicle', 'IAG Codes', '136')
        cy.contains('kendo-dialog-actions button', 'Save').click()
        cy.popup('Success', 'New Vehicle has been added', 'Ok')
    });

    it('Add a transponder', () => {
        cy.contains('li', 'Transponders').click()
        cy.get('app-account-transponder [title="Add"]').click()
        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'Ivory')
        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '136')
        cy.wait(1000)

        //TODO Continue after plans fix
        // cy.contains('kendo-dialog-actions button', 'Save').click()
        // cy.popup('Success', 'Transponder saved successfully', 'Ok')
    });

    // it('Payments tab', () => {
    //     cy.intercept('POST', '/Account/CreateAccount').as('create');
    //     cy.contains('li', 'Payments').click()
    //     cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 35)
    //     cy.contains('button', 'Credit Card').should('have.attr', 'aria-pressed', 'true')

    //     cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(1)').should('have.attr', 'disabled')
    //     cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(2)').should('have.attr', 'aria-valuenow', 35)
    //     cy.contains('app-account-create-manager button', 'Save').click()
    //     cy.wait('@create').its('response.statusCode').should('eq', 200)
    // });

    // it('Verify data of the account', () => {
    //     cy.popup('Success', 'Account created successfully.', 'Ok')
    //     cy.verifyField('app-account-status', 'Account Status', 'Open')
    //     cy.contains('div', 'Current Balance').next('div').should('contain.text', '$0.00')
    //     cy.contains('app-account-plan-information kendo-formfield', 'Replenishment Amount').find('input').should('have.attr', 'aria-valuenow', 50)
    //     cy.contains('app-account-plan-information kendo-formfield', 'Low Balance').find('input').should('have.attr', 'aria-valuenow', 25)
    //     cy.contains('kendo-formfield', ' Exclude from automatic replenishment amount evaluation').find('input').should('be.checked')

    //     cy.tab('Vehicles')
    //     cy.verifyGridData('app-account-vehicles', 'Plate Type', 0, 'Passenger')
    //     cy.verifyGridData('app-account-vehicles', 'State', 0, 'RI')
    //     cy.verifyGridData('app-account-vehicles', 'IAG Code', 0, '72')

    //     cy.tab('Transponders')
    //     cy.verifyGridData('app-account-transponder', 'Request Mode', 0, 'CALL')
    //     cy.verifyGridData('app-account-transponder', 'Status', 0, 'To Be Assigned')
    //     cy.verifyGridData('app-account-transponder', 'IAG Code', 0, '72')
    //     cy.verifyGridData('app-account-transponder', 'Device Color', 0, 'Ivory')
    // });
});