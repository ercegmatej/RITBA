//TODO Uncomment when everything is fixed

describe('T91 - Create new E-Z pass acc, type Individual/Commercial - Credit card - Automatic replenishment', () => {
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
        cy.newCreditCard(Cypress.env('VISA'))
    });

    it('Replenishment tab', () => {
        cy.contains('li', 'Rebill Methods').click()
        //cy.verifyGridData('app-credit-debit-cards', 'Card Status', 0, 'Active')
        cy.get('app-credit-debit-cards kendo-grid-list tr:eq(0) [aria-colindex="5"] input').should('be.checked')
    });

    it('Go back to info tab and change acc. type to Commercial', () => {
        cy.contains('li', 'Information').click()
        //cy.field('app-account-plan-information', 'Account Type', 'Commercial')

        cy.accountPlan('Commercial', 'Credit Card', 'Email', 'Email')//!Delete after fix
        cy.newCreditCard(Cypress.env('VISAF'))//!Delete after fix

        cy.contains('kendo-label', 'Company Name').should('have.class', 'app-label-required')
        cy.field('app-account-information', 'Company Name', 'COMMERCIAL')
    });

    it('Thresholds', () => {
        cy.field('app-account-plan-information', 'Automatic Payment', 'check')
        cy.contains('kendo-label', 'Replenishment amount').should('have.class', 'app-label-required')
        cy.contains('kendo-formfield', 'Replenishment amount').find('input').should('not.have.attr', 'readonly')

        cy.field('app-account-plan-information', 'Replenishment amount', 50)
        cy.contains('kendo-formfield', 'Low Balance').find('input').should('have.attr', 'aria-valuenow', 25)
    });

    it('Verify replenishment data', () => {
        cy.contains('li', 'Rebill Methods').click()
        cy.contains('div', 'Replenishment Information').next('div').find('kendo-formfield').filter(':contains("Replenishment Amount")').find('input').should('have.attr', 'aria-valuenow', 50)
        .and('have.attr', 'readonly')
        cy.contains('div', 'Replenishment Information').next('div').find('kendo-formfield').filter(':contains("Replenishment Threshold")').find('input').should('have.attr', 'aria-valuenow', 25)
        .and('have.attr', 'readonly')

        cy.field('app-account-rebill-methods', ' Exclude from automatic replenishment amount evaluation', 'check')
        cy.contains('li', 'Information').click()
        cy.contains('kendo-formfield', ' Exclude from automatic replenishment amount evaluation').find('input').should('be.checked')
    });

    // it('Add a transponder', () => {
    //     //cy.addTransponder()
    // });

    // it('Add a vehicle', () => {
    //     cy.addVehicle()
    // });

    // it('Payments tab', () => {
    //     cy.intercept('POST', '/Account/CreateAccount').as('create');
    //     cy.contains('li', 'Payments').click()
    //     // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 35)
    //     cy.contains('button', 'Credit Card').should('have.attr', 'aria-pressed', 'true')

    //     // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(1)').should('have.attr', 'disabled')
    //     // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(2)').should('have.attr', 'aria-valuenow', 35)
    //     cy.contains('app-account-create-manager button', 'Save').click()
    //     cy.wait('@create').its('response.statusCode').should('eq', 200)
    // });

    // it('Verify data of the account', () => {
    //     cy.popup('Success', 'Account created successfully.', 'Ok')
    //     cy.verifyField('app-account-status', 'Account Status', 'Open')
    //     //cy.contains('div', 'Current Balance').next('div').should('contain.text', '$0.00')

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