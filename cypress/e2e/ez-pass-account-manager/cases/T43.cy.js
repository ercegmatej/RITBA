Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    const department = 'TR194';
    const case_type = 'TR_CDaa';
    const priority = 'Medium';
    describe('T43 - EZ Pass - Cases - Add new case (all fields)' + ' - ' + accType[i], () => {
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
            cy.requiredError('app-add-case', 'Department')
            cy.requiredError('app-add-case', 'Description')
        });

        it('Select department', () => {
            cy.field('app-add-case', 'Department', department)
            cy.contains('kendo-dialog-actions button', 'Create Case').click()
            cy.requiredError('app-add-case', 'Case Type')
        });

        it('Select case type and enter description', () => {
            cy.field('app-add-case', 'Case Type', case_type)
            cy.randomText().then(($description) => {
                cy.field('app-add-case', 'Description', $description)
            })
        });

        it('Populate non mandatory fields', () => {
            cy.randomText().then(($notes) => {
                cy.field('app-add-case', 'Notes', $notes)
            })
            cy.field('app-add-case', 'Priority', priority)
            cy.field('app-add-case', 'Severity', 'Low')
            cy.field('app-add-case', 'Assign To Me', '')
            cy.get('app-upload kendo-fileselect input').attachFile('user.pdf')
        });

        it('Create Case', () => {
            cy.intercept('POST', Cypress.env('ip') + '/CaseManagement/CaseAdd').as('caseAdd')
            cy.contains('kendo-dialog-actions button', 'Create Case').click()
            cy.wait('@caseAdd').its('response.statusCode').should('eq', 200)
            cy.popup('Add New Case', 'Case has been successfully created.', 'Ok')
        });

        it('Verify addition', () => {
            cy.verifyGridData('app-account-cases', 'Department', 0, ' ' + department + ' ')
            cy.verifyGridData('app-account-cases', 'Case Type', 0, ' ' +  case_type + ' ')
            cy.verifyGridData('app-account-cases', 'Priority', 0, ' ' + priority + ' ')
        });
    });
})