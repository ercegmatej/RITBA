describe('Search for account links', () => {
    it('Open app and search', () => {
      cy.intercept('/Account/TransponderHistoryList', {fixture: 'fixture.json'})
      cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
      cy.openAccount('Account Number', Cypress.env('individual'))
    });
});