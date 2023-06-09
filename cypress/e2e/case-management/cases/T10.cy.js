describe('T10 - Cases - Edit case', () => {
    const dayjs = require('dayjs')
    const today = dayjs().format('MM/DD/YYYY')
    const description = 'Cypress'
    const department = 'TR194'
    const case_type = 'TR_CDaa'
    const editDepartment = 'dep'
    const editCase_type = 'testCase1'
    let caseNumber = 0;
    
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open case management - cases', () => {
        cy.sidenav('Case Management', 'Cases')
    });

    it('Add two new cases', () => {
        cy.intercept('POST', Cypress.env('ip') + '/CaseManagement/CaseAdd').as('caseAdd')
        cy.get('[title="Add New Case "]').click()
        cy.search('app-account-search kendo-grid-toolbar', 'Account Number', Cypress.env('individual'), '/Search/MatchingAccountsList')
        cy.contains('app-account-search td', Cypress.env('individual')).dblclick()
        cy.wait(1000)
        cy.field('app-add-case', 'Department', department)
        cy.field('app-add-case', 'Case Type', case_type)
        cy.field('app-add-case', 'Description', description)
        cy.field('app-add-case', 'Assign To Me', '')
        cy.contains('button', 'Create Case').click()
        cy.wait('@caseAdd').its('response.statusCode').should('eq', 200)
        cy.popup('Add New Case', 'Case has been successfully created.', 'Ok')

        cy.get('[title="Add New Case "]').click()
        cy.search('app-account-search kendo-grid-toolbar', 'Account Number', Cypress.env('individual'), '/Search/MatchingAccountsList')
        cy.contains('app-account-search td', Cypress.env('individual')).dblclick()
        cy.wait(1000)
        cy.field('app-add-case', 'Department', department)
        cy.field('app-add-case', 'Case Type', case_type)
        cy.field('app-add-case', 'Description', description)
        cy.field('app-add-case', 'Assign To Me', '')
        cy.contains('button', 'Create Case').click()
        cy.wait('@caseAdd').its('response.statusCode').should('eq', 200)
        cy.popup('Add New Case', 'Case has been successfully created.', 'Ok')
    });

    it('Case edit', () => {
        cy.get('app-case kendo-grid-list tr:first td:eq(3)').then(($case) => {
            caseNumber = $case.text()
            cy.log(caseNumber)
            cy.get($case).click()
        })
        cy.get('.k-i-edit').click()
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
        cy.sortGrid('app-note-history', ':first', '/CaseManagement/CaseNotesList')
        cy.page('app-note-history', '/CaseManagement/CaseNotesList')
    });

    it('Changed History tab', () => {
        const gridHeaders = ['Created Date', 'User', 'Changed Property', 'Previous Value', 'New Value']
        cy.contains('li', 'Changed History').click()
        cy.wait(500)
        cy.headers('app-changed-history', '', gridHeaders)
        cy.sortGrid('app-changed-history', ':first', '/CaseManagement/CaseHistoryList')
        cy.page('app-changed-history', '/CaseManagement/CaseHistoryList')
    });

    it('Attachment History tab', () => {
        const gridHeaders = ['Created Date', 'Uploaded By', 'File Name']
        cy.contains('li', 'Attachment History').click()
        cy.wait(500)
        cy.headers('app-attachment-history', '', gridHeaders)
        cy.sortGrid('app-attachment-history', ':first', '/CaseManagement/CaseAttachmentsList')
        cy.page('app-attachment-history', '/CaseManagement/CaseAttachmentsList')
    });

    it('Email Communication tab', () => {
        const gridHeaders = ['Created Date', 'From Email', 'Message', 'Email Type']
        cy.contains('li', 'Email Communication').click()
        cy.wait(500)
        cy.headers('app-email-communication', '', gridHeaders)
        cy.sortGrid('app-email-communication', ':first', '/CaseManagement/CaseEmailHistoryList')
        cy.page('app-email-communication', '/CaseManagement/CaseEmailHistoryList')
    });

    it('Edit case details - different department', () => {
        cy.contains('li', 'Account Summary').click()
        cy.wait(500)

        cy.field('app-edit-case', 'Status', 'Closed')
        cy.field('app-edit-case', 'Disposition Code', 'Test_Reason_Update_1')
        cy.field('app-edit-case', 'Source', 'Web')

        cy.field('app-edit-case', 'Department', editDepartment)
        cy.contains('kendo-formfield', 'Case Type').find('kendo-dropdownlist').should('not.contain.text', case_type)
        cy.contains('button', 'Update').click()
        cy.requiredError('app-edit-case', 'Case Type')

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

    it('Verify that the case is not displayed in the grid', () => {
        cy.contains('td', caseNumber).should('not.exist')
    });

    it('Edit case details - same department', () => {
        cy.get('app-case kendo-grid-list tr:first td:eq(3)').then(($case) => {
            caseNumber = $case.text()
            cy.log(caseNumber)
            cy.get($case).click()
        })
        cy.wait(500)
        cy.get('.k-i-edit').click()
        cy.get('app-edit-case > div').should('contain.text', 'Case Information')

        cy.field('app-edit-case', 'Status', 'Closed')
        cy.field('app-edit-case', 'Disposition Code', 'Test_Reason_Update_1')
        cy.field('app-edit-case', 'Source', 'Web')

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
        cy.get('@updatedRow').find('td:eq(7)').should('contain.text', 'Closed')
        cy.get('@updatedRow').find('td:eq(8)').should('contain.text', 'Low')
        cy.get('@updatedRow').find('td:eq(10)').should('contain.text', 'Web')
    });

    it('Verify that changes are recorded in the case window', () => {
        cy.contains('td', caseNumber).click().dblclick()

        cy.verifyField('app-edit-case', 'Status', 'Closed')
        cy.verifyField('app-edit-case', 'Disposition Code', 'Test_Reason_Update_1')
        cy.verifyField('app-edit-case', 'Source', 'Web')
        cy.verifyField('app-edit-case', 'Priority', 'Low')
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
})