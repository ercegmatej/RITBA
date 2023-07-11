describe('T132 - Create new E-Z pass acc, type Individual - Rebill method - Edit, Delete, Duplicate credit cards', () => {
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
        cy.contains('kendo-dialog-actions button', 'Cancel').click()
    });

    it('Go to the vehicles tab and add a vehicle', () => {
        cy.tab('Vehicles')
        cy.addVehicle()
    });

    it('Rebill Methods', () => {
        cy.tab('Rebill Methods')
        cy.get('app-credit-debit-cards [title="Add Card"]').click()
        cy.newCreditCard(Cypress.env('VISA'))
    });

    it('Add the same card again', () => {
        cy.get('app-credit-debit-cards [title="Add Card"]').click()
        cy.newCreditCard(Cypress.env('VISA'))
        cy.popup('Error', 'Card already added.', 'Ok')
        cy.contains('kendo-dialog-actions button', 'Cancel').click()
    });

    it('Add a different card', () => {
        cy.get('app-credit-debit-cards [title="Add Card"]').click()
        cy.newCreditCard(Cypress.env('MASTERCARD'))
    });

    it('Delete a card', () => {
        cy.get('app-credit-debit-cards kendo-grid-list tr:first td:first').then(($td) => {
            const cardType = $td.text()
            cy.get($td).click()
            cy.get('[title="Delete Card"]').click()
            cy.popup('Warning', 'Are you sure you want to remove this card?', 'Yes')
            cy.get('app-credit-debit-cards kendo-grid-list td').should('not.contain.text', cardType)
        })
    });

    it('Try to delete the last card', () => {
        cy.get('app-credit-debit-cards kendo-grid-list tr:first').click()
        cy.get('[title="Delete Card"]').click()
        cy.popup('Warning', 'Please add another payment method then delete this payment method.', 'Ok')
    });

    it('Edit the card', () => {
        cy.get('app-credit-debit-cards kendo-grid-list tr:first').click()
        cy.get('[title="Edit Card"]').click()
        cy.contains('kendo-dialog-titlebar', 'Edit Replenishment')
        cy.field('app-credit-debit-card-edit', 'Expiration Month', '8')
        cy.field('app-credit-debit-card-edit', 'Expiration Year', '2027')
        cy.field('app-credit-debit-card-edit', 'Postal Code', '02880')
        cy.contains('kendo-dialog-actions button', 'Save').click()

        cy.verifyGridData('app-credit-debit-cards', 'Exp Month', 0, '8')
        cy.verifyGridData('app-credit-debit-cards', 'Exp Year', 0, '2027')
        cy.verifyGridData('app-credit-debit-cards', 'Postal Code', 0, '02880')
    });
})
