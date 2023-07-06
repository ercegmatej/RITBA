Cypress._.times(2, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial')];
    const accType = [ 'Individual', 'Commercial'];
    describe('T52 - EZ Pass - Replenishment - Grid' + ' - ' + accType[i], () => {
        const gridHeaders1 = ['Card Type', 'Card', 'Name On Card', 'Priority', 'Primary', 'Exp Month', 'Exp Year', 'Card Status', 'Postal Code']
        const gridHeaders2 = ['Account Number', 'Account Holder Name', 'Bank Sort Code', 'Bank Name', 'Priority', 'Primary', 'ACH Status', 'Instruction Ref']
        const gridHeaders3 = ['Date', 'Amount', 'Method', 'PNRef', 'Message']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Replenishment tab', () => {
            cy.tab('Replenishment')
        });

        it('Grid headers', () => {
            cy.headers('app-credit-debit-cards', '', gridHeaders1)
            cy.headers('app-ach', '', gridHeaders2)
            cy.headers('app-auto-top-up-activity', '', gridHeaders3)
        });

        it('Grid sort', () => {
            cy.sortGrid('app-credit-debit-cards', ':eq(4)', '/Account/CardsList')
            cy.sortGrid('app-ach', '', '/Account/CardsList')//!Ako ne radi, nema apija
            cy.sortGrid('app-auto-top-up-activity', '', '/Account/CardsList')//!Ako ne radi, nema apija
        });

        it('Pagination', () => {
            cy.page('app-credit-debit-cards', '/Account/CardsList')
            cy.page('app-ach', '/Account/CardsList')//!Ako ne radi, nema apija
            cy.page('app-auto-top-up-activity', '/Account/CardsList')//!Ako ne radi, nema apija
        });

        it('Verify Replenishment Information', () => {
            cy.contains('app-account-rebill-methods kendo-formfield', 'Replenishment Amount').find('input').then(($amount) => {
                const amount = $amount.attr('aria-valuenow')
                cy.log(amount)
                cy.contains('app-account-rebill-methods kendo-formfield', 'Replenishment Threshold').find('input').then(($threshold) => {
                    const threshold = $threshold.attr('aria-valuenow')
                    cy.log(threshold)
                    cy.tab('Information')
                    cy.wait(1000)
                    cy.contains('app-account-plan-information h5', 'Thresholds').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', threshold)
                    cy.contains('app-account-plan-information h5', 'Thresholds').parent('div').find('input:eq(1)').should('have.attr', 'aria-valuenow', amount)
                })
            })
        });
    });
})