Cypress._.times(3, (i) => {
    const accNumber = [ '50037164', '52112656', '52034047' ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T49 - EZ Pass - Discount Plans - Grid functionality' + ' - ' + accType[i], () => {
        const gridHeaders = ['Assigned Device', 'Plan', 'Start Date', 'End Date', 'Transponder Status', 'IAG Code', 'Transponder Type']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Discount Plans tab', () => {
            cy.tab('Discount Plans')
        });

        it('Grid headers', () => {
            cy.headers('app-account-plans', '', gridHeaders)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-account-plans', '', '/Account/PlansList')
        });

        it('Pagination', () => {
            cy.page('app-account-plans', '/Account/PlansList')
        });

        it('Hide and show plan', () => {
            cy.get('.k-grouping-row:first td').should('have.attr', 'aria-expanded', 'true')
            cy.get('.k-grouping-row:first td [title="Collapse Group"]').click()
            cy.get('.k-grouping-row:first td').should('have.attr', 'aria-expanded', 'false')
            cy.get('.k-grouping-row:first td [title="Expand Group"]').click()
            cy.get('.k-grouping-row:first td').should('have.attr', 'aria-expanded', 'true')
        });
    });
})