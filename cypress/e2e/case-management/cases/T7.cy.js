describe('T7 - Cases - Grid Functionality and search', () => {
    const gridHeaders = ['Created Date', 'Case Number', 'Description', 'Department', 'Case Type', 'Status', 'Priority', 'Due Date', 'Source', 'Notified',
    'Escalation Count', 'Post', 'Last Updated']
    const dropdownItems = ['All', 'Case No.', 'Description', 'Department', 'Case Type', 'Case Status', 
    'User', 'Current Date', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Unread Email']

    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open case management - cases (1)', () => {
        cy.sidenav('Case Management', 'Cases')
    });

    it('Verify grid headers', () => {
        cy.headers('app-case', ':eq(0), :eq(1)', gridHeaders)
    });

    it('Verify dropdown items', () => {
        cy.dropdownItems('app-case kendo-grid-toolbar', dropdownItems)
    });

    it('Sort grid (2)', () => {
        cy.sortGrid('app-case', ':eq(0), :eq(1), :eq(13)', '/CaseManagement/CasesList')
    });

    it('Pagination (3)', () => {
        cy.page('app-case', '/CaseManagement/CasesList')
    });

    it('Double click on a case (4-5)', () => {
        cy.randomValue(0, 20, 0).then($num => {
            cy.log($num)
            cy.get(`app-case kendo-grid-list tr:eq(${$num})`).click().dblclick()
        })
        cy.get('kendo-dialog-titlebar').should('contain.text', 'Edit Case')
        cy.get('[title="Close"]').click()
    });

    it('Search categories (6-11)', () => {
        for (let i = 1; i<5; i++) {
            cy.verifySearch('app-case', dropdownItems[i], gridHeaders[i], '/CaseManagement/CasesList')
        }
        cy.get('app-case kendo-grid-toolbar kendo-dropdownlist').click()
        cy.contains('kendo-popup li', 'User').click()
        cy.get('app-case kendo-grid-toolbar kendo-dropdownlist:eq(1)').click()
        cy.contains('kendo-popup li', 'Matej Erceg').click()
        cy.wait(1000)
        cy.get('app-case kendo-grid-list tr').should('have.length.above', 1)
    });

    it('Date search 12-13', () => {
        for (let i = 7; i<10; i++) {
            cy.verifyDateSearch('app-case', 'Created Date', dropdownItems[i], '/CaseManagement/CasesList')
        }
    });
});