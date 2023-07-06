describe('T12 - Case Management - Summary', () => {

    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });
    
    it('Open case management - Case Summary', () => {
        cy.sidenav('Case Management', 'Configuration / Summary')
    });

    it('Case Summary - dates', () => {
        cy.calendar(0, '2022', 'Dec', '11')
        cy.calendar(1, '2023', 'Nov', '15')

    });

    // it('Chart and legend functionality', () => {
    //     cy.intercept('GET', '/Lookup/CaseStatuses').as('getStatuses')
    //     cy.intercept('GET', '/Lookup/CaseTypes').as('getTypes')
    //     cy.intercept('GET', '/Lookup/CSCUsers').as('getUsers')
    //     cy.intercept('POST', '/CaseManagement/CaseManagementSummary').as('postOverdue')

    //     cy.get('app-case-summary kendo-grid-list [aria-rowindex="2"] [aria-colindex="2"]').then(($col) => {
    //         const count=$col.text()

    //         cy.get('path').first().realHover()
    //         cy.get('kendo-popup').should('contain.text', count)
    //     })

    //     cy.contains('th', 'Legend').click().click()
    //     cy.grid('Legend', '')

    //     cy.contains('kendo-formfield', 'Summary With').find('kendo-dropdownlist').click()
    //     cy.contains('kendo-popup li', 'Case Status').click()
    //     cy.wait('@getStatuses').its('response.statusCode').should('eq', 200)

    //     cy.contains('kendo-formfield', 'Summary With').find('kendo-dropdownlist').click()
    //     cy.contains('kendo-popup li', 'Case Type').click()
    //     cy.wait('@getTypes').its('response.statusCode').should('eq', 200)

    //     cy.contains('kendo-formfield', 'Summary With').find('kendo-dropdownlist').click()
    //     cy.contains('kendo-popup li', 'Worked on user').click()
    //     cy.wait('@getUsers').its('response.statusCode').should('eq', 200)

    //     cy.contains('kendo-formfield', 'Summary With').find('kendo-dropdownlist').click()
    //     cy.contains('kendo-popup li', 'Over due date').click()
    //     cy.wait('@postOverdue').its('response.statusCode').should('eq', 200)

    //     cy.contains('kendo-formfield', 'Summary With').find('kendo-dropdownlist').click()
    //     cy.contains('kendo-popup li', 'Priority').click()
    //     cy.wait('@postOverdue').its('response.statusCode').should('eq', 200)
    // })
})