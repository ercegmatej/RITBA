describe('T83 - EZ Pass - Tolls - View image', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open the account', () => {
        cy.openAccount('Account Number', '50181060')
    });

    it('Open the Tolls tab', () => {
        cy.tab('Tolls')
    });

    it('Open the valid toll', () => {
        cy.itemsPerPage('app-account-tolls', '50', '/Tolls/AccountPassagesList')
        cy.contains('app-account-tolls kendo-grid-list [aria-colindex="8"]', ' 11:57 PM ')
        .parents('tr').find('[type="checkbox"]:eq(0)').check()
        cy.contains('kendo-dropdownbutton', 'Tolls').click()
        cy.contains('kendo-popup li', 'View Image').click()
        cy.contains('kendo-dialog-titlebar', 'View Image')
    });

    it('License plate image viewer functions', () => {
        cy.contains('app-licence-plate-image .app-action', 'Brightness').find('.k-slider-track').click()
        cy.contains('app-licence-plate-image .app-action', 'Brightness').find('[title="Decrease"]').click()
        cy.contains('app-licence-plate-image .app-action', 'Zoom').find('.k-slider-track').click()
        cy.contains('app-licence-plate-image .app-action', 'Zoom').find('[title="Decrease"]').click()
        cy.contains('app-licence-plate-image .app-action', 'Sharpness').find('.k-slider-track').click()
        cy.contains('app-licence-plate-image .app-action', 'Sharpness').find('[title="Decrease"]').click()

        // cy.get('.app-image-box').each(($img) => {
        //     cy.get($img).click()
        // })
    })

    it('Trip Details', () => {
        cy.intercept('GET', '/Tolls/**').as('tripDetails');
        cy.contains('app-image-review ul li', 'Trip Details').click()
        cy.wait('@tripDetails').its('response.statusCode').should('eq', 200)
    });

    it('Bottom buttons', () => {
        cy.contains('app-image-review button', 'Toll Reversal').click()
        cy.wait(500)
        cy.get('kendo-dialog-titlebar').should('contain.text', 'Toll Reversal')
        cy.contains('app-message-dialog:eq(1) kendo-dialog-actions button', ' Cancel ').click()
        cy.contains('app-image-review button', 'Toll Adjustment').click()
        cy.wait(500)
        cy.get('kendo-dialog-titlebar').should('contain.text', 'Toll Adjustment')
        cy.contains('app-message-dialog:eq(1) kendo-dialog-actions button', ' Cancel ').click()
        cy.contains('app-image-review button', 'Toll Transfer').click()
        cy.wait(500)
        cy.get('kendo-dialog-titlebar').should('contain.text', 'Toll Transfer')
        cy.contains('app-message-dialog:eq(1) kendo-dialog-actions button', ' Cancel ').click()
    });
})