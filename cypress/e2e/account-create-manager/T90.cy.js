Cypress._.times(3, (i) => {
    const startType = ['Individual', 'Commercial', 'Non Revenue']
    Cypress._.times(3, (j) => {
        const changeType = ['Individual', 'Commercial', 'Non Revenue']
        if (startType[i] !== changeType[j]) {
            describe('T90 - Create new E-Z pass acc. - maximum number of transponders - ' + startType[i] + ' to ' + changeType[j], () => {
                it('Login', () => {
                    cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
                });
            
                it('Open create new account', () => {
                    cy.sidenav('Account Establishment', 'New E-ZPass Account')
                });
            
                it('Fill out required fields', () => {
                    cy.mandatoryFields()
                });
            
                it('Account Plan', () => {
                    cy.accountPlan(startType[i], 'Cash', 'Email', 'Email')
                });
            
                it('Add new vehicle', () => {
                    cy.addVehicle()
                });
            
                it('Add transponders (errors)', () => {
                    cy.contains('li', 'Transponders').click()
                    cy.get('app-account-transponder [title="Add"]').click()
                    cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', ':first')
                    cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '0')
                    cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Quantities should not be less than 1')
                    
                    if (startType[i] == 'Individual') {
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '5')
                        cy.wait(1000)
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Max 4 valid transponders allowed for Individual Account')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '1')
                    }
                    else {
                        cy
                    }
                    
                    cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
                    cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
                    cy.field('app-transponder-edit', 'Option Out', 'check')
                    cy.contains('kendo-dialog-actions button', 'Save').click()
                    cy.popup('Success', 'Transponder saved successfully', 'Ok')
            
                    cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Status', 0, 'INACTIVE')
                    cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'IAG ID', 0, '72')
                    cy.verifyGridData('app-account-transponder kendo-grid:eq(1)', 'Device Color', 0, 'Ivory')
                });
            
                it('Information tab', () => {
                    cy.contains('li', 'Information').click()
                    cy.contains('app-account-plan-information kendo-formfield', 'Account Type').find('kendo-dropdownlist').should('have.attr', 'readonly')
                });
            
                it('Delete transponders and go to information tab', () => {
                    cy.contains('li', 'Transponders').click()
                    cy.get('app-account-transponder kendo-grid:eq(1) kendo-grid-list tr:first').click()
                    cy.get('app-account-transponder kendo-grid:eq(1) [title="Delete"]').click()
                    
                    cy.contains('li', 'Information').click()
                    cy.contains('app-account-plan-information kendo-formfield', 'Account Type').find('kendo-dropdownlist').should('not.have.attr', 'readonly')
                });

                it('Change account type to ' + changeType[j], () => {
                    cy.field('app-account-information', 'Account Type', changeType[j])
                    if (changeType[j] !== 'Individual') {
                        cy.field('app-account-information', 'Company Name', changeType[j])
                    }
                    cy.pause()
                });
            })
        }
    })
})