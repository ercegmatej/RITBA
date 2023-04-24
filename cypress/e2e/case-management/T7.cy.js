describe('T7 - Cases - Grid Functionality and search', () => {
    const gridHeaders = ['Created Date', 'Case Number', 'Description', 'Department', 'Case Type', 'Status', 'Priority', 'Due Date', 'Source', 'Notified',
    'Escalation Count', 'Post', 'Last Updated']
    const dropdownItems = ['All', 'Case No.', 'Description', 'Department', 'Case Type', 'Case Status', 
    'User', 'Current Date', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'Unread Email']

    it('Login', () => {
        cy.login('merceg', 'ritbaVPN%$532', 'Call Center')
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

    // it('Sort grid (2)', () => {
    //     cy.sort('app-case', ':eq(0), :eq(1)', '/CaseManagement/CasesList')
    // });

    it('Pagination (3)', () => {
        cy.page('app-case', '/CaseManagement/CasesList')
    });

    it('Double click on a case (4-5)', () => {
        cy.get('app-case kendo-grid-list tr:first').click().dblclick()
        cy.get('kendo-dialog-titlebar').should('contain.text', 'Edit Case')
        cy.get('[title="Close"]').click()
    });

    it('Search', () => {
        for (let i = 1; i<dropdownItems.length; i++) {
            cy.verifySearch('app-case', dropdownItems[i], gridHeaders[i], '/CaseManagement/CasesList')
        }
    });
});