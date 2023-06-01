Cypress._.times(3, (i) => {
    const accNumber = [ '50037164', '52136866', '52034047' ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    const department = 'TR194';
    const case_type = 'TR_Case_DEP';
    const editDepartment = 'dep';
    const editCase_type = 'test1';
    let caseNumber = 0;
    describe('T40 - EZ Pass - Cases - Edit case' + ' - ' + accType[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Cases tab', () => {
            cy.tab('Cases')
        });

        it('Add a new case', () => {
            cy.intercept('POST', Cypress.env('ip') + '/CaseManagement/CaseAdd').as('caseAdd')
            cy.get('[title="Add New Case "]').click()
            cy.field('app-add-case', 'Department', department)
            cy.field('app-add-case', 'Case Type', case_type)
            cy.randomText().then(($description) => {
                cy.field('app-add-case', 'Description', $description)
            })
            cy.field('app-add-case', 'Assign To Me', '')
            cy.contains('button', 'Create Case').click()
            cy.wait('@caseAdd').its('response.statusCode').should('eq', 200)
            cy.popup('Add New Case', 'Case has been successfully created.', 'Ok')
        });
    
        it('Case edit', () => {
            cy.get('app-case kendo-grid-list tr:first td:eq(3)').then(($case) => {
                caseNumber = $case.text()
                cy.get($case).click()
            })
            cy.get('[title="Edit Case"]').click()
            cy.get('app-edit-case > div').should('contain.text', 'Case Information')
            cy.get('app-edit-case > app-group:first').should('contain.text', 'Case Details')
        });
    
        it('Case Information', () => {
            const tab = ['Account Summary', 'Note History', 'Changed History', 'Attachment History', 'Email Communication']
            cy.contains('app-edit-case > div', 'Case Information').as('caseInfo')
            cy.get('@caseInfo').click()
            cy.get('@caseInfo').find('li').each(($tab, i) => {
                cy.get($tab).should('contain.text', tab[i])
            })
            cy.get('@caseInfo').find('input').should('have.attr', 'readonly')
            cy.get('@caseInfo').find('textarea').should('have.attr', 'readonly')
        });
    
        it('Notes History tab', () => {
            const gridHeaders = ['Created Date', 'Created By', 'Notes', 'Uploaded Document']
            cy.contains('li', 'Note History').click()
            cy.wait(500)
            cy.headers('app-note-history', '', gridHeaders)
            cy.sortGrid('app-note-history', ':eq(0)', '/CaseManagement/CaseNotesList')
            cy.page('app-note-history', '/CaseManagement/CaseNotesList')
        });
    
        it('Changed History tab', () => {
            const gridHeaders = ['Created Date', 'User', 'Changed Property', 'Previous Value', 'New Value']
            cy.contains('li', 'Changed History').click()
            cy.wait(500)
            cy.headers('app-changed-history', '', gridHeaders)
            cy.sortGrid('app-changed-history', ':eq(0)', '/CaseManagement/CaseHistoryList')
            cy.page('app-changed-history', '/CaseManagement/CaseHistoryList')
        });
    
        it('Attachment History tab', () => {
            const gridHeaders = ['Created Date', 'Uploaded By', 'File Name']
            cy.contains('li', 'Attachment History').click()
            cy.wait(500)
            cy.headers('app-attachment-history', '', gridHeaders)
            cy.sortGrid('app-attachment-history', ':eq(0)', '/CaseManagement/CaseAttachmentsList')
            cy.page('app-attachment-history', '/CaseManagement/CaseAttachmentsList')
        });
    
        it('Email Communication tab', () => {
            const gridHeaders = ['Created Date', 'From Email', 'Message', 'Email Type']
            cy.contains('li', 'Email Communication').click()
            cy.wait(500)
            cy.headers('app-email-communication', '', gridHeaders)
            cy.sortGrid('app-email-communication', ':eq(0)', '/CaseManagement/CaseEmailHistoryList')
            cy.page('app-email-communication', '/CaseManagement/CaseEmailHistoryList')
        });
    
        it('Edit case details', () => {
            cy.get('kendo-dialog-titlebar [title="Close"]:eq(1)').click()
            cy.contains('td', caseNumber).click().dblclick()
            cy.wait(2000)

            cy.contains('app-edit-case kendo-formfield', 'Status').find('kendo-dropdownlist').click()
            cy.contains('kendo-popup li', 'Closed').click()
            cy.field('app-edit-case', 'Disposition Code', 'string')
            cy.field('app-edit-case', 'Source', 'Web')
    
            cy.field('app-edit-case', 'Department', editDepartment)
            cy.contains('kendo-formfield', 'Case Type').find('kendo-dropdownlist').should('not.contain.text', case_type)
            cy.contains('button', 'Update').click()
            cy.requiredError('Case Type')
    
            cy.field('app-edit-case', 'Case Type', editCase_type)
            cy.field('app-edit-case', 'Priority', 'Low')
            cy.field('app-edit-case', 'Notes', 'Test note')
            cy.get('app-edit-case app-upload input').attachFile('test.pdf')
        });
    
        it('Update case', () => {
            cy.intercept('POST', Cypress.env('ip') + '/CaseManagement/CaseUpdate').as('update')
            cy.contains('button', 'Update').click()
            cy.wait('@update').its('response.statusCode').should('eq', 200)
            cy.popup('', 'Case successfully saved.', 'Ok')
        })
    
        it('Verify change in the grid', () => {
            cy.contains('td', caseNumber).parent('tr').as('updatedRow')
            cy.get('@updatedRow').find('td:eq(5)').should('contain.text', editDepartment)
            cy.get('@updatedRow').find('td:eq(6)').should('contain.text', editCase_type)
            cy.get('@updatedRow').find('td:eq(7)').should('contain.text', 'Processing')
            cy.get('@updatedRow').find('td:eq(8)').should('contain.text', 'Low')
            cy.get('@updatedRow').find('td:eq(10)').should('contain.text', 'Web')
        });
    
        it('Verify that changes are recorded in the case window', () => {
            cy.contains('td', caseNumber).click().dblclick()
    
            cy.verifyField('Case Type', editCase_type)
            cy.verifyField('Status', 'Processing')
            cy.verifyField('Disposition Code', 'string')
            cy.verifyField('Source', 'Web')
            cy.verifyField('Department', editDepartment)
            cy.verifyField('Priority', 'Low')
        });
    
        it('Verify Note History', () => {
            cy.contains('app-edit-case > div', 'Case Information').click()
            cy.contains('li', 'Note History').click()
            cy.get('app-note-history kendo-grid-list tr:first td:eq(0)').should('contain.text', today)
            cy.get('app-note-history kendo-grid-list tr:first td:eq(2)').should('contain.text', 'Test Note')
        });
        
        it('Changed Note History', () => {
            cy.contains('li', 'Changed History').click()
            cy.get('app-changed-history kendo-grid-list tr:first td:eq(0)').should('contain.text', today)
        });
    
        it('Attachment History', () => {
            cy.contains('li', 'Attachment History').click()
            cy.get('app-attachment-history kendo-grid-list tr:first td:eq(0)').should('contain.text', today)
            cy.get('app-attachment-history kendo-grid-list tr:first td:eq(2)').should('contain.text', 'test.pdf')
        });
    });
})