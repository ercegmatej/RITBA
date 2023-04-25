const port = 2323;

Cypress.Commands.add('login' , (username, password, mode) => {
    cy.intercept('POST', 'https://ri2-crm.emovis.hr:2323/token').as('token')
    cy.intercept('GET', 'https://ri2-crm.emovis.hr:2323/Agent/SignedInCsr').as('csr')

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

Cypress.Commands.add('sort', (parent, filter, url) => {
    cy.intercept('POST', 'https://ri2-crm.emovis.hr:' + port + url).as('sort')
    
    cy.get(parent).within(() => {
        cy.get('th').not(filter).each(($th) => {
            const col = $th.attr('aria-colindex')
            const { _ } = Cypress
            const toStrings = (strings) => _.map(strings, 'textContent')
            let actualArray = [];

            cy.get($th).click()
            cy.wait('@sort').its('response.statusCode').should('eq', 200)
            cy.get($th).should('have.attr', 'aria-sort', 'ascending')
            cy.get(`kendo-grid-list [aria-colindex="${col}"]`).then(toStrings).then((strings) => {
                actualArray = strings
            })
            cy.get(`kendo-grid-list [aria-colindex="${col}"]`).then(toStrings).then((strings) => {
                const ascending = strings.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
                expect(actualArray).to.deep.equal(ascending)
            })

            cy.get($th).click()
            cy.wait('@sort').its('response.statusCode').should('eq', 200)
            cy.get($th).should('have.attr', 'aria-sort', 'descending')
            cy.get(`kendo-grid-list [aria-colindex="${col}"]`).then(toStrings).then((strings) => {
                actualArray = strings
            })
            cy.get(`kendo-grid-list [aria-colindex="${col}"]`).then(toStrings).then((strings) => {
                const ascending = strings.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
                const descending = _.reverse(ascending)
                expect(actualArray).to.deep.equal(descending)
            })

            cy.get($th).click()
            cy.wait('@sort').its('response.statusCode').should('eq', 200)
            cy.get($th).find('kendo-icon').should('not.exist')
        })
    })
})

Cypress.Commands.add('dropdownItems' , (parent, labels) => {
    cy.get(`${parent} kendo-dropdownlist`).click()
    cy.get('kendo-popup li').each(($li, i) => {
        cy.get($li).should('contain.text', labels[i])
    })
    cy.get(`${parent} kendo-dropdownlist`).click()
})

Cypress.Commands.add('dropdown' , (parent, listItem) => {
    cy.get(`${parent} kendo-dropdownlist`).click()
    cy.contains('kendo-popup li', listItem).click()
})

Cypress.Commands.add('page', (table, url) => {
    cy.intercept('POST', 'https://ri2-crm.emovis.hr:' + port + url).as('page')

    cy.get(`${table} kendo-pager kendo-dropdownlist`).click()
    cy.get('kendo-popup').contains(/^5$/).click()
    cy.wait('@page').its('response.statusCode').should('eq', 200)
    cy.get(table).within(() => {
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
    cy.get(`${table} kendo-pager kendo-dropdownlist`).click()
    cy.get('kendo-popup').contains(/^10$/).click()
    cy.wait('@page').its('response.statusCode').should('eq', 200)
    cy.get(`${table} tbody tr`).should('have.length.below', 11)

    cy.get(`${table} kendo-pager kendo-dropdownlist`).click()
    cy.get('kendo-popup').contains(/^50$/).click()
    cy.wait('@page').its('response.statusCode').should('eq', 200)
    cy.get(`${table} tbody tr`).should('have.length.below', 51)

    cy.get(`${table} kendo-pager kendo-dropdownlist`).click()
    cy.get('kendo-popup').contains(/^100$/).click()
    cy.wait('@page').its('response.statusCode').should('eq', 200)
    cy.get(`${table} tbody tr`).should('have.length.below', 101)
})

Cypress.Commands.add('openAccount', (category, value) => {
    cy.intercept('GET', 'https://ri2-crm.emovis.hr:2323/Account/**').as('openAccount')

    cy.dropdown('app-account-search kendo-grid-toolbar', category)
    cy.get('app-account-search kendo-grid-toolbar input').clear().type(value)
    cy.get('app-account-search kendo-grid-toolbar [aria-label="Search"]').click()
    cy.contains('app-account-search tbody td', value).click()

    cy.wait('@openAccount').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('popup', (title, body, button) => {
    cy.get('kendo-dialog').last().within(() => {
        cy.contains('kendo-dialog-titlebar', title).should('be.visible')
        cy.contains('.app-dialog-message.ng-star-inserted', body).should('be.visible')
        cy.contains('kendo-dialog-actions button', button).click()
    })
})

Cypress.Commands.add('search', (selector, category, term, url) => {
    cy.intercept('POST', 'https://ri2-crm.emovis.hr:' + port + url).as('search')

    cy.get(`${selector} kendo-dropdownlist`).click()
    cy.contains('kendo-popup li', category).click()
    cy.get(`${selector} input`).type(term)
    cy.get(`${selector} [aria-label="Search"]`).click()
    
    cy.wait('@search').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('input', (selector, type, input) => {
    if (type == 'kendo-textbox') {
        cy.get(`${selector} ${type}`).find('input').clear().type(input)
    }
    else if (type == 'kendo-dropdownlist') {
        cy.get(`${selector} ${type}`).click()
        cy.contains('kendo-popup li', input).click()
    }
    // else {
    //     cy.contains(type, label).find('input').clear().type(input)
    // }
})

Cypress.Commands.add('sidenav', (item, content) => {
    cy.wait(500)
    cy.contains('app-tree-view-sidenav [kendotreeviewitem]', item).click()
    cy.contains('app-tree-view-sidenav [kendotreeviewitem]', item).within(() => {
        cy.contains('[kendotreeviewitemcontent]', content).click()
    })
})

Cypress.Commands.add('verifySearch', (app, category, column, url) => {
    cy.intercept('POST', 'https://ri2-crm.emovis.hr:' + port + url).as('search')

    cy.get(app).find('kendo-dropdownlist').first().click()
    cy.contains('kendo-popup li', category).click()
    cy.get(app).within(() => {
        cy.contains('kendo-grid th', column).then(($th) => {
            const td = $th.attr('aria-colindex')
            cy.log(td)
            cy.get(`[data-kendo-grid-column-index="${td-1}"]`).then(($td) => {
                const resultsLength = $td.length
                cy.log(resultsLength)
                cy.randomValue(0, resultsLength, 0).then(($rand) => {
                    cy.get($td.eq($rand)).then(($content) => {
                        const search = $content.text()
                        cy.log(search)
                        cy.get('kendo-textbox').type(search + '{enter}')
                        cy.wait('@search').its('response.statusCode').should('eq', 200)
                        cy.get(`[data-kendo-grid-column-index="${td-1}"]`).each(($val) => {
                            cy.get($val).should('contain.text', search)
                        })
                        cy.get('[aria-label="Clear"]').click()
                    })
                })
            })
        })
    })
})

Cypress.Commands.add('randomValue', (min, max, places) => {
    let value = (Math.random() * (max - min)) + min;
    return Number.parseFloat(value).toFixed(places);
})