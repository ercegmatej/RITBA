//TODO Uncomment when everything is fixed

describe('T88 - Create new E-Z pass acc, type Individual - Credit card - status OPEN PENDING', () => {
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
        cy.accountPlan('Individual', 'Credit Card', 'Email', 'Email')
        cy.newCreditCard(Cypress.env('VISAF'))
    });

    it('Replenishment tab', () => {
        cy.contains('li', 'Rebill Methods').click()
        //cy.verifyGridData('app-credit-debit-cards', 'Card Status', 0, 'Active')
        cy.get('app-credit-debit-cards kendo-grid-list tr:eq(0) [aria-colindex="5"] input').should('be.checked')
    });

    it('Save (error)', () => {
        cy.contains('li', 'Payments').click()
        cy.contains('button', 'Save').click()
        cy.popup('Error', 'Account must have at least one vehicle.', 'Ok')
    });

    it('Add a vehicle', () => {
        cy.addVehicle()
    });

    //TODO WIP

    // it('Go to payments', () => {
    //     cy.contains('li', 'Payments').click()
    //     cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 0)
    // });

    // it('Add one transponder - tag', () => {
    //     const dropdownItems = ['Interior Tag Ivory', 'LicPlate Tag Black', 'Exterior Roof Tag Black']
    //     cy.contains('li', 'Transponders').click()
    //     cy.wait(500)
    //     cy.get('app-account-transponder [title="Add"]').click()
    //     cy.wait(500)
    //     cy.get('app-transponder-edit kendo-formfield:visible:first')
    //     cy.dropdownItems('app-transponder-edit kendo-formfield:visible:first', dropdownItems)
    //     cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'Ivory')
    //     cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
    // })

    // it('Add one transponder - plans', () => {
    //     cy.contains('div', 'Applied plans for this Transponder').find('button:eq(0)').click()
    //     cy.contains('button', 'Remove Plan').click()
    //     cy.popup('Warning', 'This plan can not be removed', 'Ok')
    //     cy.contains('button', 'Apply Plan').click()
    //     cy.popup('Warning', 'Please select some of available plans to apply.', 'Ok')

    //     // cy.contains('div', 'Available Plans').find('button:eq(0)').then(($plan) => {
    //     //     const plan = $plan.text()
    //     //     cy.get($plan).click()
    //     //     cy.contains('button', 'Apply Plan').click()
    //     //     cy.contains('div', 'Applied plans for this Transponder').find('button').should('contain.text', plan)
    //     // })
    // });

    // it('Add one transponder - plan date', () => {
    //     cy.calendar(0, '2023', 'Dec', '25')
    //     cy.calendar(1, '2024', 'Dec', '25')
    //     cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
    //     cy.field('app-transponder-edit', 'Option Out', 'check')
    // });

    // it('Save transponder', () => {
    //     cy.contains('kendo-dialog-actions button', 'Save').click()
    //     cy.popup('Success', 'Transponder saved successfully', 'Ok')

    //     cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Status', 0, 'INACTIVE')
    //     cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'IAG ID', 0, '72')
    //     cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Device Color', 0, 'Ivory')
    // });

    // it('Payments tab', () => {
    //     cy.intercept('POST', '/Account/CreateAccount').as('create');
    //     cy.contains('li', 'Payments').click()
    //     // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 35)
    //     cy.contains('button', 'Cash').should('have.attr', 'aria-pressed', 'true')

    //     // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(1)').type(2)
    //     // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(2)').should('have.attr', 'aria-valuenow', 37)
    //     cy.contains('app-account-create-manager button', 'Save').click()
    //     cy.wait('@create').its('response.statusCode').should('eq', 200)
    // });

    // it('Verify data of the account', () => {
    //     cy.popup('Success', 'Account created successfully.', 'Ok')
    //     cy.verifyField('app-account-status', 'Account Status', 'Open Pending')
    //     //cy.contains('div', 'Current Balance').next('div').should('contain.text', '$2.00')

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