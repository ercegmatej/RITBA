describe('T25 - Case Management - Advanced configuration - assign or change users for department', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });
    
    it('Open case management - Case Summary', () => {
        cy.sidenav('Case Management', 'Configuration / Summary')
    });

    it('Advanced Configuration', () => {
        cy.contains('kendo-dropdownbutton button', 'User Configuration').click()
        cy.contains('kendo-popup li', 'Advanced Configuration').click()
        cy.contains('kendo-dialog-titlebar', 'Advanced Configuration').should('be.visible')
    });

    it('Select a user and assign to a department', () => {
        cy.contains('kendo-label', 'Available Users').parent('div').find('button').filter(':contains(" 158921: ksabic ")').click()
        cy.contains('button', ' Apply User ').click()
        cy.wait(500)
        cy.contains('kendo-label', 'Users in this department').parent('div').find('button').filter(':contains(" 158921:ksabic ")').should('be.visible')
    });

    it('Reopen and verify that the user is still in the list', () => {
        cy.contains('button', 'Close').click()
        cy.sidenav('Case Management', 'Cases')
        cy.sidenav('Case Management', 'Configuration / Summary')

        cy.contains('kendo-dropdownbutton button', 'User Configuration').click()
        cy.contains('kendo-popup li', 'Advanced Configuration').click()
        cy.contains('kendo-label', 'Users in this department').parent('div').find('button').filter(':contains(" 158921:ksabic ")').should('be.visible')
    });

    it('Select a user and remove him from the department', () => {
        cy.contains('kendo-label', 'Users in this department').parent('div').find('button').filter(':contains(" 158921:ksabic ")').click()
        cy.contains('button', ' Remove User ').click()
        cy.wait(500)
        cy.contains('kendo-label', 'Available Users').parent('div').find('button').filter(':contains(" 158921: ksabic ")').should('exist')
    });

    it('Reopen and verify that the user is not in the department', () => {
        cy.contains('button', 'Close').click()
        cy.sidenav('Case Management', 'Cases')
        cy.sidenav('Case Management', 'Configuration / Summary')

        cy.contains('kendo-dropdownbutton button', 'User Configuration').click()
        cy.contains('kendo-popup li', 'Advanced Configuration').click()
        cy.contains('kendo-label', 'Available Users').parent('div').find('button').filter(':contains(" 158921: ksabic ")').should('exist')
        cy.contains('button', 'Close').click()
    });
})