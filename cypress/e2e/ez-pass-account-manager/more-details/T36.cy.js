Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('super-user'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
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
            cy.wait(1000)
            
            cy.contains('kendo-dialog-titlebar', 'Edit Selected User').should('exist')
            cy.get('app-add-authorised-user-form kendo-dropdownlist:eq(0)').should('have.attr', 'readonly')
            cy.get('app-add-authorised-user-form input').should('not.have.attr', 'readonly')

            cy.randomValue(1000000000, 9999999999, 0).then(($phone) => {
                cy.field('app-add-authorised-user-form', 'Primary Phone', $phone)
                cy.contains('kendo-dialog-actions button', 'Save').click()
                cy.popup('Success', 'Updated Contact information', 'Ok')
                cy.get('app-authorised-users kendo-grid-list tr:first [aria-colindex="4"]').should('contain.text', $phone)
            })
        });

        it('Add a new user', () => {
            const req = ['User Type', 'First name', 'Last name', 'Primary Phone', 'Address Type', 'Address Line 1',
            'Zip/Postal Code', 'City', 'State', 'Country']

            cy.get('app-authorised-users [title="Add User"]').click()
            cy.contains('kendo-dialog-titlebar', 'Add New User').should('exist')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            req.forEach(element => cy.requiredError('app-add-authorised-user-form', element))

            cy.field('app-add-authorised-user-form', 'User Type', 'Administrator')
            cy.field('app-add-authorised-user-form', 'First name', 'John')
            cy.field('app-add-authorised-user-form', 'Last name', 'Doe')
            cy.field('app-add-authorised-user-form', 'Primary Phone', '098764532')
            cy.formError('app-add-authorised-user-form', 'Primary Phone', 'Primary Phone should be 10 digits')
            cy.field('app-add-authorised-user-form', 'Primary Phone', '0987654321')
            cy.formError('app-add-authorised-user-form', 'Primary Phone', '')

            cy.field('app-add-authorised-user-form', 'Address Type', 'Mailing')
            cy.field('app-add-authorised-user-form', 'Address Line 1', '1179 Westminster St')
            cy.field('app-add-authorised-user-form', 'Zip/Postal Code', '02909')
            cy.field('app-add-authorised-user-form', 'City', 'Providence')

            cy.field('app-add-authorised-user-form', 'Country', 'United States')
            cy.field('app-add-authorised-user-form', 'State', 'Rhode Island')

            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.popup('Success', 'New Contact and New Address has been added to this Account', 'Ok')
        });

        it('Verify new user', () => {
            cy.verifyGridData('app-authorised-users', 'User Role', 1, 'Administrator')
            cy.verifyGridData('app-authorised-users', 'Contact Name', 1, 'John Doe')
            cy.verifyGridData('app-authorised-users', 'Primary Phone', 1, '0987654321')
        });

        it('Select the new user', () => {
            cy.intercept('GET', '/Account/ContactAddresses**').as('getAddresses');
            cy.contains('td', 'John Doe').click()
            cy.wait('@getAddresses').its('response.statusCode').should('eq', 200)
            cy.verifyGridData('app-addresses-for', 'Address Type', 0, 'Mailing')
            cy.verifyGridData('app-addresses-for', 'First Name', 0, 'John')
            cy.verifyGridData('app-addresses-for', 'Last Name', 0, 'Doe')
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

        it('Edit the newly created user', () => {
            cy.contains('td', 'Jane Austin').click()
            cy.get('app-authorised-users [title="Edit User"]').click()
            cy.field('app-add-authorised-user-form', 'First name', 'George')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.popup('Success', 'Updated Contact information', 'Ok')

            cy.verifyGridData('app-authorised-users', 'Contact Name', 2, 'George Austin')
        });

        it('Delete recently created users', () => {
            cy.contains('td', 'George Austin').click()
            cy.get('app-authorised-users [title="Remove User"]').click()
            cy.popup('Warning', 'Are you sure you want to delete this contact?', 'Yes')
            cy.popup('Success', 'Contact has been deleted', 'Ok')
            cy.contains('td', 'George Austin').should('not.exist')

            cy.contains('td', 'John Doe').click()
            cy.get('app-authorised-users [title="Remove User"]').click()
            cy.popup('Warning', 'Are you sure you want to delete this contact?', 'Yes')
            cy.popup('Success', 'Contact has been deleted', 'Ok')
            cy.contains('td', 'John Doe').should('not.exist')
        });
    });
    //TODO add before test delete (also check for not exist)
})