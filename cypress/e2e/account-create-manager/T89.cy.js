//TODO Uncomment when everything is fixed

describe('T89 - Create new E-Z pass acc, type Individual - Credit card - all fields', () => {
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
        cy.field('app-account-information', 'Correspond. Method', 'SMS')
        cy.contains('kendo-label', 'Mobile Phone').should('have.class', 'app-label-required')
        cy.field('app-account-information', 'Mobile Phone', '0987654321')

        cy.accountPlan('Individual', 'Credit Card', 'Email', 'SMS')
        cy.newCreditCard(Cypress.env('VISA'))
    });

    it('Fill all non mandatory fields', () => {
        cy.field('app-account-information', 'Salutation', ':first')
        cy.field('app-account-information', 'Middle Name', 'SREDNJE')
        cy.field('app-account-information', 'Company', 'INDIVIDUAL')
        cy.field('app-account-information', 'Contact Name', 'KONTAKT')

        cy.field('app-account-information', 'Address Line 2', 'ADRESA 2')
        cy.field('app-account-information', 'Evening Phone', '0987654321')
        cy.field('app-account-information', 'Fax', '1234567890')
    });

    it('Replenishment tab', () => {
        cy.contains('li', 'Rebill Methods').click()
        //cy.verifyGridData('app-credit-debit-cards', 'Card Status', 0, 'Active')
        cy.get('app-credit-debit-cards kendo-grid-list tr:eq(0) [aria-colindex="5"] input').should('be.checked')
    });

    it('Go back to info tab and delete non mandatory fields', () => {
        cy.contains('li', 'Information').click()
        cy.field('app-account-information', 'Middle Name', '')
    });

    it('Add a transponder', () => {
        cy.addTransponder()
    });

    it('Payments tab (Error)', () => {
        cy.contains('li', 'Payments').click()
        cy.contains('button', 'Save').click()
        cy.popup('Error', 'Account must have at least one vehicle.', 'Ok')
    });

    it('Add a vehicle', () => {
        cy.addVehicle()
    });

    it('Payments tab', () => {
        cy.intercept('POST', '/Account/CreateAccount').as('create');
        cy.contains('li', 'Payments').click()
        // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 35)
        //cy.contains('button', 'Credit Card').should('have.attr', 'aria-pressed', 'true')

        // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(1)').should('have.attr', 'disabled')
        // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(2)').should('have.attr', 'aria-valuenow', 35)
        cy.contains('app-account-create-manager button', 'Save').click()
        cy.wait('@create').its('response.statusCode').should('eq', 200)
    });

    it('Verify data of the account', () => {
        cy.popup('Success', 'Account created successfully.', 'Ok')
        cy.verifyField('app-account-status', 'Account Status', 'Open')
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