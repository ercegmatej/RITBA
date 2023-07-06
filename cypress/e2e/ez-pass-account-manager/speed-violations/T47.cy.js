describe('T47 - EZ Pass - Speed violations - Grid functionality and search', () => {
    const gridHeaders = ['Toll Transaction Number', 'Plate', 'Post Date', 'Entry Time', 'Exit Time', 'Entry Plaza', 'Exit Plaza', 'Entry Lane', 'Exit Lane', 'Speed', 'Direction']
    const dropdownItems = ['All', 'Toll  Transaction  Number', 'Plate', 'Today', 'Last 7 Days', 'Last 14 Days', 'Last 30 Days']
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open the account', () => {
        cy.openAccount('Account Number', Cypress.env('speed-violations'))
    });

    it('Open the Speed Violations tab', () => {
        cy.tab('Speed Violations')
    });

    it('Grid headers', () => {
        cy.headers('app-account-speed-violations', '', gridHeaders)
    });

    it('Search dropdown items', () => {
        cy.dropdownItems('app-account-speed-violations kendo-grid-toolbar', dropdownItems)
    });

    it('Grid sort', () => {
        cy.sortGrid('app-account-speed-violations', '', '/Account/SpeedViolationList')
    });

    it('Pagination', () => {
        cy.page('app-account-speed-violations', '/Account/SpeedViolationList')
    });

    it('Search functionality', () => {
        cy.verifySearch('app-account-speed-violations', 'Toll Transaction Number', 'Toll Transaction Number', '/Account/SpeedViolationList')
        cy.verifySearch('app-account-speed-violations', 'Plate', 'Plate', '/Account/SpeedViolationList')
        cy.verifyDateSearch('app-account-speed-violations', 'Post Date', 'Today', '/Account/SpeedViolationList')
        cy.verifyDateSearch('app-account-speed-violations', 'Post Date', 'Last 7 Days', '/Account/SpeedViolationList')
        cy.verifyDateSearch('app-account-speed-violations', 'Post Date', 'Last 14 Days', '/Account/SpeedViolationList')
        cy.verifyDateSearch('app-account-speed-violations', 'Post Date', 'Last 30 Days', '/Account/SpeedViolationList')
    });

    //TODO account suspended/revoked
});