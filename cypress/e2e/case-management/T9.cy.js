describe('T9 - Cases - Add new case (all fields)', () => {
    const dayjs = require('dayjs')
    const today = dayjs().format('DD/MM/YYYY')
    const description = 'Cypress'
    const department = 'TR1942023'
    const case_type = 'TR_Case_DEP'
    const priority = 'Medium'
    it('Login', () => {
        cy.login('merceg', 'ritbaVPN%$532', 'Call Center')
    });

    it('Open case management - cases', () => {
        cy.sidenav('Case Management', 'Cases')
    });

    it('Open add new case window', () => {
        cy.get('[title="Add New Case "]').click()
    });

    it('Search by', () => {
        const dropdownItems = ['Account Number', 'Last Name', 'First Name', 'Transponder Number', 'Day Phone', 'Address', 'Email Address', 'Last 4 Digits']
        const term = ['50002370', 'Smith', 'Test', '03200038252', '048173', 'TEST1234', 'test@test.com', '1111']
        for (let i=0; i<dropdownItems.length; i++) {
            cy.search('app-account-search kendo-grid-toolbar', dropdownItems[i], term[i], '/Search/MatchingAccountsList')
            switch (dropdownItems[i]) {
                case 'Account Number':
                    cy.get('app-account-search kendo-grid-list tr:first td:first').contains(term[i], {matchCase: false}).should('exist')
                    break;
                case 'First Name':
                    cy.get('app-account-search kendo-grid-list tr:first td:eq(1)').contains(term[i], {matchCase: false}).should('exist')
                    break;
                case 'Last Name':
                    cy.get('app-account-search kendo-grid-list tr:first td:eq(2)').contains(term[i], {matchCase: false}).should('exist')
                    break;
                case 'Phone Number':
                    cy.get('app-account-search kendo-grid-list tr:first td:eq(4)').contains(term[i], {matchCase: false}).should('exist')
                    break;
            }
        }
    });

    it('Select an account', () => {
        cy.search('app-account-search kendo-grid-toolbar', 'Account Number', '50002370', '/Search/MatchingAccountsList')
        cy.contains('app-account-search td', '50002370').dblclick()
        cy.wait(1000)
    });

    it('Click create case before', () => {
        cy.contains('button', 'Create Case').click()
        cy.requiredError('Department')
        cy.requiredError('Case Type')
        cy.requiredError('Description')
    });

    it('Populate the mandatory fields', () => {
        cy.field('Department', department)
        cy.field('Case Type', case_type)
        cy.field('Description', description)
        cy.contains('kendo-formfield', 'Description').find('kendo-textarea').should('have.attr', 'maxlength', '100')
    });

    it('Populate non mandatory fields', () => {
        cy.field('Notes', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet a')
        cy.field('Priority', priority)
        cy.field('Severity', 'Low')
        cy.field('Assign To Me', '')
        cy.get('app-upload kendo-fileselect input').attachFile('user.pdf')
    });

    it('Create case', () => {
        cy.intercept('POST', 'https://ri2-crm.emovis.hr:2323/CaseManagement/CaseAdd').as('caseAdd')

        cy.contains('button', 'Create Case').click()
        cy.wait('@caseAdd').its('response.statusCode').should('eq', 200)
        cy.popup('Add New Case', 'Case has been successfully created.', 'Ok')
    });

    it('Verify that the case is added to the grid', () => {
        const data = [today, description, department, case_type, priority]
        cy.contains('th', 'Created Date').click().click()
        cy.get('app-case kendo-grid-list tr:first td').filter(':eq(2), :eq(4), :eq(5), :eq(6), :eq(8)').each(($td, i) => {
            cy.get($td).should('contain.text', data[i])
        })
    });
});