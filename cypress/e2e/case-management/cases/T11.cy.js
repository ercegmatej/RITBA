describe('T11 - Cases - Edit case - Email Communication tab', () => {

    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });
    
    it('Open case management - cases', () => {
        cy.sidenav('Case Management', 'Cases')
    });

    it('Select a case and go to email communication tab', () => {
        cy.get('app-case kendo-grid-list tr:first').click()
        cy.get('[title="Edit Case"]').click()
        cy.contains('app-edit-case > div', 'Case Information').click()
        cy.contains('li', 'Email Communication').click()
        cy.wait(1000)
    });

    it('Send email with wrong data', () => {
        cy.field('Subject...', '')
        cy.contains('button', 'Send Email').click()
        cy.requiredError('To...')
        cy.requiredError('Subject...')

        cy.field('To...', 'testgmail.com')
        cy.field('Subject...', 'Test QA')
        cy.formError('To...', 'Email format is invalid.')
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
            cy.get('kendo-colorpicker:eq(1) button').click()
        })
        cy.get('kendo-colorpalette td:eq(2)').click()
    });

    it('List', () => {
        cy.get('kendo-editor').within(() => {
            cy.get('kendo-colorpicker:eq(1) button').click()
            cy.iframe().find('p span').should('have.attr', 'style', 'font-size: 36px; font-family: Arial,"Helvetica Neue",Helvetica,sans-serif; color: #375623; background-color: #e6e6e6;')
            cy.iframe().find('p').type('{selectAll}')
            cy.get('[title="Insert unordered list"]').click()
            cy.iframe().find('p').parents('ul li')

            cy.iframe().find('p').type('{selectAll}')
            cy.get('[title="Insert ordered list"]').click()
            cy.iframe().find('p').parents('ol li')
        })
    });

    it('Margins', () => {
        cy.get('kendo-editor').within(() => {
            cy.iframe().find('p span').should('have.attr', 'style', 'font-size: 36px; font-family: Arial,"Helvetica Neue",Helvetica,sans-serif; color: #375623; background-color: #e6e6e6;')
            cy.iframe().find('p').type('{selectAll}')
            cy.get('[title="Insert unordered list"]').click()
            cy.iframe().find('p').parents('ul li')

            cy.get('[title="Insert unordered list"]').click()
            cy.iframe().find('p').type('{selectAll}')
            cy.get('[title="Indent"]').click()
            cy.iframe().find('p').should('have.attr', 'style', 'text-align: justify; margin-left: 30px;')
            cy.get('[title="Outdent"]').click()
            cy.iframe().find('p').should('have.attr', 'style', 'text-align: justify;')
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

    it('Clean formatting', () => {
        cy.get('kendo-editor').within(() => {
            cy.get('[title="Clean formatting"]').click()
            cy.iframe().find('p').should('not.have.attr', 'style')
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

    it('View source', () => {
        cy.get('kendo-editor').within(() => {
            cy.get('[title="View source"]').click()
        })
        cy.contains('kendo-dialog-actions button', 'Update').click()
    });


    it('Attach a document', () => {
        cy.contains('app-send-email button', 'Attachment').parent('div').find('input').attachFile('test.pdf')
        cy.get('.atr-filename').should('contain.text', 'test.pdf')
    });

    it('Send email', () => {
        cy.intercept('POST', 'https://ri2-crm-b.emovis.hr/CaseManagement/CaseEmailSend').as('sendEmail');
        cy.contains('app-send-email button', 'Send Email').click()
        cy.wait('@sendEmail').its('response.statusCode').should('eq', 200)
        cy.popup('Success', 'Email successfully sent', 'Ok')

        cy.contains('li', 'Attachment History').click()
        cy.contains('li', 'Email Communication').click()
        cy.verifyGridAdd('app-email-communication', 'From Email', 'noreply@xyz.com')
        cy.verifyGridAdd('app-email-communication', 'Email Type', 'Email Sent')
    });
});