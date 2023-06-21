describe('T22 - Case Management - User configuration', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });
    
    it('Open case management - Case Summary', () => {
        cy.sidenav('Case Management', 'Configuration / Summary')
    });

    it('Agents drop down', () => {
        let agents = [];
        cy.intercept('GET', '/CaseManagement/AvailableCaseAgents').as('advConfig');
        cy.contains('kendo-dropdownbutton button', 'User Configuration').click()
        cy.contains('kendo-popup li', 'Advanced Configuration').click()
        cy.wait('@advConfig').its('response.statusCode').should('eq', 200)
        cy.contains('kendo-label', 'Users in this department').next('div').find('button').each(($user) => {
            const user = $user.text().slice(8,-1)
            agents.push(user)
        })

        cy.get('[title="Close"]').click()
        cy.dropdownItems('app-user-configuration kendo-formfield:first', agents)
    });

    it('Department drop down', () => {
        let dep = [];
        cy.intercept('GET', '/CaseManagement/AvailableCaseAgents').as('advConfig');
        cy.contains('kendo-dropdownbutton button', 'User Configuration').click()
        cy.contains('kendo-popup li', 'Advanced Configuration').click()
        cy.wait('@advConfig').its('response.statusCode').should('eq', 200)
        cy.contains('app-case-advanced-configuration kendo-formfield', 'Department').find('kendo-dropdownlist').click()
        cy.get('kendo-popup li').each(($li) => {
            const department = $li.text()
            dep.push(department)
        })

        cy.get('[title="Close"]').click()
        cy.dropdownItems('app-user-configuration kendo-formfield:eq(1)', dep)
    });

    it('Update severity and max case hold', () => {
        cy.intercept('POST', '/CaseManagement/CaseUserInformationUpdate').as('update');
        cy.field('app-user-configuration', 'Severity', 'Low')
        cy.field('app-user-configuration', 'Max Case Hold', '4')
        cy.contains('app-user-configuration button', 'Update User Info').click()
        cy.wait('@update').its('response.statusCode').should('eq', 200)
        cy.popup('Update User', 'User information was successfully updated', 'Ok')
    });

    it('Reopen Config/Sum and verify change', () => {
        cy.sidenav('Case Management', 'Cases')
        cy.sidenav('Case Management', 'Configuration / Summary')

        cy.verifyField('app-user-configuration', 'CSR Users', 'merceg')
        cy.verifyField('app-user-configuration', 'Department', 'TR194')
        cy.verifyField('app-user-configuration', 'Severity', 'Low')
        cy.verifyField('app-user-configuration', 'Max Case Hold', '4')
    });
})