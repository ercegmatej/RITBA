describe('T93 - Create new E-Z pass acc, type Non revenue', () => {
    it('Login', () => {
        cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
    });

    it('Open create new account', () => {
        cy.sidenav('Account Establishment', 'New E-ZPass Account')
    });

    it('Fill all mandatory fields in General section', ()=> {
        cy.mandatoryFields()
    
    })

    it('Account Plan', () => {
        cy.accountPlan('Non Revenue', '', 'Email', 'Email')
        cy.contains('kendo-label', 'Email').should('have.class', 'app-label-required')
        cy.contains('kendo-label', 'Company Name').should('have.class', 'app-label-required')
    });

    it('Fill company name', () => {
        cy.field('app-account-information', 'Company Name', 'Test Company 23')

    })

    it('Go to Plans tab and add 10 transponder, Bluex10, IAG 72, applied plan non-revenue', () => {
        const dropdownItems = ['Interior Tag Ivory','Interior Tag Blue', 'LicPlate Tag Black', 'Exterior Roof Tag Black']
        cy.contains('li', 'Plans').click()
        cy.get('app-account-plans [title="Add"]').click()
        cy.wait(500)
        cy.dropdownItems('app-transponder-edit kendo-formfield:visible:first', dropdownItems)
        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'Blue')
        cy.field('app-transponder-edit', 'Quantities', '10')
        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
    });

    it('Select available plan Non revenue and apply, In current plan select Standard plan and remove', () => {
        cy.contains('button', 'Apply Plan').click()
        cy.popup('Warning', 'Please select some of available plans to apply.', 'Ok') 
        cy.get('app-group').contains(' 270 : Non-Revenue Plan ').click()
        cy.contains('button', 'Apply Plan').click()
        cy.get('app-group').contains(' 1 : Standard Plan (Default) ').click()
        cy.contains('button', 'Remove Plan').click()
    });

    it('Check Fetch plan history and Option out Without changing Plan Date section, click Save', () => {
        cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
        cy.field('app-transponder-edit', 'Option Out', 'check')
        cy.contains('kendo-dialog-actions button', 'Save').click()
        cy.popup('Success', 'Transponder saved successfully', 'Ok')
    });

    it('Go to Transpoders tab and add 20 transponder, Licplate tag black x20, IAG 72, applied plan standard', () => {
        const dropdownItems = ['Interior Tag Ivory','Interior Tag Blue', 'LicPlate Tag Black', 'Exterior Roof Tag Black']
        cy.contains('li', 'Transponders').click()
        cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Status', 0, 'INACTIVE')
        cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'IAG ID', 0, '72')
        cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Device Color', 0, 'Blue')
        cy.get('app-account-transponder [title="Add"]').click()
        cy.wait(500)
        cy.dropdownItems('app-transponder-edit kendo-formfield:visible:first', dropdownItems)
        cy.field('app-transponder-edit app-select-one:visible', 'Tag', 'LicPlate Tag Black')
        cy.field('app-transponder-edit', 'Quantities', '20')
        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
        cy.contains('kendo-dialog-actions button', 'Save').click()
        cy.popup('Success', 'Transponder saved successfully', 'Ok')
        cy.get('app-account-transponder [aria-rowcount="31"]').should('exist')
        //cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Status', 100, 'INACTIVE')
        //cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'IAG ID', 100, '72')
        //cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Device Color', 100, 'Black')
    });

    it('Go to Transpoders tab and add 20 transponder, Roofmount tag black x20, IAG 72, applied plan non-revenue', () => {
        const dropdownItems = ['Interior Tag Ivory','Interior Tag Blue', 'LicPlate Tag Black', 'Exterior Roof Tag Black']
        cy.get('app-account-transponder [title="Add"]').click()
        cy.wait(500)
        cy.dropdownItems('app-transponder-edit kendo-formfield:visible:first', dropdownItems)
        cy.field('app-transponder-edit app-select-one:visible', 'Tag', 'Exterior Roof Tag Black')
        cy.field('app-transponder-edit', 'Quantities', '20')
        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
        cy.contains('kendo-dialog-actions button', 'Save').click()
        cy.popup('Success', 'Transponder saved successfully', 'Ok')
        cy.get('app-account-transponder [aria-rowcount="51"]').should('exist')
        //cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Status', 100, 'INACTIVE')
        //cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'IAG ID', 100, '72')
        //cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Device Color', 100, 'Black')
    });

    it('Go to payments tab', () => {
        cy.contains('li', 'Payments').click()
        cy.contains('app-account-create-manager button', 'Save').click()
        cy.get('kendo-dialog').contains('Account must have at least one vehicle.').should('be.visible')
        cy.popup('Error','Account must have at least one vehicle.','Ok')
    });

Cypress._.times(5, () => {
    it('Go to the vehicle tab and click + to add a new vehicle, and Add additional 10 vehicles ', () => {
        cy.addVehicle()

    });
    })

    it('Total 5 vehicle is in the grid', () => {
        cy.get('app-account-vehicles [aria-rowcount="6"]').should('exist')   
    });

    it('Go to the payments tab', () => {
        cy.intercept('POST', '/Account/CreateAccount').as('create');
            cy.contains('li', 'Payments').click()
            // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 35)
            cy.contains('button', 'Cash').should('have.attr', 'aria-pressed', 'true')

            // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(1)').type(2)
            // cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(2)').should('have.attr', 'aria-valuenow', 37)
            cy.contains('app-account-create-manager button', 'Save').click()
            cy.wait('@create').its('response.statusCode').should('eq', 200)
    });

    it('Verify data of the account', () => {
        cy.popup('Success', 'Account created successfully.', 'Ok')
        cy.verifyField('app-account-status', 'Account Status', 'Open')
        cy.get('app-account-basic-info').contains(' Non Revenue').should('be.visible')
        //cy.contains('div', 'Current Balance').next('div').should('contain.text', '$2.00')
        cy.contains('li', 'Replenishment').should('not.exist')
        cy.contains('li', 'Financials').should('not.exist')

        cy.tab('Vehicles')
        cy.verifyGridData('app-account-vehicles', 'Plate Type', 0, 'Passenger')
        cy.verifyGridData('app-account-vehicles', 'State', 0, 'RI')
        cy.verifyGridData('app-account-vehicles', 'IAG Code', 0, '72')

        cy.tab('Transponders')
        cy.itemsPerPage('app-account-transponder kendo-grid:eq(0)','100','/Account/TranspondersList')
        cy.verifyGridData('app-account-transponder', 'Request Mode', 0, 'CALL')
        cy.verifyGridData('app-account-transponder', 'Status', 0, 'To Be Assigned')
        cy.verifyGridData('app-account-transponder', 'IAG Code', 0, '72')
        //cy.verifyGridData('app-account-transponder', 'Device Color', 0, 'Black')
        cy.get('app-account-transponder kendo-grid:eq(0) [data-kendo-grid-column-index="10"]').should('contain.text', 'Black')
        .and('contain.text','Blue')
        
        cy.tab('Information')    
        cy.contains('app-account-plan-information', 'Billing Type').should('not.be.visible')
            cy.contains('app-account-plan-information', 'Payment Method').should('not.be.visible')
            cy.contains('app-account-plan-information h5', 'Balance').should('not.be.visible')
            cy.contains('app-account-plan-information h5', 'Automatic Replenishment').should('not.be.visible')
            cy.contains('app-account-plan-information h5', 'Thresholds').should('not.be.visible')

            cy.contains('button', 'Tools').click()
            cy.get('kendo-popup').should('not.contain.text', 'One-Time Payment')
            .and('not.contain.text', 'One-Time Refund')
            .and('not.contain.text', 'Account Fee')
            .and('not.contain.text', 'Adjustment')
            .and('not.contain.text', 'Convert to Commercial')
});

    it('Close the account', () => {
        cy.get('[title="Close"]').click()
});

})