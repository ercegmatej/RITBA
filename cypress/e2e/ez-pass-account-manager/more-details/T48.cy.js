Cypress._.times(1, (i) => {
    const accNumber = [ Cypress.env('individual_2'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
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

        // it('Delete Super user Mailing address', () => {
        //     cy.contains('app-authorised-users kendo-grid-list [data-kendo-grid-column-index="0"]', 'SuperUser').click()
        //     cy.contains('app-addresses-for kendo-grid-list [data-kendo-grid-column-index="0"]', 'Mailing').click()
        //     cy.get('app-addresses-for [title="Remove Address"]').click()
        //     cy.popup('Warning', 'Account type require an address to be on file.', 'Ok')
        // });

        // it('Edit Super user Mailing address', () => {
        //     cy.contains('app-addresses-for kendo-grid-list [data-kendo-grid-column-index="0"]', 'Mailing').click()
        //     cy.get('app-addresses-for [title="Edit Address"]').click()
        //     cy.wait(1000)
            
        //     cy.contains('kendo-dialog-titlebar', 'Edit Address').should('exist')
        //     cy.field('app-add-addresses-for-form', 'Address Type', 'Billing')
        //     cy.contains('kendo-dialog-actions button', 'Save').click()
        //     cy.popup('Success', 'Address has been Updated', 'Ok')
        //     cy.verifyGridData('app-addresses-for', 'Address Type', 1, 'Billing')
        // });

        it('Add a new address', () => {
            const req = ['Address Type', 'Address Line 1', 'Zip/Postal Code', 'City', 'State', 'Country']

            cy.get('app-addresses-for [title="Add Address"]').click()
            cy.contains('kendo-dialog-titlebar', 'New Address').should('exist')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            req.forEach(element => cy.requiredError('app-add-addresses-for-form', element))

            cy.field('app-add-addresses-for-form', 'Contact person', 'SuperUser')

            cy.field('app-add-addresses-for-form', 'Address Type', 'Mailing')
            cy.field('app-add-addresses-for-form', 'Address Line 1', '1179 Westminster St')
            cy.field('app-add-addresses-for-form', 'Zip/Postal Code', '02909')
            cy.field('app-add-addresses-for-form', 'City', 'Providence')

            cy.contains('app-add-addresses-for-form kendo-formfield', 'State').click()
            cy.get('kendo-popup li').should('not.exist')
            cy.contains('app-add-addresses-for-form kendo-formfield', 'State').click()
            cy.field('app-add-addresses-for-form', 'Country', 'United States')
            cy.field('app-add-addresses-for-form', 'State', 'Rhode Island')

            // cy.contains('kendo-dialog-actions button', 'Save').click()
            // cy.popup('Success', 'New Address has been added to this Account', 'Ok')
        });

        //TODO WIP

        // it('Verify new user', () => {
        //     cy.verifyGridData('app-authorised-users', 'User Role', 2, 'Administrator')
        //     cy.verifyGridData('app-authorised-users', 'Contact Name', 2, 'John Doe')
        //     cy.verifyGridData('app-authorised-users', 'Primary Phone', 2, '0987654321')
        // });

        // it('Select the new user', () => {
        //     cy.intercept('GET', '/Account/ContactAddresses**').as('getAddresses');
        //     cy.contains('td', 'John Doe').click()
        //     cy.wait('@getAddresses').its('response.statusCode').should('eq', 200)
        //     cy.verifyGridData('app-addresses-for', 'Address Type', 1, 'Mailing')
        //     cy.verifyGridData('app-addresses-for', 'First Name', 1, 'John')
        //     cy.verifyGridData('app-addresses-for', 'Last Name', 1, 'Doe')
        // });

        // it('Add a new user', () => {
        //     cy.get('app-authorised-users [title="Add User"]').click()
        //     cy.field('app-add-authorised-user-form', 'User Type', 'Web User')
        //     cy.field('app-add-authorised-user-form', 'First name', 'Jane')
        //     cy.field('app-add-authorised-user-form', 'Last name', 'Austin')
        //     cy.field('app-add-authorised-user-form', 'Primary Phone', '0987654321')
        //     cy.formError('app-add-authorised-user-form', 'Primary Phone', '')

        //     cy.field('app-add-authorised-user-form', 'Address Type', 'Billing')
        //     cy.field('app-add-authorised-user-form', 'Address Line 1', '800 Kipling Ave')
        //     cy.field('app-add-authorised-user-form', 'Zip/Postal Code', '02909')
        //     cy.field('app-add-authorised-user-form', 'City', 'Etobicoke')
        //     cy.field('app-add-authorised-user-form', 'Country', 'Canada')
        //     cy.field('app-add-authorised-user-form', 'State', 'Ontario')

        //     cy.contains('kendo-dialog-actions button', 'Save').click()
        //     cy.popup('Success', 'New Contact and New Address has been added to this Account', 'Ok')
        // });

        // it('Edit the newly created user', () => {
        //     cy.contains('td', 'Jane Austin').click()
        //     cy.get('app-authorised-users [title="Edit User"]').click()
        //     cy.field('app-add-authorised-user-form', 'First name', 'George')
        //     cy.contains('kendo-dialog-actions button', 'Save').click()
        //     cy.popup('Success', 'Updated Contact information', 'Ok')

        //     cy.verifyGridData('app-authorised-users', 'Contact Name', 3, 'George Austin')
        // });

        // it('Delete recently created users', () => {
        //     cy.contains('td', 'George Austin').click()
        //     cy.get('app-authorised-users [title="Remove User"]').click()
        //     cy.popup('Warning', 'Are you sure you want to delete this contact?', 'Yes')
        //     cy.popup('Success', 'Contact has been deleted', 'Ok')
        //     cy.contains('td', 'George Austin').should('not.exist')

        //     cy.contains('td', 'John Doe').click()
        //     cy.get('app-authorised-users [title="Remove User"]').click()
        //     cy.popup('Warning', 'Are you sure you want to delete this contact?', 'Yes')
        //     cy.popup('Success', 'Contact has been deleted', 'Ok')
        //     cy.contains('td', 'John Doe').should('not.exist')
        // });
    });
})