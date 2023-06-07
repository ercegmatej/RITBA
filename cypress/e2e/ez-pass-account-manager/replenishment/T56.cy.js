Cypress._.times(1, (i) => {
    const accNumber = [ Cypress.env('individual_2'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T52 - EZ Pass - Replenishment - Add, Edit, Delete' + ' - ' + accType[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Replenishment tab', () => {
            cy.tab('Replenishment')
            cy.contains('app-credit-debit-cards kendo-grid-toolbar', 'Credit/Debit Card').should('exist')
            cy.contains('app-ach kendo-grid-toolbar', 'ACH').should('exist')
            cy.contains('app-auto-top-up-activity kendo-grid-toolbar', 'Rebill Activity').should('exist')
        });

        it('Delete all replenishments and leave just one card', () => {
            cy.get('app-credit-debit-cards kendo-grid-list [aria-colindex="5"] input').each(($primary) => {
                if ($primary.checked) {
                    cy.get($primary).parents('tr').click()
                    cy.get('[title="Remove Card"]').click()
                    cy.popup('Warning', 'Are you sure?', 'Yes')
                    cy.wait(500)
                }
            })
        });

        it('Add a new card', () => {
            cy.get('app-credit-debit-cards [title="Add Card"]').click()
            cy.contains('kendo-dialog-titlebar', 'Add New Replenishment').should('exist')
            cy.field('app-credit-debit-card-edit', `Card Holder's Name`, 'Test QA')
            
            cy.field('app-credit-debit-card-edit', 'Card Type', 'VISA')
            cy.field('app-credit-debit-card-edit', 'Card Number Token', '4444333322221111')
            cy.field('app-credit-debit-card-edit', 'Expiration Month', '12')
            cy.field('app-credit-debit-card-edit', 'Expiration Year', '2027')
            cy.field('app-credit-debit-card-edit', 'Postal Code', '02886')

            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.popup('Success', 'Card saved successfully.', 'Ok')
        });

        it('Make a second card primary', () => {
            cy.contains('app-credit-debit-cards kendo-grid-list [aria-colindex="4"]', '2')
            .parents('tr').find('[aria-colindex="5"] input').check()
            cy.popup('Warning', 'Do you want to make  as a primary method?', 'Yes')
            cy.wait(500)
            
            cy.contains('app-credit-debit-cards kendo-grid-list [aria-colindex="3"]', 'Test QA')
            .parents('tr').find('[aria-colindex="5"] input').should('be.checked')
            cy.contains('app-credit-debit-cards kendo-grid-list [aria-colindex="3"]', 'Test QA')
            .parents('tr').find('[aria-colindex="4"]').should('contain.text', '2')
        });

        it('Edit primary card', () => {
            cy.contains('app-credit-debit-cards kendo-grid-list [aria-colindex="3"]', 'Test QA').click()
            cy.get('[title="Edit Card"]').click()
            
            cy.contains('kendo-dialog-titlebar', 'Edit Replenishment').should('exist')
            cy.contains('app-credit-debit-card-edit kendo-formfield', `Card Holder's Name`).find('input').should('have.attr', 'readonly')
            cy.contains('app-credit-debit-card-edit kendo-formfield', 'Card Type').find('kendo-dropdownlist').should('have.attr', 'readonly')
            cy.contains('app-credit-debit-card-edit kendo-formfield', 'Card Number Token').find('input').should('have.attr', 'readonly')
            cy.contains('app-credit-debit-card-edit kendo-formfield', 'Expiration Month').find('input').should('not.have.attr', 'readonly')
            cy.contains('app-credit-debit-card-edit kendo-formfield', 'Expiration Year').find('input').should('not.have.attr', 'readonly')
            cy.contains('app-credit-debit-card-edit kendo-formfield', 'Postal Code').find('input').should('not.have.attr', 'readonly')
        });

        //TODO WIP
    });
})