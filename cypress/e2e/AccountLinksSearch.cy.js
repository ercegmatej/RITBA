describe('Search for account links', () => {
    it('Open app and search', () => {
      cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
      cy.get('app-account-search kendo-pager kendo-dropdownlist').click()
      cy.contains('kendo-popup li', 100).click()
      cy.contains('app-account-search th', 'Account Number').click()
      cy.get('app-account-search kendo-grid-toolbar kendo-dropdownlist').click()
      cy.contains('kendo-popup li', 'Last Name').click()
      cy.get('app-account-search kendo-grid-toolbar input').type('Smith'+'{enter}')
      cy.wait(20000)
    });

    it('Search through accounts for linked accounts', () => {
        cy.get('app-account-search kendo-pager-numeric-buttons').each(($page) => {
          cy.get($page).click()
          cy.wait(20000)
          cy.get('app-account-search kendo-grid-list tr').each(($acc) => {
            cy.get($acc).click()
            cy.wait(2000)
            cy.get('app-root').then(($root) => {
              if($root.find('kendo-dialog').length > 1) {
                  cy.contains('kendo-dialog-actions button', 'Ok').click()
              }
            })
            cy.tab('Account Links')
          })
        })
    });
});