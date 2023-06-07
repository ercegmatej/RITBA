describe('T8 - Cases - Add new case (mandatory fields)', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open case management - cases', () => {
        cy.sidenav('Case Management', 'Cases')
    });

    it('Add new case window', () => {
        const dropdownItems = ['Account Number', 'Last Name', 'First Name', 'Transponder Number', 'Day Time Phone', 'Address', 'Email Address', 'Last 4 digits Card', 'Plate']
        cy.get('[title="Add New Case "]').click()

        cy.get('app-add-case app-account-search').should('contain.text', ' Account Search - Double click to view results ')
        cy.get('app-add-case app-group:eq(1)').should('contain.text', 'Case Details')

        cy.dropdownItems('app-account-search kendo-grid-toolbar', dropdownItems)

        cy.search('app-account-search kendo-grid-toolbar', 'Last Name', 'Kennedy', '/Search/MatchingAccountsList')
    });

    // it('Sort grid', () => {
    //     cy.sortGrid('app-add-case app-account-search', '', '/Search/MatchingAccountsList')
    // });

    it('Select an account', () => {
        cy.search('app-account-search kendo-grid-toolbar', 'Account Number', Cypress.env('individual'), '/Search/MatchingAccountsList')
        cy.contains('app-account-search td', Cypress.env('individual')).dblclick()
        cy.wait(1000)
        cy.get('app-add-case app-account-search app-general-information').should('contain.text', 'General Information')
    });

    it('Return to search and select again', () => {
        cy.contains('button', 'Return to Search').click()
        cy.get('app-add-case app-account-search').should('contain.text', ' Account Search - Double click to view results ')
        cy.contains('app-account-search td', Cypress.env('individual')).dblclick()
        cy.wait(1000)
        cy.get('app-add-case app-account-search app-general-information').should('contain.text', 'General Information')
    });

    it('Click create case before', () => {
        cy.contains('button', 'Create Case').click()
        cy.requiredError('app-add-case', 'Department')
        cy.requiredError('app-add-case', 'Description')
    });

    it('Populate the mandatory fields', () => {
        cy.field('app-add-case', 'Department', 'TR194')
        cy.field('app-add-case', 'Case Type', 'TR_CDaa')
        cy.randomText().then(($description) => {
            cy.field('app-add-case', 'Description', $description)
        })
        cy.contains('kendo-formfield', 'Description').find('kendo-textarea').should('have.attr', 'maxlength', '100')
    });

    it('Create case', () => {
        cy.intercept('POST', Cypress.env('ip') + '/CaseManagement/CaseAdd').as('caseAdd')

        cy.contains('button', 'Create Case').click()
        cy.wait('@caseAdd').its('response.statusCode').should('eq', 200)
        cy.popup('Add New Case', 'Case has been successfully created.', 'Ok')
    });
});