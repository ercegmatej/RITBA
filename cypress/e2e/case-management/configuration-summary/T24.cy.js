let editLabel;
describe('T24 - Case Management - Advanced configuration - Add, Edit and Remove case types', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });
    
    it('Open case management - Case Summary', () => {
        cy.sidenav('Case Management', 'Configuration / Summary')
    });

    it('Advanced Configuration', () => {
        cy.contains('kendo-dropdownbutton button', 'User Configuration').click()
        cy.contains('kendo-popup li', 'Advanced Configuration').click()
        cy.contains('kendo-dialog-titlebar', 'Advanced Configuration').should('be.visible')
    });

    it('Errors', () => {
        cy.contains('app-case-advanced-configuration button', ' Add ').click()
        cy.requiredError('app-case-advanced-configuration', 'New Case Type')
        cy.requiredError('app-case-advanced-configuration', 'Email associate with case type')

        cy.contains('app-case-advanced-configuration button', 'Remove').click()
        cy.popup('Remove New Case', 'Please select a case type to remove', 'Ok')

        cy.contains('app-case-advanced-configuration button', 'Modify').click()
    });

    it('Add new case type', () => {
        cy.intercept('POST', '/CaseManagement/CaseTypeAdd').as('add');
        cy.field('app-case-advanced-configuration', 'New Case Type', 'Add Test')
        cy.field('app-case-advanced-configuration', 'Email associate with case type', 'addtest@test.com')
        cy.contains('app-case-advanced-configuration button', ' Add ').click()
        cy.wait('@add').its('response.statusCode').should('eq', 200)
        cy.popup('Success', 'Case Type has been successfully added', 'Ok')

        cy.get('#caseTypeList button:last').should('contain.text', 'Add Test')
    });

    it('Modify (same name error)', () => {
        cy.intercept('POST', '/CaseManagement/CaseTypeUpdate').as('update');
        cy.get('#caseTypeList button:last').click()
        cy.field('app-case-advanced-configuration', 'New Case Type', 'Modify Test')
        cy.contains('app-case-advanced-configuration button', 'Modify').click()
        cy.wait('@update').its('response.statusCode').should('eq', 400)
        cy.popup('Error', 'Case type name already exists.', 'Ok')
    });

    it('Modify', () => {
        cy.intercept('POST', '/CaseManagement/CaseTypeUpdate').as('update');
        cy.randomText().then(($label) => {
            editLabel += $label
            cy.field('app-case-advanced-configuration', 'New Case Type', editLabel)
        })
        cy.contains('app-case-advanced-configuration button', 'Modify').click()
        cy.wait('@update').its('response.statusCode').should('eq', 200)
        cy.popup('Success', 'Case type has been successfully updated', 'Ok')

        cy.get('#caseTypeList button:last').should('contain.text', editLabel)
    });

    it('Remove', () => {
        cy.contains('app-case-advanced-configuration button', 'Remove').click()
        cy.wait(500)
        cy.popup('Success', 'Case Type has been successfully removed', 'Ok')

        cy.get('#caseTypeList button:last').should('not.contain.text', editLabel)
    });

    it('Verify that the case type is available in the Cas config section', () => {
        cy.get('[title="Close"]').click()
        cy.contains('app-case-configuration kendo-formfield', 'Case Type').find('kendo-dropdownlist').click()
        cy.get('kendo-popup li:last').should('contain.text', editLabel)
    });
})