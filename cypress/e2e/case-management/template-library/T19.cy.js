describe('T19 - Cases - Template library grid functionality and add new template', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });
    
    it('Open case management - Template Library', () => {
        cy.sidenav('Case Management', 'Template Library')
    });

    it('Grid headers', () => {
        const gridHeaders = ['Title', 'Reason', 'Template Name']
        cy.headers('app-template-library', '', gridHeaders)
    });

    it('Sort grid', () => {
        cy.intercept('GET', '/CaseManagement/CaseTemplates').as('sort')
        cy.get('app-template-library').within(() => {
            cy.get('kendo-grid-list tr').then(($tr) => {
                if (!$tr.text().includes('No records available.')) {
                    cy.get('th').each(($th) => {
                        cy.get($th).click()
                        cy.wait('@sort').its('response.statusCode').should('eq', 200)
                        cy.get($th).should('have.attr', 'aria-sort', 'ascending')
            
                        cy.get($th).click()
                        cy.wait('@sort').its('response.statusCode').should('eq', 200)
                        cy.get($th).should('have.attr', 'aria-sort', 'descending')

                        cy.get($th).click()
                        cy.wait('@sort').its('response.statusCode').should('eq', 200)
                        cy.get($th).find('kendo-icon').should('not.exist')                 
                    })
                }
            })
        })
    });

    it('Add new template', () => {
        cy.intercept('POST', '/CaseManagement/CaseTemplateAdd').as('addTemplate');
        cy.get('app-template-library tr:last [aria-colindex="1"]').then(($title) => {
            const title=$title.text()
            const newTitle=title+'1'

            cy.get('[title="Add new Template "]').click()
            cy.contains('kendo-dialog-titlebar', 'Create New Template')
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.requiredError('app-add-template', 'Title')
            cy.requiredError('app-add-template', 'Reason')
            cy.requiredError('app-add-template', 'Template Name')

            cy.field('app-add-template', 'Title', newTitle)
            cy.field('app-add-template', 'Reason', newTitle)
            cy.field('app-add-template', 'Template Name', newTitle)
            cy.contains('kendo-dialog-actions button', 'Save').click()
            cy.wait('@addTemplate').its('response.statusCode').should('eq', 200)
            cy.popup('Success', 'Case Template has been successfully created.', 'Ok')

            cy.get('app-template-library kendo-grid-list tr:last td:eq(0)').should('contain.text', newTitle)
            cy.get('app-template-library kendo-grid-list tr:last td:eq(1)').should('contain.text', newTitle)
            cy.get('app-template-library kendo-grid-list tr:last td:eq(2)').should('contain.text', newTitle)
        })
    });
})