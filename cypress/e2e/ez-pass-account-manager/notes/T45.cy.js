Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T45 - EZ pass - Notes - Add note+ (from the grid)' + ' - ' + accType[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Notes tab', () => {
            cy.tab('Notes')
        });

        it('Add note window', () => {
            cy.get('app-notes [title="Add"]').click()
            cy.get('kendo-dialog-titlebar').should('contain.text', 'Note : ' + accNumber[i])
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.requiredError('app-add-note', 'Reason')
            cy.requiredError('app-add-note', 'Title')
            cy.requiredError('app-add-note', 'Note')
        });

        it('Populate fields', () => {
            cy.contains('app-add-note kendo-formfield', 'Reason').find('kendo-dropdownlist').click()
            cy.get('kendo-popup li:first').click()
            cy.contains('app-add-note kendo-formfield', 'Title').find('input').should('have.attr', 'aria-invalid', 'false')
            cy.field('app-add-note', 'Title', 'Test QA')
            cy.field('app-add-note', 'Note', 'Test QA')
            cy.get('app-add-note app-upload input').attachFile('test.pdf')
        });

        it('Create a new note', () => {
            cy.intercept('POST', '/Account/NoteAdd').as('addNote');
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.wait('@addNote').its('response.statusCode').should('eq', 200);

            cy.contains('app-notes button', ' Show All Notes ').click()
            cy.verifyGridData('app-notes', 'Content', 0, 'Test QA')
        });

        it('Verify addition in info tab', () => {
            cy.tab('Information')
            cy.wait(500)
            cy.contains('app-information-notes button', 'Show All Notes').click()
            cy.verifyGridData('app-information-notes', 'Title/Comment', 0, 'Test QA')
        });
    });
})