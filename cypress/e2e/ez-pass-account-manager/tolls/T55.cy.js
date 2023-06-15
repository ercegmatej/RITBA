Cypress._.times(3, (i) => {
    const accNumber = [ Cypress.env('individual'), Cypress.env('commercial'), Cypress.env('non-revenue') ];
    const accType = [ 'Individual', 'Commercial', 'Non-revenue' ];
    describe('T53 - EZ Pass - Tolls - Advanced Search' + ' - ' + accType[i], () => {
        it('Login', () => {
            cy.login(Cypress.env('username'), Cypress.env('password'), 'Call Center')
        });

        it('Open the account', () => {
            cy.openAccount('Account Number', accNumber[i])
        });

        it('Open the Transponders tab', () => {
            cy.tab('Tolls')
        });

        it('Open the Advanced Search prompt', () => {
            cy.contains('button', 'Advanced Search').click()
            cy.wait(500)
            cy.contains('kendo-dialog-titlebar', 'Advanced Search')
            cy.get('app-advance-search app-radio').should('contain.text', 'Agency')
            .and('contain.text', 'Transponder No.')
            .and('contain.text', 'Plate No.')
            .and('contain.text', 'Date')

            cy.contains('app-advance-search app-radio', 'Plate No.').find('input').should('be.checked')
            cy.contains('app-advance-search app-select-one kendo-formfield', 'Agency').find('kendo-dropdownlist').should('have.attr', 'readonly')
            cy.contains('app-advance-search app-input kendo-formfield', 'Transponder No.').find('input').should('have.attr', 'readonly')
            cy.contains('app-advance-search app-date-picker kendo-formfield', 'Date Start').find('input').should('have.attr', 'readonly')
            cy.contains('app-advance-search app-date-picker kendo-formfield', 'Date End').find('input').should('have.attr', 'readonly')

            cy.contains('kendo-dialog-actions button', 'Cancel').click()
        });

        it('Plate No. search', () => {
            cy.intercept('POST', Cypress.env('ip') + '/Tolls/AccountPassagesList').as('search')
            cy.contains('app-account-tolls th', 'Lic. Plate').click().click()
            cy.wait(1000)
            cy.get(`app-account-tolls kendo-grid-list tr:eq(0) [data-kendo-grid-column-index="3"]`).then(($td) => {
                const search = $td.text()
                if (!(search == '')) {
                    cy.log(search)
                    cy.contains('button', 'Advanced Search').click()
                    cy.contains('app-advance-search app-radio', 'Plate No.').find('input').check()
                    cy.contains('app-advance-search app-input kendo-formfield', 'Plate No.').find('input').type(search)
                    cy.contains('kendo-dialog-actions button', 'Begin Search').click()
                    cy.wait('@search').its('response.statusCode').should('eq', 200)
                    cy.wait(1000)
                    cy.get(`app-account-tolls [data-kendo-grid-column-index="3"]`).each(($val) => {
                        const value = $val.text()
                        expect(value).to.eq(search)
                    })
                }
            })
            cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').check()
            cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').uncheck()
        });

        it('Transponder No. search', () => {
            cy.intercept('POST', Cypress.env('ip') + '/Tolls/AccountPassagesList').as('search')
            cy.contains('app-account-tolls th', 'Transponder').click().click()
            cy.wait(1000)
            cy.get(`app-account-tolls kendo-grid-list tr:eq(0) [data-kendo-grid-column-index="2"]`).then(($td) => {
                const search = $td.text()
                if (!(search == '')) {
                    cy.log(search)
                    cy.contains('button', 'Advanced Search').click()
                    cy.contains('app-advance-search app-radio', 'Transponder No.').find('input').check()
                    cy.contains('app-advance-search app-input kendo-formfield', 'Transponder No.').find('input').type(search)
                    cy.contains('kendo-dialog-actions button', 'Begin Search').click()
                    cy.wait('@search').its('response.statusCode').should('eq', 200)
                    cy.wait(1000)
                    cy.get(`app-account-tolls [data-kendo-grid-column-index="2"]`).each(($val) => {
                        const value = $val.text()
                        expect(value).to.eq(search)
                    })
                }
            })
            cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').check()
            cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').uncheck()
        });

        it('Date search', () => {
            const dayjs = require('dayjs')
            const today = dayjs().add(1, 'day')
            var customParseFormat = require('dayjs/plugin/customParseFormat')
            dayjs.extend(customParseFormat) 

            cy.intercept('POST', Cypress.env('ip') + '/Tolls/AccountPassagesList').as('search')
            cy.contains('app-account-tolls th', 'Post Date').click().click()
            cy.wait(1000)
            cy.get(`app-account-tolls kendo-grid-list tr:eq(0) [data-kendo-grid-column-index="6"]`).then(($td) => {
                const searchSubtracted = dayjs($td.text()).subtract(1, 'day')
                const search = dayjs($td.text()).format('MMM/DD/YYYY')
                const mth = search.slice(0,-8)
                const day = search.slice(4,6)
                const yr = search.slice(7)
                cy.contains('button', 'Advanced Search').click()
                cy.contains('app-advance-search app-radio', 'Date').find('input').check()
                cy.calendar(0, yr, mth, day)
                cy.contains('kendo-dialog-actions button', 'Begin Search').click()
                cy.wait('@search').its('response.statusCode').should('eq', 200)
                cy.wait(1000)
                cy.get(`app-account-tolls [data-kendo-grid-column-index="6"]`).each(($val) => {
                    const value = dayjs($val.text())
                    expect(value.isBefore(today) && value.isAfter(searchSubtracted)).to.be.true
                })
            })
            cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').check()
            cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').uncheck()
        });
        
        // it('Agency search', () => {
        //     cy.intercept('POST', Cypress.env('ip') + '/Tolls/AccountPassagesList').as('search')
        //     cy.contains('app-account-tolls th', 'Agency').click().click()
        //     cy.wait(1000)
        //     cy.get(`app-account-tolls kendo-grid-list tr:eq(0) [data-kendo-grid-column-index="1"]`).then(($td) => {
        //         const search = $td.text()
        //         cy.contains('button', 'Advanced Search').click()
        //         cy.contains('app-advance-search app-radio', 'Agency').find('input').check()
        //         cy.contains('app-advance-search app-select-one kendo-formfield', 'Agency').find('kendo-dropdownlist').click()
        //         cy.contains('kendo-popup li', search).click()
        //         cy.contains('kendo-dialog-actions button', 'Begin Search').click()
        //         cy.wait('@search').its('response.statusCode').should('eq', 200)
        //         cy.wait(1000)
        //         cy.get(`app-account-tolls [data-kendo-grid-column-index="2"]`).each(($val) => {
        //             const value = $val.text()
        //             expect(value).to.eq(search)
        //         })
        //     })
        //     cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').check()
        //     cy.get('app-account-tolls kendo-grid-toolbar [type="checkbox"]').uncheck()
        // });//!API
    });
})