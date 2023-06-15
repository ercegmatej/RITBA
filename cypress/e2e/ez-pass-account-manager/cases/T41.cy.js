Cypress._.times(4, (i) => {
const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue'), Cypress.env('non-revenue') ];
const accType = [ 'Individual (pdf)', 'Commercial (jpg)', 'Non-revenue (png)', 'Non-revenue (xsl)' ];
const file = [ 'test.pdf', 'test.jpg', 'test.png', 'test.xls']
const department = 'TR194';
const case_type = 'TR_CDaa';
    describe('T41 - EZ pass - Cases - Edit case, Email Communication tab' + ' - ' + accType[i], () => {

        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });
        
        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Cases tab', () => {
            cy.tab('Cases')
        });

        it('Add a new case', () => {
            cy.intercept('POST', Cypress.env('ip') + '/CaseManagement/CaseAdd').as('caseAdd')
            cy.get('[title="Add New Case "]').click()
            cy.field('app-add-case', 'Department', department)
            cy.field('app-add-case', 'Case Type', case_type)
            cy.randomText().then(($description) => {
                cy.field('app-add-case', 'Description', $description)
            })
            cy.field('app-add-case', 'Assign To Me', '')
            cy.contains('button', 'Create Case').click()
            cy.wait('@caseAdd').its('response.statusCode').should('eq', 200)
            cy.popup('Add New Case', 'Case has been successfully created.', 'Ok')
        });

        it('Case edit', () => {
            cy.get('app-case kendo-grid-list tr:first td:eq(3)').then(($case) => {
                cy.get($case).click()
            })
            cy.get('[title="Edit Case"]').click()
            cy.get('app-edit-case > div').should('contain.text', 'Case Information')
            cy.get('app-edit-case > app-group:first').should('contain.text', 'Case Details')
            cy.contains('app-edit-case > div', 'Case Information').click()
            cy.contains('li', 'Email Communication').click()
            cy.wait(1000)
        });

        it('Send email with wrong data', () => {
            cy.field('app-edit-case', 'Subject...', '')
            cy.contains('button', 'Send Email').click()
            cy.requiredError('app-edit-case', 'To...')
            cy.requiredError('app-edit-case', 'Subject...')

            cy.field('app-edit-case', 'To...', 'testgmail.com')
            cy.field('app-edit-case', 'Subject...', 'Test QA')
            cy.formError('app-edit-case', 'To...', 'Email format is invalid.')
        });

        it('Populate the fields with valid data', () => {
            cy.field('app-edit-case', 'To...', 'test@gmail.com')
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
            cy.contains('app-send-email button', 'Attachment').parent('div').find('input').attachFile(file[i])
            cy.get('.atr-filename').should('contain.text', file[i])
        });

        it('Send email', () => {
            cy.intercept('POST', Cypress.env('ip') + '/CaseManagement/CaseEmailSend').as('sendEmail');
            cy.contains('app-send-email button', 'Send Email').click()
            cy.wait('@sendEmail').its('response.statusCode').should('eq', 200)
            cy.popup('Success', 'Email successfully sent', 'Ok')

            cy.contains('li', 'Attachment History').click()
            cy.contains('li', 'Email Communication').click()
            cy.verifyGridData('app-email-communication', 'From Email', 0, 'noreply@xyz.com')
            cy.verifyGridData('app-email-communication', 'Email Type', 0, 'Email Sent')
        });
    });
})
