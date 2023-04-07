Cypress.Commands.add('login' , (username, password) => {
    //TODO intercept requests
    cy.visit('/')
})

Cypress.Commands.add('headers' , (parent, labels) => {
    cy.get(parent).find('th').not(':first').each(($th, i) => {
        cy.get($th).should('contain.text', labels[i])
    })
})

Cypress.Commands.add('sort', (parent, filter) => {
    //cy.intercept('GET', '/api/**').as('sort')

    cy.get(parent).within(() => {
        cy.get('th').not(filter).not(':last').each(($th) => {
            const col = $th.attr('aria-colindex')
            const { _ } = Cypress
            const toStrings = (strings) => _.map(strings, 'textContent')

            cy.get($th).click()
            //cy.wait('@sort').its('response.statusCode').should('eq', 200)
            cy.get($th).should('have.attr', 'aria-sort', 'ascending')
            cy.get(`kendo-grid-list [aria-colindex="${col}"]`).then(toStrings).then((strings) => {
                const ascending = _.sortBy(strings)
                expect(strings).to.deep.equal(ascending)
            })

            cy.get($th).click()
            //cy.wait('@sort').its('response.statusCode').should('eq', 200)
            cy.get($th).should('have.attr', 'aria-sort', 'descending')
            cy.get(`kendo-grid-list [aria-colindex="${col}"]`).then(toStrings).then((strings) => {
                const ascending = _.sortBy(strings)
                const descending = _.reverse(ascending)
                expect(strings).to.deep.equal(descending)
            })

            cy.get($th).click()
            //cy.wait('@sort').its('response.statusCode').should('eq', 200)
            cy.get(`kendo-grid-list [aria-colindex="${col}"]`).then(toStrings).then((strings) => {
                expect(strings).to.eq(strings)
            })
        })
    })
})

Cypress.Commands.add('dropdown' , (parent, labels) => {
    cy.get(`${parent} kendo-dropdownlist`).click()
    cy.get('kendo-popup li').each(($li, i) => {
        cy.get($li).should('contain.text', labels[i])
    })
})