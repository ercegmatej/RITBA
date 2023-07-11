Cypress._.times(3, (j) => {
    const startType = ['Individual', 'Commercial', 'Non Revenue']

    Cypress._.times(3, (i) => {
        const changeType = ['Individual', 'Commercial', 'Non Revenue']

        if (startType[i] !== changeType[j]) {
            describe('T90 - Create new E-Z pass acc. - maximum number of transponders - ' + startType[j] + ' to ' + changeType[i], () => {
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
                    console.log(j)
                    console.log(startType[j])
                    cy.accountPlan(startType[j], 'Cash', 'Email', 'Email')
                    cy.field('app-account-information', 'Company Name', startType[j])
                });
            
                it('Add new vehicle', () => {
                    cy.addVehicle()
                });
            
                it('Add transponders for first acc type', () => {
                    if (startType[j] == 'Individual') {
                        cy.contains('li', 'Transponders').click()
                        cy.get('app-account-transponder [title="Add"]').click()
                        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'Ivory')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '0')
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Quantities should not be less than 1')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '5')
                        cy.wait(1000)
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Max 4 valid transponders allowed for Individual Account')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '1')
                        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
                        cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
                        cy.field('app-transponder-edit', 'Option Out', 'check')
                        cy.contains('kendo-dialog-actions button', 'Save').click()
                        cy.popup('Success', 'Transponder saved successfully', 'Ok')
                
                        cy.get('app-account-transponder kendo-grid:eq(1) [data-kendo-grid-column-index="7"]').should('contain.text', 'Ivory')
                        cy.get('app-account-transponder kendo-grid:eq(1) > div').should('have.attr', 'aria-rowcount', 2)
                    }
                    else {
                        cy.contains('li', 'Transponders').click()
                        cy.get('app-account-transponder [title="Add"]').click()
                        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'Interior Tag Blue')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '0')
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Quantities should not be less than 1')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '5')
                        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
                        cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
                        cy.field('app-transponder-edit', 'Option Out', 'check')
                        cy.contains('kendo-dialog-actions button', 'Save').click()
                        cy.popup('Success', 'Transponder saved successfully', 'Ok')
                        cy.get('app-account-transponder kendo-grid:eq(1) [data-kendo-grid-column-index="7"]').should('contain.text', 'Blue')
                        cy.get('app-account-transponder kendo-grid:eq(1) > div').should('have.attr', 'aria-rowcount', 6)

                        cy.contains('li', 'Transponders').click()
                        cy.get('app-account-transponder [title="Add"]').click()
                        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'LicPlate Tag Black')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '0')
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Quantities should not be less than 1')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '5')
                        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
                        cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
                        cy.field('app-transponder-edit', 'Option Out', 'check')
                        cy.contains('kendo-dialog-actions button', 'Save').click()
                        cy.popup('Success', 'Transponder saved successfully', 'Ok')
                        cy.get('app-account-transponder kendo-grid:eq(1) [data-kendo-grid-column-index="7"]').should('contain.text', 'Black')
                        cy.get('app-account-transponder kendo-grid:eq(1) > div').should('have.attr', 'aria-rowcount', 11)

                        cy.contains('li', 'Transponders').click()
                        cy.get('app-account-transponder [title="Add"]').click()
                        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'Exterior Roof Tag Black')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '0')
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Quantities should not be less than 1')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '5')
                        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
                        cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
                        cy.field('app-transponder-edit', 'Option Out', 'check')
                        cy.contains('kendo-dialog-actions button', 'Save').click()
                        cy.popup('Success', 'Transponder saved successfully', 'Ok')
                        cy.get('app-account-transponder kendo-grid:eq(1) [data-kendo-grid-column-index="7"]').should('contain.text', 'Black')
                        cy.get('app-account-transponder kendo-grid:eq(1) > div').should('have.attr', 'aria-rowcount', 16)
                    }
                });
            
                it('Information tab', () => {
                    cy.contains('li', 'Information').click()
                    cy.contains('app-account-plan-information kendo-formfield', 'Account Type').find('kendo-dropdownlist').should('have.attr', 'readonly')
                });
            
                it('Delete transponders and go to information tab', () => {
                    cy.contains('li', 'Transponders').click()
                    cy.get('app-account-transponder kendo-grid:eq(1) > div').then(($grid) => {
                        const len1 = $grid.attr('aria-rowcount');
                        const len = len1-1;
                        for (let x=0; x<len; x++) {
                            cy.get('app-account-transponder kendo-grid:eq(1) kendo-grid-list tr:first').click()
                            cy.get('app-account-transponder kendo-grid:eq(1) [title="Delete"]').click()
                            cy.wait(500)
                        }
                    })
                    cy.contains('li', 'Information').click()
                    cy.contains('app-account-plan-information kendo-formfield', 'Account Type').find('kendo-dropdownlist').should('not.have.attr', 'readonly')
                });

                it('Change account type to ' + changeType[i], () => {
                    console.log(changeType[i])
                    console.log(i)
                    cy.field('app-account-information', 'Account Type', changeType[i])
                    if (changeType[i] !== 'Individual') {
                        cy.field('app-account-information', 'Company Name', changeType[i])
                    }
                });
                
                Cypress._.times(2, () => {
                    it('Go to vehicles tab and add multiple', () => {
                        cy.addVehicle()
                    });
                })

                it('Add transponders for second acc type', () => {
                    if (changeType[i] == 'Individual') {
                        cy.contains('li', 'Transponders').click()
                        cy.get('app-account-transponder [title="Add"]').click()
                        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'Ivory')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '0')
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Quantities should not be less than 1')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '5')
                        cy.wait(1000)
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Max 4 valid transponders allowed for Individual Account')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '1')
                        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
                        cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
                        cy.field('app-transponder-edit', 'Option Out', 'check')
                        cy.contains('kendo-dialog-actions button', 'Save').click()
                        cy.popup('Success', 'Transponder saved successfully', 'Ok')
                
                        cy.get('app-account-transponder kendo-grid:eq(1) [data-kendo-grid-column-index="7"]').should('contain.text', 'Ivory')
                        cy.get('app-account-transponder kendo-grid:eq(1) > div').should('have.attr', 'aria-rowcount', 2)
                    }
                    else {
                        cy.contains('li', 'Transponders').click()
                        cy.get('app-account-transponder [title="Add"]').click()
                        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'Interior Tag Blue')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '0')
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Quantities should not be less than 1')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '5')
                        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
                        cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
                        cy.field('app-transponder-edit', 'Option Out', 'check')
                        cy.contains('kendo-dialog-actions button', 'Save').click()
                        cy.popup('Success', 'Transponder saved successfully', 'Ok')
                        cy.get('app-account-transponder kendo-grid:eq(1) [data-kendo-grid-column-index="7"]').should('contain.text', 'Blue')
                        cy.get('app-account-transponder kendo-grid:eq(1) > div').should('have.attr', 'aria-rowcount', 6)

                        cy.contains('li', 'Transponders').click()
                        cy.get('app-account-transponder [title="Add"]').click()
                        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'LicPlate Tag Black')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '0')
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Quantities should not be less than 1')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '5')
                        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
                        cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
                        cy.field('app-transponder-edit', 'Option Out', 'check')
                        cy.contains('kendo-dialog-actions button', 'Save').click()
                        cy.popup('Success', 'Transponder saved successfully', 'Ok')
                        cy.get('app-account-transponder kendo-grid:eq(1) [data-kendo-grid-column-index="7"]').should('contain.text', 'Black')
                        cy.get('app-account-transponder kendo-grid:eq(1) > div').should('have.attr', 'aria-rowcount', 11)

                        cy.contains('li', 'Transponders').click()
                        cy.get('app-account-transponder [title="Add"]').click()
                        cy.field('app-transponder-edit app-select-one:visible:first', 'Tag', 'Exterior Roof Tag Black')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '0')
                        cy.formError('app-transponder-edit app-integer-input:visible', 'Quantities', 'Quantities should not be less than 1')
                        cy.field('app-transponder-edit app-integer-input:visible', 'Quantities', '5')
                        cy.field('app-transponder-edit app-select-one:visible', 'IAG Codes', '72')
                        cy.field('app-transponder-edit', 'Fetch Plan History', 'check')
                        cy.field('app-transponder-edit', 'Option Out', 'check')
                        cy.contains('kendo-dialog-actions button', 'Save').click()
                        cy.popup('Success', 'Transponder saved successfully', 'Ok')
                        cy.get('app-account-transponder kendo-grid:eq(1) [data-kendo-grid-column-index="7"]').should('contain.text', 'Black')
                        cy.get('app-account-transponder kendo-grid:eq(1) > div').should('have.attr', 'aria-rowcount', 16)
                    }
                });

                it('Information tab', () => {
                    cy.contains('li', 'Information').click()
                    cy.contains('app-account-plan-information kendo-formfield', 'Account Type').find('kendo-dropdownlist').should('have.attr', 'readonly')
                });

                it('Payments tab', () => {
                    cy.intercept('POST', '/Account/CreateAccount').as('create');
                    cy.contains('li', 'Payments').click()
                    // if (changeType[j] == 'Individual') {
                    //     cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 35)
                    // }
                    // else {
                    //     cy.contains('h5', 'Payment Summary').parent('div').find('input:eq(0)').should('have.attr', 'aria-valuenow', 525)
                    // }
                    cy.contains('button', 'Cash').should('have.attr', 'aria-pressed', 'true')
                    cy.contains('app-account-create-manager button', 'Save').click()
                    cy.wait('@create').its('response.statusCode').should('eq', 200)
                });
            
                it('Verify data of the account', () => {
                    cy.popup('Success', 'Account created successfully.', 'Ok')
                    cy.verifyField('app-account-status', 'Account Status', 'Open Pending')
            
                    cy.tab('Vehicles')
                    cy.get('app-account-vehicles kendo-grid > div').should('have.attr', 'aria-rowcount', 4)
            
                    cy.tab('Transponders')
                    if (changeType[j] == 'Individual') {
                        cy.verifyGridData('app-account-transponder', 'Request Mode', 0, 'CALL')
                        cy.verifyGridData('app-account-transponder', 'Status', 0, 'To Be Assigned')
                        cy.verifyGridData('app-account-transponder', 'IAG Code', 0, '72')
                        cy.verifyGridData('app-account-transponder', 'Device Color', 0, 'Ivory')
                    }
                    else {
                        cy.itemsPerPage('app-account-transponder kendo-grid:eq(0)', 100, '/Account/TranspondersList')
                        cy.get('app-account-transponder kendo-grid:eq(0) [data-kendo-grid-column-index="10"]').should('contain.text', 'Blue')
                        cy.get('app-account-transponder kendo-grid:eq(0) [data-kendo-grid-column-index="10"]').should('contain.text', 'Black')
                        cy.get('app-account-transponder kendo-grid:eq(0) > div').should('have.attr', 'aria-rowcount', 16)
                    }
                });
            })
        }
    })
})