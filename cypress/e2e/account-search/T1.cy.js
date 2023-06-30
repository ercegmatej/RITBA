describe('T1 - Account Search - General design and grid functionality', () => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue'), Cypress.env('unregistered'), Cypress.env('violation') ];
    const accType = [ 'Individual', 'Commercial', 'Non Revenue', 'Contravention', 'Contravention'];
    const gridHeaders = ['Pin', 'Status', 'Account Number', 'First Name', 'Last Name', 'Company Name', 'Address', 'City', 'State', 'Postal Code',
    'Registration', 'Lic.Plate', 'Open Citations', 'Disputed Citations', 'Phone Number', 'Email Address', 'Last 4 digits Card', 'Open Date', 'Transponder No.']
    const dropdownItems = ['Account Number', 'Last Name', 'First Name', 'Transponder Number', 'Plate Number', 'Day Time Phone', 'Address',
    'Email Address', 'Last 4 digits Card', 'Last 4 Digits ACH', 'Company Name', 'Check Number', 'FJNo', 'PNRef']

    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Verify toolbar items (2-3)', () => {
        cy.get('kendo-grid-toolbar').find('span:first').should('contain.text', 'Global Search')
        cy.dropdownItems('app-account-search kendo-grid-toolbar', dropdownItems)
        cy.get('[placeholder="Search"]').should('be.visible')
        cy.get('[placeholder="Search"]').parents('kendo-textbox').find('button').should('be.visible')
    });

    it('Verify grid headers (4)', () => {
        cy.headers('app-account-search', ':first', gridHeaders)
    });

    it('Verify search functionalities (5-7)', () => {
        cy.input('kendo-grid-toolbar', 'kendo-textbox', 'Text')
        cy.get('[title="Clear"]').click()
        cy.get('[title="Clear"]').should('not.exist')

        cy.get('[placeholder="Search"]').parents('kendo-textbox').find('button').click()
        cy.popup('Warning', 'Please enter a search term first.', 'Ok')

        cy.search('kendo-grid-toolbar', 'Last Name', 'Kennedy', '/Search/MatchingAccountsList')
        cy.get('kendo-grid-toolbar').find('span:eq("1")').should('contain.text', ' Records Found')
    });

    it('Grid sort (8)', () => {
        cy.sortGrid('app-account-search', ':first, :last', '/Search/MatchingAccountsList')
    });

    it('Pagination (19-20)', () => {
        cy.page('app-account-search', '/Search/MatchingAccountsList')
    });

    it('Account manager open (9-18)', () => {
        for(let i=0; i<accNumber.length; i++) {
            cy.openAccount('Account Number', accNumber[i])
            cy.get('app-account-basic-info').find('div').should('contain.text', accType[i])
            cy.get('app-account-basic-info').find('div').should('contain.text', accNumber[i])
    
            cy.get('kendo-dialog-titlebar button').click()
            cy.get('app-account-search').should('be.visible')
            cy.get('app-account-manager').should('not.exist')
        }
    });
})