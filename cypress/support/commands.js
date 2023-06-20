Cypress.Commands.add('login' , (username, password, mode) => {
    cy.intercept('POST', Cypress.env('ip') + '/token').as('token')
    cy.intercept('GET', Cypress.env('ip') + '/Agent/SignedInCsr').as('csr')

    cy.visit('/')
    cy.input('app-input kendo-formfield:first', 'kendo-textbox', username)
    cy.input('app-input kendo-formfield:last', 'kendo-textbox', password)
    cy.contains('button', 'Sign In').click()

    cy.wait('@token').its('response.statusCode').should('eq', 200)
    cy.wait('@csr').its('response.statusCode').should('eq', 200)

    cy.get('app-root').then(($root) => {
        if($root.find('app-application-mode').length > 0) {
            cy.contains('app-application-mode kendo-label', mode).next('input').check()
            cy.contains('button', 'Ok').click()
        }
    })
})

Cypress.Commands.add('headers' , (parent, filter, labels) => {
    cy.get(parent).find('th').not(filter).each(($th, i) => {
        cy.get($th).should('contain.text', labels[i])
    })
})

Cypress.Commands.add('dropdownItems' , (parent, labels) => {
    cy.get(`${parent} kendo-dropdownlist`).click()
    cy.get('kendo-popup li').each(($li, i) => {
        cy.get($li).should('contain.text', labels[i])
    })
    cy.get(`${parent} kendo-dropdownlist`).click()
})

Cypress.Commands.add('functionItems' , (parent, labels) => {
    cy.get(`${parent} kendo-dropdownbutton:first`).click()
    cy.get('kendo-popup li').each(($li, i) => {
        cy.get($li).should('contain.text', labels[i])
    })
    cy.get(`${parent} kendo-dropdownbutton:first`).click()
})

Cypress.Commands.add('search', (selector, category, term, url) => {
    cy.intercept('POST', Cypress.env('ip') + url).as('search')

    cy.dropdown(selector, category)
    cy.get(`${selector} input`).clear().type(term)
    cy.get(`${selector} [aria-label="Search"]`).click()
    
    cy.wait('@search').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('sortGrid', (parent, filter, url) => {
    cy.intercept('POST', Cypress.env('ip') + url).as('sort')
    
    cy.get(parent).within(() => {
        cy.get('kendo-grid-list tr').then(($tr) => {
            if (!$tr.text().includes('No records available.')) {
                cy.get('th').not(filter).each(($th) => {
                    if (url == '') {
                        cy.get($th).click()
                        cy.get($th).should('have.attr', 'aria-sort', 'ascending')
            
                        cy.get($th).click()
                        cy.get($th).should('have.attr', 'aria-sort', 'descending')
                    }
                    else {
                        cy.get($th).click()
                        cy.wait('@sort').its('response.statusCode').should('eq', 200)
                        cy.get($th).should('have.attr', 'aria-sort', 'ascending')
            
                        cy.get($th).click()
                        cy.wait('@sort').its('response.statusCode').should('eq', 200)
                        cy.get($th).should('have.attr', 'aria-sort', 'descending')

                        cy.get($th).click()
                        cy.wait('@sort').its('response.statusCode').should('eq', 200)
                        cy.get($th).find('kendo-icon').should('not.exist')
                    }                   
                })
            }
        })
    })
})

Cypress.Commands.add('dropdown' , (parent, listItem) => {
    cy.get(`${parent} kendo-dropdownlist`).click()
    cy.contains('kendo-popup li', listItem).click()
})

Cypress.Commands.add('page', (selector, url) => {
    cy.intercept('POST', Cypress.env('ip') + url).as('page')

    cy.get(`${selector} kendo-grid-list tr`).then(($tr) => {
        if (!$tr.text().includes('No records available.')) {
            cy.get(`${selector} kendo-pager kendo-dropdownlist`).click()
            cy.get('kendo-popup').contains(/^5$/).click()
            cy.wait('@page').its('response.statusCode').should('eq', 200)
            cy.get(selector).within(() => {
                cy.get('tbody').find('tr').should('have.length.below', 6)
                cy.get('kendo-pager').then(($pg) => {
                    if($pg.find('[aria-label="Page 2"]').length > 0) {
                        cy.get('[title="Go to the next page"]').click()
                        cy.wait('@page').its('response.statusCode').should('eq', 200)
                        if($pg.find('[aria-label="Page 3"]').length > 0) {
                            cy.get('[title="Go to the last page"]').click()
                            cy.wait('@page').its('response.statusCode').should('eq', 200)
                            cy.get('[title="Go to the first page"]').click()
                        }
                    }
                    else {
                    }
                })
            })
            cy.get(`${selector} kendo-pager kendo-dropdownlist`).click()
            cy.get('kendo-popup').contains(/^10$/).click()
            cy.wait('@page').its('response.statusCode').should('eq', 200)
            cy.get(`${selector} tbody tr`).should('have.length.below', 11)
        
            cy.get(`${selector} kendo-pager kendo-dropdownlist`).click()
            cy.get('kendo-popup').contains(/^50$/).click()
            cy.wait('@page').its('response.statusCode').should('eq', 200)
            cy.get(`${selector} tbody tr`).should('have.length.below', 51)
        
            cy.get(`${selector} kendo-pager kendo-dropdownlist`).click()
            cy.get('kendo-popup').contains(/^100$/).click()
            cy.wait('@page').its('response.statusCode').should('eq', 200)
            cy.get(`${selector} tbody tr`).should('have.length.below', 101)
        }
    })
})

Cypress.Commands.add('itemsPerPage', (selector, items, url) => {
    cy.intercept('POST', Cypress.env('ip') + url).as('page')

    cy.get(`${selector} kendo-pager-page-sizes kendo-dropdownlist`).click()
    cy.contains('kendo-popup li', items).click()
    cy.wait('@page').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('openAccount', (category, value) => {
    cy.intercept('GET', Cypress.env('ip') + '/Account/**').as('openAccount')

    cy.dropdown('app-account-search kendo-grid-toolbar', category)
    cy.get('app-account-search kendo-grid-toolbar input').clear().type(value)
    cy.get('app-account-search kendo-grid-toolbar [aria-label="Search"]').click()
    cy.wait('@openAccount').its('response.statusCode').should('eq', 200)
    cy.wait(2000)

    cy.contains('kendo-dialog-actions button', 'Ok').click() //! DELETE AFTER FIX
})

Cypress.Commands.add('tab', (name) => {
    cy.contains('app-account-manager ul li', name).click()
    cy.wait(1000)
})

Cypress.Commands.add('popup', (title, body, button) => {
    cy.get('kendo-dialog').last().within(($dialog) => {
        if ($dialog.find('kendo-dialog-titlebar').length > 0) {
            cy.contains('kendo-dialog-titlebar', title).should('be.visible')
        }
        cy.contains('.app-dialog-message.ng-star-inserted', body).should('be.visible')
        cy.contains('kendo-dialog-actions button', button).click()
    })
})

Cypress.Commands.add('input', (selector, type, input) => {
    if (type == 'kendo-textbox') {
        cy.get(`${selector} ${type}`).find('input').clear().type(input)
    }
    else if (type == 'kendo-dropdownlist') {
        cy.get(`${selector} ${type}`).click()
        cy.contains('kendo-popup li', input).click()
    }
})

Cypress.Commands.add('sidenav', (item, content) => {
    cy.wait(500)
    cy.contains('app-tree-view-sidenav [kendotreeviewitem]', item).click()
    cy.contains('app-tree-view-sidenav [kendotreeviewitem]', item).within(() => {
        cy.contains('[kendotreeviewitemcontent]', content).click()
    })
})

Cypress.Commands.add('verifySearch', (app, category, column, url) => {
    cy.intercept('POST', Cypress.env('ip') + url).as('search')

    cy.get(app).find('kendo-dropdownlist').first().click()
    cy.contains('kendo-popup li', category).click()
    cy.wait(500)
    cy.contains(`${app} kendo-grid th`, column).then(($th) => {
        const td = $th.attr('aria-colindex')
        cy.get('kendo-grid-list tr').then(($tr) => {
            if (!$tr.text().includes('No records available.' && !$tr.length == 1)) {
                cy.get(`${app} [data-kendo-grid-column-index="${td-1}"]`).then(($td) => {
                    const resultsLength = $td.length
                    cy.randomValue(0, resultsLength-1, 0).then(($rand) => {
                        cy.get($td.eq($rand)).then(($content) => {
                            const search = $content.text()
                            cy.get(app).then(($app) => {
                                if ($app.find('kendo-grid-toolbar kendo-dropdownlist').length > 1) {
                                    cy.get(`${app} kendo-grid-toolbar kendo-dropdownlist:eq(1)`).click()
                                    cy.log(search.slice(1,-1))
                                    cy.contains('kendo-popup li span', search.slice(1,-1)).click()
                                    cy.wait('@search').its('response.statusCode').should('eq', 200)
                                    cy.wait(500)
                                    cy.get(`${app} [data-kendo-grid-column-index="${td-1}"]`).each(($val) => {
                                        cy.get($val).should('contain.text', search.slice(1,-1))
                                    })
                                }
                                else {
                                    cy.get(`${app} kendo-textbox`).type(search + '{enter}')
                                    cy.wait('@search').its('response.statusCode').should('eq', 200)
                                    cy.wait(500)
                                    cy.get(`${app} [data-kendo-grid-column-index="${td-1}"]`).each(($val) => {
                                        const value = $val.text().toLocaleLowerCase()
                                        expect(value).to.eq(search.toLocaleLowerCase())
                                    })
                                    cy.get(`${app} [aria-label="Clear"]`).click()
                                }
                            })
                        })
                    })
                })
            }
        })
    })
    cy.get(`${app} kendo-dropdownlist`).first().click()
    cy.contains('kendo-popup li', 'All').click()
})

Cypress.Commands.add('verifyDateSearch', (app, column, search, url) => {
    cy.intercept('POST', Cypress.env('ip') + url).as('search')
    const dayjs = require('dayjs')
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat) 
    const today = dayjs()
    const todayFormat = dayjs().format('MM/DD/YYYY')

    cy.get(app).find('kendo-dropdownlist').first().click()
    cy.contains('kendo-popup li', search).click()
    cy.wait('@search').its('response.statusCode').should('eq', 200)
    cy.wait(1000)
    cy.get(app).then(($app) => {
        if($app.find('[aria-label="Search"]').length>0) {
            cy.get('[aria-label="Search"]').last().click({force:true})
        }
    })
    cy.get(app).within(() => {
        cy.contains('kendo-grid th', column).then(($th) => {
            const td = $th.attr('aria-colindex')
            cy.get('kendo-grid-list tr').then(($tr) => {
                if (!$tr.text().includes('No records available.')) {
                    cy.get(`[data-kendo-grid-column-index="${td-1}"]`).then(($td) => {
                        const resultsLength = $td.length
                        if (resultsLength > 0 ) {
                            cy.get($td).each(($time) => {
                                const date = dayjs($time.text().slice(1, -1), 'MM/DD/YYYY')
                                const dateFormat = date.format('MM/DD/YYYY')
                                switch (search) {
                                    case 'Current Date':
                                        expect(dateFormat).to.eq(todayFormat)
                                        break;
                                    case 'Today':
                                        expect(dateFormat).to.eq(todayFormat)
                                        break;
                                    case 'Last 7 Days':
                                        expect(date.isBefore(today.add(1, 'day')) && date.isAfter(today.subtract(8, 'day'))).to.be.true
                                        break;
                                    case 'Last 14 Days':
                                        expect(date.isBefore(today.add(1, 'day')) && date.isAfter(today.subtract(15, 'day'))).to.be.true
                                        break;
                                    case 'Last 30 Days':
                                        expect(date.isBefore(today.add(1, 'day')) && date.isAfter(today.subtract(31, 'day'))).to.be.true
                                    break;
                                    case '30 days':
                                        expect(date.isBefore(today.add(1, 'day')) && date.isAfter(today.subtract(31, 'day'))).to.be.true
                                    break;
                                    case '60 days':
                                        expect(date.isBefore(today.add(1, 'day')) && date.isAfter(today.subtract(61, 'day'))).to.be.true
                                    break;
                                    case '90 days':
                                        expect(date.isBefore(today.add(1, 'day')) && date.isAfter(today.subtract(91, 'day'))).to.be.true
                                    break;
                                }
                            })
                        }
                    })
                }
            })
        })
    })
    cy.wait(500)
})

Cypress.Commands.add('verifyMoney', (app, category, column, url) => {
    cy.intercept('POST', Cypress.env('ip') + url).as('search')

    cy.get(app).find('kendo-dropdownlist').first().click()
    cy.contains('kendo-popup li', category).click()
    cy.get(app).within(($app) => {
        cy.contains('kendo-grid th', column).then(($th) => {
            const td = $th.attr('aria-colindex')
            cy.get(`[data-kendo-grid-column-index="${td-1}"]`).then(($td) => {
                const resultsLength = $td.length
                cy.randomValue(0, resultsLength-1, 0).then(($rand) => {
                    cy.get($td.eq($rand)).then(($content) => {
                        const number = $content.text()
                        const amount = number.slice(2, -1)
                        const search = parseFloat(amount.replaceAll(',', '')).toFixed(2)
                        if ($app.find('kendo-grid-toolbar kendo-dropdownlist').length > 1) {
                            cy.get('kendo-grid-toolbar kendo-dropdownlist:eq(1)').click()
                            cy.contains('kendo-popup li', search).click()
                            cy.wait('@search').its('response.statusCode').should('eq', 200)
                            cy.get(`[data-kendo-grid-column-index="${td-1}"]`).each(($val) => {
                                cy.get($val).should('contain.text', number)
                            })
                        }
                        else {
                            cy.get('kendo-textbox').type(search + '{enter}')
                            cy.wait('@search').its('response.statusCode').should('eq', 200)
                            cy.wait(500)
                            cy.get(`[data-kendo-grid-column-index="${td-1}"]`).each(($val) => {
                                cy.get($val).should('contain.text', number)
                            })
                        }
                    })
                })
            })
        })
        cy.get('[aria-label="Clear"]').click()
        cy.get('kendo-dropdownlist').first().click()
    })
    cy.contains('kendo-popup li', 'All').click()
})

Cypress.Commands.add('randomValue', (min, max, places) => {
    let value = (Math.random() * (max - min)) + min;
    return Number.parseFloat(value).toFixed(places);
})

Cypress.Commands.add('randomText', () => {
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyz';

    for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
})

Cypress.Commands.add('field', (selector, label, text) => {
    cy.contains(`${selector} kendo-formfield`, label).then(($field) => {
        if ($field.find('kendo-dropdownlist').length > 0) {
            if (text == ':first') {
                cy.get($field).find('kendo-dropdownlist').click()
                cy.get('kendo-popup li:first').click()
            }
            else {
                cy.get($field).find('kendo-dropdownlist').click()
                cy.contains('kendo-popup li', text).click()
            }
        }
        else if ($field.find('kendo-textarea').length > 0) {
            cy.get($field).find('textarea').clear().type(text)
        }
        else if ($field.find('kendo-numerictextbox').length > 0) {
            cy.get($field).find('input').clear().type(text)
        }
        else if ($field.find('kendo-textbox').length > 0) {
            if (text == '') {
                cy.get($field).find('input').clear()
            }
            else {
                cy.get($field).find('input').clear().type(text)
            }
        }
        else if ($field.find('[type="radio"]').length > 0) {
            cy.get($field).find('[type="radio"]').check()
        }
        else if ($field.find('[type="checkbox"]').length > 0) {
            cy.get($field).find('[type="checkbox"]').check()
        }
    })
})

Cypress.Commands.add('verifyField', (selector, label, text) => {
    cy.contains(`${selector} kendo-formfield`, label).then(($field) => {
        if ($field.find('kendo-dropdownlist').length > 0) {
            cy.get($field).find('kendo-dropdownlist').should('contain.text', text)
        }
        else if ($field.find('kendo-textarea').length > 0) {
            cy.get($field).find('kendo-textarea').should('contain.text', text)
        }
        else if ($field.find('kendo-textbox').length > 0) {
            cy.get($field).find('kendo-textbox').should('contain.text', text)
        }
        else if ($field.find('[type="radio"]').length > 0) {
            cy.get($field).find('[type="radio"]').should('be.checked')
        }
        else if ($field.find('[type="checkbox"]').length > 0) {
            cy.get($field).find('[type="checkbox"]').should('be.checked')
        }
    })
})

Cypress.Commands.add('requiredError', (selector, label) => {
    cy.contains(`${selector} kendo-formfield`, label).find('div').children(':first').should('have.class', 'ng-invalid')
    cy.contains(`${selector} kendo-formfield`, label).find('kendo-formerror').should('contain.text', `${label} is required`)
})

Cypress.Commands.add('formError', (selector, label, error) => {
    if(error == '') {
        cy.contains(`${selector} kendo-formfield`, label).find('div').children(':first').should('not.have.class', 'ng-invalid')
    }
    else {
        cy.contains(`${selector} kendo-formfield`, label).find('div').children(':first').should('have.class', 'ng-invalid')
        cy.contains(`${selector} kendo-formfield`, label).find('kendo-formerror').should('contain.text', error)
    }
})

Cypress.Commands.add('calendar', (element, year, month, day) => { //cmd for Toggle Calendar button; format ('YYYY', 'Mon', 'DD'); e.g. ('2022', 'Aug', '29')
    cy.get(`[title="Toggle calendar"]:eq(${element})`).click()
    cy.wait(500)
    cy.get('kendo-calendar').within(() => {
        cy.get('.k-button.k-button-md.k-rounded-md.k-button-flat.k-button-flat-base.k-calendar-title').click({force:true})
        cy.wait(500)
        cy.contains('kendo-calendar-navigation li', year).click({force:true})
        cy.wait(500)
        cy.contains('tr', year).parents('tbody').within(() => {
            cy.contains('td', month).click({force:true})
            cy.wait(500)
        })
        cy.get('kendo-calendar-viewlist').find('td').contains(day).first().click({force:true})
        cy.wait(500)
    })
})

Cypress.Commands.add('verifyGridData', (selector, column, row, text) => {
    const dayjs = require('dayjs')
    const today = dayjs().format('MM/DD/YYYY')
    cy.contains(selector + ' th', column).then(($th) => {
        const td = $th.attr('aria-colindex')
        // cy.get(selector + ' kendo-grid:first thead').then(($thead) => {
        //     if($thead.text().includes('Date')) {
        //         cy.get(selector + ` kendo-grid-list:first tr:eq(${row})`).should('contain.text', today)
        //     }
        // })
        cy.get(selector + ` kendo-grid-list:first tr:eq(${row}) [data-kendo-grid-column-index="${td-1}"]`).then(($td) => {
            const gridText = $td.text()
            expect(gridText).to.include(text)
        })
    })
})