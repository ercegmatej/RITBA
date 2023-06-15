Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('super-user'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T48 - EZ Pass - More Details - Addresses' + ' - ' + accType[i], () => {
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

        it('Delete Super user Mailing address', () => {
            cy.contains('app-authorised-users kendo-grid-list [data-kendo-grid-column-index="0"]', 'SuperUser').click()
            cy.contains('app-addresses-for kendo-grid-list [data-kendo-grid-column-index="0"]', 'Mailing').click()
            cy.get('app-addresses-for [title="Remove Address"]').click()
            cy.popup('Info', 'Selected address cannot be removed', 'Ok')
        });

        it('Edit Super user Mailing address', () => {
            cy.contains('app-addresses-for kendo-grid-list [data-kendo-grid-column-index="0"]', 'Mailing').click()
            cy.get('app-addresses-for [title="Edit Address"]').click()
            cy.wait(1000)
            
            cy.contains('kendo-dialog-titlebar', 'Edit Address').should('exist')
            cy.field('app-add-addresses-for-form', 'Address Type', 'Billing')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.popup('Error', 'Cannot update Mailing Address of Primary Contact', 'Ok')
            cy.contains('kendo-dialog-actions button', 'Cancel').click()
        });

        it('Add a new address - billing', () => {
            const req = ['Address Type', 'Address Line 1', 'Zip/Postal Code', 'City', 'State', 'Country']

            cy.get('app-addresses-for [title="Add Address"]').click()
            cy.contains('kendo-dialog-titlebar', 'New Address').should('exist')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            req.forEach(element => cy.requiredError('app-add-addresses-for-form', element))

            cy.field('app-add-addresses-for-form', 'Contact person', 'SuperUser')

            cy.field('app-add-addresses-for-form', 'Address Type', 'Billing')
            cy.field('app-add-addresses-for-form', 'Address Line 1', '1179 Westminster St')
            cy.field('app-add-addresses-for-form', 'Zip/Postal Code', '02909')
            cy.field('app-add-addresses-for-form', 'City', 'Providence')

            cy.field('app-add-addresses-for-form', 'Country', 'United States')
            cy.field('app-add-addresses-for-form', 'State', 'Rhode Island')

            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.popup('Success', 'New Address has been added to this Contact', 'Ok')
        });

        it('Verify new address', () => {
            cy.verifyGridData('app-addresses-for', 'Address Type', 1, 'Billing')
            cy.verifyGridData('app-addresses-for', 'Address 1', 1, '1179 Westminster St')
        });

        it('Add a new address - shipping', () => {
            const req = ['Address Type', 'Address Line 1', 'Zip/Postal Code', 'City', 'State', 'Country']

            cy.get('app-addresses-for [title="Add Address"]').click()
            cy.contains('kendo-dialog-titlebar', 'New Address').should('exist')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            req.forEach(element => cy.requiredError('app-add-addresses-for-form', element))

            cy.field('app-add-addresses-for-form', 'Contact person', 'SuperUser')

            cy.field('app-add-addresses-for-form', 'Address Type', 'Shipping')
            cy.field('app-add-addresses-for-form', 'Address Line 1', '1001 Westminster St')
            cy.field('app-add-addresses-for-form', 'Zip/Postal Code', '02909')
            cy.field('app-add-addresses-for-form', 'City', 'Providence')

            cy.field('app-add-addresses-for-form', 'Country', 'United States')
            cy.field('app-add-addresses-for-form', 'State', 'Rhode Island')

            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.popup('Success', 'New Address has been added to this Contact', 'Ok')
        });

        it('Verify new address', () => {
            cy.verifyGridData('app-addresses-for', 'Address Type', 2, 'Shipping')
            cy.verifyGridData('app-addresses-for', 'Address 1', 2, '1001 Westminster St')
        });

        it('Try to add one more address', () => {
            cy.get('app-addresses-for [title="Add Address"]').click()
            cy.popup('Info', 'No more addresses can be added', 'Ok')
        });

        it('Add a new user', () => {
            cy.get('app-authorised-users [title="Add User"]').click()
            cy.field('app-add-authorised-user-form', 'User Type', 'Web User')
            cy.field('app-add-authorised-user-form', 'First name', 'Jane')
            cy.field('app-add-authorised-user-form', 'Last name', 'Austin')
            cy.field('app-add-authorised-user-form', 'Primary Phone', '0987654321')
            cy.formError('app-add-authorised-user-form', 'Primary Phone', '')

            cy.field('app-add-authorised-user-form', 'Address Type', 'Billing')
            cy.field('app-add-authorised-user-form', 'Address Line 1', '800 Kipling Ave')
            cy.field('app-add-authorised-user-form', 'Zip/Postal Code', '02909')
            cy.field('app-add-authorised-user-form', 'City', 'Etobicoke')
            cy.field('app-add-authorised-user-form', 'Country', 'Canada')
            cy.field('app-add-authorised-user-form', 'State', 'Ontario')

            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.popup('Success', 'New Contact and New Address has been added to this Account', 'Ok')
        });

        it('Edit the newly added address', () => {
            cy.contains('td', 'Jane Austin').click()
            cy.contains('app-addresses-for kendo-grid-list [data-kendo-grid-column-index="0"]', 'Billing').click()
            cy.get('app-addresses-for [title="Edit Address"]').click()
            cy.wait(1000)
            cy.field('app-add-addresses-for-form', 'Address Type', 'Mailing')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.popup('Success', 'Address has been Updated', 'Ok')

            cy.verifyGridData('app-addresses-for', 'Address Type', 0, 'Mailing')
        });

        it('Delete the newly created user and all addresses from the super user', () => {
            cy.contains('td', 'Jane Austin').click()
            cy.get('app-authorised-users [title="Remove User"]').click()
            cy.popup('Warning', 'Are you sure you want to delete this contact?', 'Yes')
            cy.popup('Success', 'Contact has been deleted', 'Ok')
            cy.contains('td', 'Jane Austin').should('not.exist')

            cy.contains('td', 'Billing').click()
            cy.get('app-addresses-for [title="Remove Address"]').click()
            cy.popup('Warning', 'Are you sure you want to remove Billing address?', 'Yes')
            cy.popup('Success', 'Address has been Deleted', 'Ok')
            cy.wait(500)
            cy.contains('td', 'Billing').should('not.be.visible')

            cy.contains('td', 'Shipping').click()
            cy.get('app-addresses-for [title="Remove Address"]').click()
            cy.popup('Warning', 'Are you sure you want to remove Shipping address?', 'Yes')
            cy.popup('Success', 'Address has been Deleted', 'Ok')
            cy.wait(500)
            cy.contains('td', 'Shipping').should('not.exist')
        });

        it('Show removed addresses checkbox', () => {
            cy.get('app-addresses-for [type="checkbox"]').check()
            cy.contains('td', 'Billing').should('exist')
            cy.contains('td', 'Shipping').should('exist')

            cy.contains('td', 'Billing').click()
            cy.get('app-addresses-for [title="Edit Address"]').click()
            cy.popup('Info', 'Deleted address cannot be edited', 'Ok')
            cy.get('app-addresses-for [title="Remove Address"]').click()
            cy.popup('Info', 'Selected address cannot be removed', 'Ok')

            cy.get('app-addresses-for [type="checkbox"]').uncheck()
            cy.contains('td', 'Billing').should('not.be.visible')
            cy.contains('td', 'Shipping').should('not.exist')
        });
    });
})