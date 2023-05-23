describe('T10 - Cases - Edit case', () => {
    const dayjs = require('dayjs')
    const today = dayjs().format('DD/MM/YYYY')
    const description = 'Cypress'
    const department = 'TR1942023'
    const case_type = 'TR_Case_DEP'
    const editDepartment = 'dep'
    const editCase_type = 'test1'
    let caseNumber = 0;
    
    it('Login', () => {
        cy.login('merceg', 'ritbaVPN%$532', 'Call Center')
    });

    it('Open case management - cases', () => {
        cy.sidenav('Case Management', 'Cases')
    });

    it('Add a new case', () => {
        cy.intercept('POST', 'https://ri2-crm.emovis.hr:2323/CaseManagement/CaseAdd').as('caseAdd')
        cy.get('[title="Add New Case "]').click()
        cy.search('app-account-search kendo-grid-toolbar', 'Account Number', '50002370', '/Search/MatchingAccountsList')
        cy.contains('app-account-search td', '50002370').dblclick()
        cy.wait(1000)
        cy.field('Department', department)
        cy.field('Case Type', case_type)
        cy.field('Description', description)
        cy.field('Assign To Me', '')
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
        cy.sortGrid('app-note-history', '', '/CaseManagement/CaseNotesList')
        cy.page('app-note-history', '/CaseManagement/CaseNotesList')
    });

    it('Changed History tab', () => {
        const gridHeaders = ['Created Date', 'User', 'Changed Property', 'Previous Value', 'New Value']
        cy.contains('li', 'Changed History').click()
        cy.wait(500)
        cy.headers('app-changed-history', '', gridHeaders)
        cy.sortGrid('app-changed-history', '', '/CaseManagement/CaseHistoryList')
        cy.page('app-changed-history', '/CaseManagement/CaseHistoryList')
    });

    it('Attachment History tab', () => {
        const gridHeaders = ['Created Date', 'Uploaded By', 'File Name']
        cy.contains('li', 'Attachment History').click()
        cy.wait(500)
        cy.headers('app-attachment-history', '', gridHeaders)
        cy.sortGrid('app-attachment-history', '', '/CaseManagement/CaseAttachmentsList')
        cy.page('app-attachment-history', '/CaseManagement/CaseAttachmentsList')
    });

    it('Email Communication tab', () => {
        const gridHeaders = ['Created Date', 'From Email', 'Message', 'Email Type']
        cy.contains('li', 'Email Communication').click()
        cy.wait(500)
        cy.headers('app-email-communication', '', gridHeaders)
        cy.sortGrid('app-email-communication', '', '/CaseManagement/CaseEmailHistoryList')
        cy.page('app-email-communication', '/CaseManagement/CaseEmailHistoryList')

        cy.get('app-edit-case > app-group:eq(1)').should('contain.text', 'Send Email')
        cy.contains('app-send-email app-input', 'To...').find('kendo-textbox span').should('have.length', 2)
        cy.get('app-email-communication kendo-grid-list tr:first').click()
        cy.contains('app-send-email app-input', 'To...').find('kendo-textbox span').should('have.length', 3)
    });

    it('Edit case details', () => {
        cy.contains('li', 'Account Summary').click()
        cy.wait(500)

        cy.field('Status', 'Processing')
        cy.field('Disposition Code', 'string')
        cy.field('Source', 'Web')

        cy.field('Department', editDepartment)
        cy.contains('kendo-formfield', 'Case Type').find('kendo-dropdownlist').should('not.contain.text', case_type)
        cy.contains('button', 'Update').click()
        cy.requiredError('Case Type')

        cy.field('Case Type', editCase_type)
        cy.field('Priority', 'Low')
        cy.calendar(0,'2023', 'Sep', '21')
        cy.field('Notes', 'Test note')
        cy.get('app-edit-case app-upload input').attachFile('test.pdf')
    });

    it('Update case', () => {
        cy.intercept('POST', 'https://ri2-crm.emovis.hr:2323/CaseManagement/CaseUpdate').as('update')
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
        cy.get('@updatedRow').find('td:eq(9)').should('contain.text', '21/09/2023')
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
        //TODO changed values verification
    });

    it('Attachment History', () => {
        cy.contains('li', 'Attachment History').click()
        cy.get('app-attachment-history kendo-grid-list tr:first td:eq(0)').should('contain.text', today)
        cy.get('app-attachment-history kendo-grid-list tr:first td:eq(2)').should('contain.text', 'test.pdf')
    });
})