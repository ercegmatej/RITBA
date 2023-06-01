Cypress._.times(1, (i) => {
    const accNumber = [ '51355556', '52112656', '52034047' ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T38 - EZ pass - Correspondence - Grid Functionality and search' + ' - ' + accType[i], () => {
        const gridHeaders1 = ['Correspondence Id', 'Correspondence Date', 'Correspondence Type', 'Status', 'Notification Date', 'User']
        const gridHeaders2 = ['Correspondence Id', 'Correspondence Date', 'Correspondence Type', 'Status', 'Notification Attempt Date', 'User']
        const gridHeaders3 = ['Correspondence Id', 'Correspondence Date', 'Correspondence Type', 'Status', 'Reason', 'User']
        const functionItems = ['Resend', 'Update Template and Resend']
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the History tab', () => {
            cy.tab('Correspondence')
        });

        it('Grid headers', () => {
            cy.headers('app-correspondence', '', gridHeaders1)
            cy.headers('app-undeliverable-correspondence', '', gridHeaders2)
            cy.headers('app-supressed-correspondence', '', gridHeaders3)
        });

        it('Dropdown functions', () => {
            cy.functionItems('app-correspondence', functionItems)
            cy.functionItems('app-undeliverable-correspondence', functionItems)
            cy.functionItems('app-supressed-correspondence', 'Abort Supression')
        });

        it('Grid sort', () => {
            cy.sortGrid('app-correspondence', '', '/Correspondence/CorrespondenceList')
            cy.sortGrid('app-undeliverable-correspondence', '', '/Correspondence/CorrespondenceList')
            cy.sortGrid('app-supressed-correspondence', '', '/Correspondence/CorrespondenceList')
        });

        it('Pagination', () => {
            cy.page('app-correspondence', '/Correspondence/CorrespondenceList')
            cy.page('app-undeliverable-correspondence', '/Correspondence/CorrespondenceList')
            cy.page('app-supressed-correspondence', '/Correspondence/CorrespondenceList')
        });

        //TODO WIP
    });
})