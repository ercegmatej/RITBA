describe('Search for account links', () => {
    it('Open app and search', () => {
      cy.intercept('/CaseManagement/CasesList', {fixture: 'cases.json'})
      cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
      cy.sidenav('Case Management', 'Cases')
    });
});