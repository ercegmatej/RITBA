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

    it('Go to payments', () => {
        cy.contains('li', 'Payments').click()
        cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 0)
    });

    it('Add a transponder', () => {
        cy.addTransponder()
    });

    it('Payments tab', () => {
        cy.intercept('POST', '/Account/CreateAccount').as('create');
        cy.contains('li', 'Payments').click()
        // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 35)
        //cy.contains('button', 'Credit Card').should('have.attr', 'aria-pressed', 'true')

        // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(1)').should('have.attr', 'disabled')
        // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(2)').should('have.attr', 'aria-valuenow', 35)
        cy.contains('app-account-create-manager button', 'Save').click()
        //! Payment should fail somehow
        cy.wait('@create').its('response.statusCode').should('eq', 200)
    });

    it('Verify data of the account', () => {
        cy.popup('Success', 'Account created successfully.', 'Ok')
        cy.verifyField('app-account-status', 'Account Status', 'Open Pending')
        //cy.contains('div', 'Current Balance').next('div').should('contain.text', '$0.00')

        cy.tab('Vehicles')
        cy.verifyGridData('app-account-vehicles', 'Plate Type', 0, 'Passenger')
        cy.verifyGridData('app-account-vehicles', 'State', 0, 'RI')
        cy.verifyGridData('app-account-vehicles', 'IAG Code', 0, '72')

        cy.tab('Transponders')
        cy.verifyGridData('app-account-transponder', 'Request Mode', 0, 'CALL')
        cy.verifyGridData('app-account-transponder', 'Status', 0, 'To Be Assigned')
        cy.verifyGridData('app-account-transponder', 'IAG Code', 0, '72')
        cy.verifyGridData('app-account-transponder', 'Device Color', 0, 'Ivory')
    });
});