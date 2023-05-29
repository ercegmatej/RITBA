Cypress._.times(3, (i) => {
    const accNumber = [ '50002370', '52136866', '52034047' ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    const department = 'TR194';
    const case_type = 'TR_Case_DEP';
    describe('T42 - EZ Pass - Cases - Add new case (mandatory fields)' + ' - ' + accType[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Cases tab', () => {
            cy.tab('Cases')
        });

        it('Add new case - error', () => {
            cy.get('app-account-cases kendo-grid-toolbar [title="Add New Case "]').click()
            cy.get('kendo-dialog-titlebar').should('contain.text', 'Add New Case')
            cy.contains('kendo-dialog-actions button', 'Create Case').click()
            cy.requiredError('Department')
            cy.requiredError('Description')
        });

        it('Select department', () => {
            cy.field('Department', department)
            cy.contains('kendo-dialog-actions button', 'Create Case').click()
            cy.requiredError('Case Type')
        });

        it('Select case type and enter description', () => {
            cy.field('Case Type', case_type)
            cy.randomText().then(($description) => {
                cy.field('Description', $description)
            })
        });

        it('Create Case', () => {
            cy.intercept('POST', Cypress.env('ip') + '/CaseManagement/CaseAdd').as('caseAdd')
            cy.contains('kendo-dialog-actions button', 'Create Case').click()
            cy.wait('@caseAdd').its('response.statusCode').should('eq', 200)
            cy.popup('Add New Case', 'Case has been successfully created.', 'Ok')
        });

        it('Verify addition', () => {
            cy.verifyGridAdd('app-account-cases', 'Department', ' ' + department + ' ')
            cy.verifyGridAdd('app-account-cases', 'Case Type', ' ' +  case_type + ' ')
        });
    });
})