Cypress._.times(2, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T72 - EZ Pass - Information - Layout (drop downs, grids)' + ' - ' + accType[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Salutation', () => {
            const dropdownItems = ['Dr.', 'Miss', 'Mr.', 'Mrs.', 'Ms.', 'Prof.']
            cy.dropdownItems('app-contact-information kendo-formfield', dropdownItems)
        });

        it('Country', () => {
            const dropdownItems = ['Canada', 'United States']
            cy.dropdownItems('app-address-information app-select-one:eq(1)', dropdownItems)
        });

        it('Account Status', () => {
            const dropdownItems = ['Open Pending', 'Open', 'Closed Pending', 'Closed']
            cy.dropdownItems('app-account-status', dropdownItems)
        });

        it('Account Type', () => {
            cy.contains('kendo-formfield', 'Account Type').find('kendo-dropdownlist').should('have.attr', 'readonly')
        });

        it('Billing Type', () => {
            cy.contains('kendo-formfield', 'Billing Type').find('kendo-dropdownlist').should('have.attr', 'readonly')
        });

        it('Payment Method', () => {
            const dropdownItems = ['None', 'Cash', 'Cheque', 'Credit Card', 'Ach', 'Non Revenue', 'Pre Paid Toll']
            cy.dropdownItems('app-account-plan-information kendo-formfield:contains("Payment Method")', dropdownItems)
        });

        it('Statement Delivery', () => {
            const dropdownItems = ['None', 'Mail', 'Disk', 'Email']
            cy.dropdownItems('app-account-plan-information kendo-formfield:contains("Statement Delivery")', dropdownItems)
        });

        it('Correspond. Method', () => {
            const dropdownItems = ['Postal', 'Email', 'Voice Mail', 'Fax Back', 'Print', 'S M S']
            cy.dropdownItems('app-account-plan-information kendo-formfield:contains("Correspond. Method"):eq(0)', dropdownItems)
        });

        it('Notes grid', () => {
            const gridHeaders = ['Date', 'Title/Comment', 'Who', 'Note Type', 'Status']
            cy.contains('app-information-notes button', 'Show All Notes').click()
            cy.headers('app-information-notes', '', gridHeaders)
            cy.sortGrid('app-information-notes', '', '/Account/NotesList')
            cy.page('app-information-notes', '/Account/NotesList')
            // cy.verifyDateSearch('app-information-notes', 'Date', '30 days', '/Account/NotesList')
            // cy.verifyDateSearch('app-information-notes', 'Date', '60 days', '/Account/NotesList')
            // cy.verifyDateSearch('app-information-notes', 'Date', '90 days', '/Account/NotesList')
        });

        it('Vehicles grid', () => {
            const gridHeaders = ['State/Province', 'Plate Type', 'Plate No.', 'IAG Code', 'IAG Class/desc.', 'Country']
            cy.headers('app-information-vehicles', '', gridHeaders)
            cy.sortGrid('app-information-vehicles', '', '/Account/VehiclesList')
            cy.page('app-information-vehicles', '/Account/VehiclesList')
        });

        it('Transponders grid', () => {
            const gridHeaders = ['Transponder No.', 'Tag Type', 'Status', 'Status Date', 'IAG Code', 'IAG Class/Desc.']
            cy.headers('app-information-transponders', '', gridHeaders)
            cy.sortGrid('app-information-transponders', '', '/Account/TranspondersList')
            cy.page('app-information-transponders', '/Account/TranspondersList')
        });
    })
})