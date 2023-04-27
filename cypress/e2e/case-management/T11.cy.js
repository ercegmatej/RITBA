describe('T11 - Cases - Edit case - Email Communication tab', () => {

    it('Login', () => {
        cy.login('merceg', 'ritbaVPN%$532', 'Call Center')
    });
    
    it('Open case management - cases', () => {
        cy.sidenav('Case Management', 'Cases')
    });

    it('Select a case and go to email communication tab', () => {
        cy.get('app-case kendo-grid-list tr:first').click()
        cy.get('[title="Edit Case"]').click()
        cy.contains('app-edit-case > div', 'Case Information').click()
        cy.contains('li', 'Email Communication').click()
    });

    it('Send email with wrong data', () => {
        cy.field('Subject...', '')
        cy.contains('button', 'Send Email').click()
        cy.requiredError('To...')
        cy.requiredError('Subject...')

        cy.field('To...', 'testgmail.com')
        cy.field('Subject...', 'Test QA')
        //cy.formError('To...', 'Email format is invalid.')
    });

    it('Populate the fields with valid data', () => {
        cy.field('To...', 'test@gmail.com')
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        })
    });

    it('Font actions', () => {
        const btn = ['Bold', 'Italic', 'Underline', 'Strikethrough', 'Subscript', 'Superscript']
        const el = ['strong', 'em', 'u', 'del', 'sub', 'sup']
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

    it('Format action', () => {
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p').type('{selectAll}')
            cy.get('kendo-editor-format-dropdownlist').click()
        })
        cy.contains('kendo-popup li', 'Heading 1').click()
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('h1').should('exist')
            cy.get('kendo-editor-format-dropdownlist').click()
        })
        cy.contains('kendo-popup li', 'Paragraph').click()
    });

    it('Font size action', () => {
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p').type('{selectAll}')
            cy.get('kendo-editor-fontsize-dropdownlist').click()
        })
        cy.contains('kendo-popup li', '36px').click()
    });



    // it('Font famliy action', () => {
    //     cy.get('kendo-editor').within(() => {
    //         cy.iframe().find('p span').should('have.attr', 'style', 'font-size: 36px;')
    //         cy.get('kendo-editor-fontfamily-dropdownlist').click()
    //     })
    //     cy.contains('kendo-popup li', 'Arial').click()
    //     cy.get('kendo-editor').within(() => {
    //         cy.iframe().find('p span').should('have.attr', 'style', 'font-size: 36px; font-family: Arial,"Helvetica Neue",Helvetica,sans-serif;')
    //         cy.get('kendo-editor-fontfamily-dropdownlist').click()
    //     })
    // });
});