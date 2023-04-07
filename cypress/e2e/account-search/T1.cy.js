describe('T1 - Commands', () => {
    const gridHeaders = ['Pin', 'Status', 'Account Number', 'First Name', 'Last Name', 'Business Name', 'Address Line 1', 'City', 'Province', 'Postal Code',
    'Registration', 'Plate No.', 'Open Citations', 'Disputed Citations', 'Mobile Number', 'Email Address', 'Open Date', 'Open Date', 'Transponder No.']
    const dropdownItems = ['Account Number', 'UTN Number', 'Last Name', 'First Name', 'Transponder Number', 'Day Phone', 'Address', 'Email Address', 'Last 4 Digits', 'Mobile Phone']

    it('Test commands', () => {
        cy.visit('/')
        //cy.contains('button', 'Ok').click()
        cy.wait(500)
    });

    it('headers', () => {
        cy.headers('app-account-search', gridHeaders)
    });

    it('sort', () => {
        cy.sort('app-account-search', ':first')
    });

    it('dropdown', () => {
        cy.dropdown('app-account-search kendo-grid-toolbar', dropdownItems)
    });
})