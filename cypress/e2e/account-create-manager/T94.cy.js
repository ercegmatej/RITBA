describe('T94 - Create new E-Z pass acc, type Individual - change Initial payment form Credit card to cheque/cash/debit/another credit card', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open create new account', () => {
        cy.sidenav('Account Establishment', 'New E-ZPass Account')
    });

    it('Fill out required fields', () => {
        cy.mandatoryFields()
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

    it('Account Plan', () => {
        cy.accountPlan('Individual', 'Credit Card', 'Email', 'Email')
        cy.contains('kendo-dialog-titlebar', 'Add New Replenishment').find('[title="Close"]').click()
    });

    it('Go to Rebill and verfiy no card', () => {
        cy.contains('li', 'Rebill Methods').click()
        cy.get('app-credit-debit-cards kendo-grid-list tr').should('contain.text', 'No records available.')
    });

    it('Add transponder ivory, 72', () => {
        cy.addTransponder()
    });

    it('Go to payments tab, save (error)', () => {
        cy.contains('li', 'Payments').click()
        cy.contains('app-account-create-manager button', 'Save').click()
        cy.popup('Error', 'Account must have at least one vehicle.', 'Ok')
    });

    // it('Add a new vehicle', () => {
    //     cy.addVehicle()
    // });

    Cypress._.times(3, (i) => {
        const method = ['Check', 'Cash', 'Cash', 'Credit Card']
        it('Payments tab - ' + method[i], () => {
            cy.contains('li', 'Payments').click()
            cy.contains('app-initial-payment-details button', method[i]).click()
            //??
        });
    })
})