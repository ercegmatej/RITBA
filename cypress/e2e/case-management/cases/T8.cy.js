describe('T8 - Cases - Add new case (mandatory fields)', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open case management - cases', () => {
        cy.sidenav('Case Management', 'Cases')
    });

    it('Add new case window', () => {
        const dropdownItems = ['Account Number', 'Last Name', 'First Name', 'Transponder Number', 'Day Phone', 'Address', 'Email Address', 'Last 4 Digits']
        cy.get('[title="Add New Case "]').click()

        cy.get('app-add-case app-account-search').should('contain.text', ' Account Search - Double click to view results ')
        cy.get('app-add-case app-group:eq(1)').should('contain.text', 'Case Details')

        cy.dropdownItems('app-account-search kendo-grid-toolbar', dropdownItems)

        cy.search('app-account-search kendo-grid-toolbar', 'Last Name', 'Test', '/Search/MatchingAccountsList')
        //cy.sortGrid('app-account-search', '', '/Search/MatchingAccountsList')
    });

    it('Select an account', () => {
        cy.search('app-account-search kendo-grid-toolbar', 'Account Number', '50002370', '/Search/MatchingAccountsList')
        cy.contains('app-account-search td', '50002370').dblclick()
        cy.wait(1000)
        cy.get('app-add-case app-account-search app-general-information').should('contain.text', 'General Information')
    });

    it('Return to search and select again', () => {
        cy.contains('button', 'Return to Search').click()
        cy.get('app-add-case app-account-search').should('contain.text', ' Account Search - Double click to view results ')
        cy.contains('app-account-search td', '50002370').dblclick()
        cy.wait(1000)
        cy.get('app-add-case app-account-search app-general-information').should('contain.text', 'General Information')
    });

    it('Click create case before', () => {
        cy.contains('button', 'Create Case').click()
        cy.requiredError('Department')
        cy.requiredError('Case Type')
        cy.requiredError('Description')
    });

    it('Populate the mandatory fields', () => {
        cy.field('Department', 'TR1942023')
        cy.field('Case Type', 'TR_Case_DEP')
        cy.field('Description', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m')
        cy.contains('kendo-formfield', 'Description').find('kendo-textarea').should('have.attr', 'maxlength', '100')
    });

    it('Create case', () => {
        cy.intercept('POST', 'https://ri2-crm.emovis.hr:2323/CaseManagement/CaseAdd').as('caseAdd')

        cy.contains('button', 'Create Case').click()
        cy.wait('@caseAdd').its('response.statusCode').should('eq', 200)
        cy.popup('Add New Case', 'Case has been successfully created.', 'Ok')
    });
});