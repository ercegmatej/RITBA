describe('T20 - Case Management - Template library - edit template', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });
    
    it('Open case management - Template Library', () => {
        cy.sidenav('Case Management', 'Template Library')
        cy.wait(1000)
    });

    it('Select a template and click edit', () => {
        cy.get('app-template-library kendo-grid-list tr:last').click()
        cy.get('[title="Edit Template"]').click()
        cy.contains('kendo-dialog-titlebar', 'Edit Template').should('be.visible')

        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        })
    });

    it('Font actions', () => {
        const btn = ['Bold', 'Italic', 'Underline']
        const el = ['strong', 'em', 'u']
        cy.get('kendo-editor').within(() => {
            for (let i = 0; i<btn.length; i++) {
                cy.iframe().find('p').type('{selectAll}')
                cy.get(`[title="${btn[i]}"]`).click()
                cy.iframe().find('p').children(el[i])
                cy.get(`[title=${btn[i]}]`).click()
            }
        })
    });

    it('Paragraph actions', () => {
        const btn = ['Align text left', 'Center text', 'Align text right', 'Justify']
        const el = ['left', 'center', 'right', 'justify']
        cy.get('kendo-editor').within(() => {
            for (let i = 0; i<btn.length; i++) {
                cy.iframe().find('p').type('{selectAll}')
                cy.get(`[title="${btn[i]}"]`).click()
                cy.iframe().find('p').should('have.attr', 'style', `text-align: ${el[i]};`)
            }
        })
    });

    it('Font size action', () => {
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p').type('{selectAll}')
            cy.get('kendo-editor-fontsize-dropdownlist').click()
        })
        cy.contains('kendo-popup li', '36px').click()
    });

    it('Font family action', () => {
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p span').should('have.attr', 'style', 'font-size: 36px;')
            cy.get('kendo-editor-fontfamily-dropdownlist').click()
        })
        cy.contains('kendo-popup li', 'Arial').click()
    });

    it('Colors', () => {
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p').type('{selectAll}')
            cy.get('kendo-colorpicker:eq(0) button').click()
        })
        cy.get('kendo-colorpalette td:last').click()
        cy.get('kendo-editor').within(() => {
            cy.get('kendo-colorpicker:eq(0) button').click()
            cy.iframe().find('p span').should('have.attr', 'style', 'font-size: 36px; font-family: Arial,"Helvetica Neue",Helvetica,sans-serif; color: #375623;')
        })
    });

    it('List', () => {
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p').type('{selectAll}')
            cy.get('[title="Insert unordered list"]').click()
            cy.iframe().find('p').parents('ul li')

            cy.iframe().find('p').type('{selectAll}')
            cy.get('[title="Insert ordered list"]').click()
            cy.iframe().find('p').parents('ol li')
        })
    });

    it('Hyperlink', () => {
        cy.get('kendo-editor').within(() => {
            cy.get('[title="Insert link"]').click()
        })
        cy.contains('kendo-label', 'Web address').parents('.k-form-field').find('input').type('https://www.w3.org/Provider/Style/dummy.html')
        cy.contains('kendo-label', 'Title').parents('.k-form-field').find('input').type('Link')
        cy.contains('kendo-dialog-actions button', 'Insert').click()
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p a').should('have.attr', 'href', 'https://www.w3.org/Provider/Style/dummy.html').and('have.attr', 'title', 'Link')
        })

        cy.get('kendo-editor').within(() => {
            cy.get('[title="Remove Link"]').click()
            cy.iframe().find('p a').should('not.exist')
        })
    });

    it('Insert image', () => {
        cy.get('kendo-editor').within(() => {
            cy.get('[title="Insert image"]').click()
        })
        cy.contains('kendo-label', 'Web address').parents('.k-form-field').find('input').type('https://picsum.photos/200/300')
        cy.contains('kendo-label', 'Alternate text').parents('.k-form-field').find('input').type('Image')
        cy.contains('kendo-label', 'Width (px)').parents('.k-form-field').find('input').type('200')
        cy.contains('kendo-label', 'Height (px)').parents('.k-form-field').find('input').type('300')
        cy.contains('kendo-dialog-actions button', 'Insert').click()
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p img:first').should('have.attr', 'src', 'https://picsum.photos/200/300')
            .and('have.attr', 'alt', 'Image')
            .and('have.attr', 'width', '200')
            .and('have.attr', 'height', '300')
        })
    });

    //TODO WIP

})