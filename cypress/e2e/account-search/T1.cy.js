describe('T1 - Account Search - General design and grid functionality', () => {
    const gridHeaders = ['Pin', 'Status', 'Account Number', 'First Name', 'Last Name', 'Business Name', 'Address Line 1', 'City', 'Province', 'Postal Code',
    'Registration', 'Plate No.', 'Open Citations', 'Disputed Citations', 'Mobile Number', 'Email Address', 'Open Date', 'Transponder No.']
    const dropdownItems = ['Account Number', 'Last Name', 'First Name', 'Business Name', 'Address', 'Plate', 
    'Transponder Number', 'Day Phone', 'Email Address', 'Last 4 Digits', 'Check Number', 'FJNo']

    it('Login', () => {
        cy.login('merceg', 'ritbaVPN%$532', 'Call Center')
    });

    it('Verify toolbar items (2-3)', () => {
        cy.get('kendo-grid-toolbar').find('span:first').should('contain.text', 'Global Search')
        cy.dropdownItems('app-account-search kendo-grid-toolbar', dropdownItems)
        cy.get('[placeholder="Search"]').should('be.visible')
        cy.get('[placeholder="Search"]').parents('kendo-textbox').find('button').should('be.visible')
    });

    it('Verify grid headers (4)', () => {
        cy.headers('app-account-search', gridHeaders)
    });

    it('Verify search functionalities (5-7)', () => {
        cy.input('kendo-grid-toolbar', 'kendo-textbox', 'Text')
        cy.get('[title="Clear"]').click()
        cy.get('[title="Clear"]').should('not.exist')

        cy.get('[placeholder="Search"]').parents('kendo-textbox').find('button').click()
        cy.popup('Warning', 'Please enter a search term first.', 'Ok')

        cy.search('kendo-grid-toolbar', 'Last Name', 'Smith')
        cy.get('kendo-grid-toolbar').find('span:eq("1")').should('contain.text', ' Records Found')
    });

    it('Grid sort (8)', () => {
        cy.sort('app-account-search', ':first')
    });

    it('Pagination (19-20)', () => {
        cy.page('app-account-search')
    });

    it('Account manager functionalities (9-18)', () => {
        cy.openAccount('Account Number', '50002183')
        cy.get('app-account-basic-info').find('div').should('contain.text', 'Individual')
        cy.get('app-account-basic-info').find('div').should('contain.text', '50002183')

        cy.get('kendo-dialog-titlebar button').click()
        cy.get('app-account-search').should('be.visible')
        cy.get('app-account-manager').should('not.exist')

        cy.openAccount('Account Number', '52112656')
        cy.get('app-account-basic-info').find('div').should('contain.text', 'Commercial')
        cy.get('app-account-basic-info').find('div').should('contain.text', '52112656')

        cy.get('kendo-dialog-titlebar button').click()
        cy.get('app-account-search').should('be.visible')
        cy.get('app-account-manager').should('not.exist')

        cy.openAccount('Account Number', '52034047')
        cy.get('app-account-basic-info').find('div').should('contain.text', 'Non Revenue')
        cy.get('app-account-basic-info').find('div').should('contain.text', '52034047')

        cy.get('kendo-dialog-titlebar button').click()
        cy.get('app-account-search').should('be.visible')
        cy.get('app-account-manager').should('not.exist')

        cy.openAccount('Account Number', '1005068855')
        cy.get('kendo-dialog-titlebar').should('contain.text', 'Contravention Account Manager')
        cy.get('app-unregistered-account-basic-info').find('div').should('contain.text', '1005068855')

        cy.get('kendo-dialog-titlebar button').click()
        cy.get('app-account-search').should('be.visible')
        cy.get('app-account-manager').should('not.exist')

        cy.openAccount('Account Number', '1002231379')
        cy.get('kendo-dialog-titlebar').should('contain.text', 'Contravention Account Manager')
        cy.get('app-unregistered-account-basic-info').find('div').should('contain.text', '1002231379')

        cy.get('kendo-dialog-titlebar button').click()
        cy.get('app-account-search').should('be.visible')
        cy.get('app-account-manager').should('not.exist')
    });
})