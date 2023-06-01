Cypress._.times(1, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T36 - EZ Pass - More Details - Authorized Users' + ' - ' + accType[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the More Details tab', () => {
            cy.tab('More Details')
            cy.contains('app-authorised-users', 'Authorised Users').should('exist')
            cy.contains('app-addresses-for', 'Addresses For').should('exist')
            cy.get('app-authorised-users kendo-grid-list [data-kendo-grid-column-index="0"]').should('contain.text', 'SuperUser')
        });

        it('Delete Super user', () => {
            cy.contains('app-authorised-users kendo-grid-list [data-kendo-grid-column-index="0"]', 'SuperUser').click()
            cy.get('app-authorised-users [title="Remove User"]').click()
            cy.popup('Warning', 'Cannot remove Primary Contact.', 'Ok')
        });

        it('Edit Super user', () => {
            cy.contains('app-authorised-users kendo-grid-list [data-kendo-grid-column-index="0"]', 'SuperUser').click()
            cy.get('app-authorised-users [title="Edit User"]').click()
            
            cy.contains('kendo-dialog-titlebar', 'Edit Selected User').should('exist')
            cy.get('app-add-authorised-user-form kendo-dropdownlist:eq(0)').should('have.attr', 'readonly')
            cy.get('app-add-authorised-user-form input').should('not.have.attr', 'readonly')

            cy.randomValue(1000000000, 9999999999, 0).then(($phone) => {
                cy.field('app-add-authorised-user-form', 'Primary Phone', $phone)
            })
            //TODO WIP
        });
    });
})