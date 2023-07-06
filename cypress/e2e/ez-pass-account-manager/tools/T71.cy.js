describe('T71 - EZ Pass - Tools - Convert to Commercial', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Create a new individual account', () => {
        cy.createAcc('Individual')
    });

    it('Open the account', () => {
        cy.openAccount('Last Name', 'Prezime')
    });

    it('Convert to commercial', () => {
        cy.contains('')
    });
})