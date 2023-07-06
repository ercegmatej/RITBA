describe('T23 - Case Management - Case configuration', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });
    
    it('Open case management - Case Summary', () => {
        cy.sidenav('Case Management', 'Configuration / Summary')
    });

    it('Update without selecting case type', () => {
        cy.contains('app-case-configuration button', ' Update Case Type Info ').click()
        cy.requiredError('app-case-configuration', 'Case Type')
        cy.requiredError('app-case-configuration', 'Severity')
        cy.requiredError('app-case-configuration', 'Priority')
    });

    it('Select a case type', () => {
        cy.field('app-case-configuration', 'Department', ':first')
        cy.field('app-case-configuration', 'Case Type', 'Test QA')
        cy.verifyField('app-case-configuration', 'Severity', 'Low')
        cy.verifyField('app-case-configuration', 'Priority', 'Low')
        cy.verifyField('app-case-configuration', 'Days To Solve', '40')
        cy.verifyField('app-case-configuration', 'Currently Enabled', 'not.be.checked')
    });

    it('Change fields and update', () => {
        cy.intercept('POST', '/CaseManagement/CaseTypeConfigurationUpdate').as('update');
        cy.field('app-case-configuration', 'Severity', 'High')
        cy.field('app-case-configuration', 'Priority', 'Medium')
        cy.field('app-case-configuration', 'Days To Solve', '10')
        cy.field('app-case-configuration', 'Currently Enabled', 'check')
        cy.contains('app-case-configuration button', ' Update Case Type Info ').click()
        cy.wait('@update').its('response.statusCode').should('eq', 200)
        cy.popup('Update Case Type', 'Case type has been successfully updated', 'Ok')
    });

    it('Reopen Config/Sum and verify change', () => {
        cy.sidenav('Case Management', 'Cases')
        cy.sidenav('Case Management', 'Configuration / Summary')

        cy.field('app-case-configuration', 'Case Type', 'Test QA')
        cy.verifyField('app-case-configuration', 'Severity', 'High')
        cy.verifyField('app-case-configuration', 'Priority', 'Medium')
        cy.verifyField('app-case-configuration', 'Days To Solve', '10')
        cy.verifyField('app-case-configuration', 'Currently Enabled', 'be.checked')
    });

    it('Revert changes', () => {
        cy.intercept('POST', '/CaseManagement/CaseTypeConfigurationUpdate').as('update');
        cy.field('app-case-configuration', 'Severity', 'Low')
        cy.field('app-case-configuration', 'Priority', 'Low')
        cy.field('app-case-configuration', 'Days To Solve', '40')
        cy.field('app-case-configuration', 'Currently Enabled', 'uncheck')
        cy.contains('app-case-configuration button', ' Update Case Type Info ').click()
        cy.wait('@update').its('response.statusCode').should('eq', 200)
        cy.popup('Update Case Type', 'Case type has been successfully updated', 'Ok')
    });
})