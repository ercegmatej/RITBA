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

    it('Chart and legend functionality', () => {
        cy.dropdown('app-case-summary', 'Department')
    })
})