// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login', (userName, password)=>{
    cy.get('[class="login_buttons_login cgp-themes-secondary-cta login_buttons_login_button_style"]').should('be.visible').click()
    cy.get('[id="rlLoginUsername"]').clear().should('be.empty').type(userName)
    cy.get('[id="rlLoginPassword"]').clear().should('be.empty').type(password)
    cy.get('[id="rlLoginSubmit"]').click({force:true})
})

Cypress.Commands.add('loginPC', (userName, password)=>{
    cy.get('[class="cy-profile-box-login-button"]').should('be.visible').click()
    cy.get('[id="rlLoginUsername"]').clear().should('be.empty').type(userName)
    cy.get('[id="rlLoginPassword"]').clear().should('be.empty').type(password)
    cy.get('[id="rlLoginSubmit"]').click({force:true})
})

Cypress.Commands.add('launchJokerJewels', ()=>{
    cy.get('[class="sc-fzqBkg fCkJVF open-mobile-menu-icon"]').click({force:true})
    cy.get('[class="sc-psrQp jnqKEH cy-game-search-box cy-menu-links-group"]')
    .find('[class="sc-plgA-D sc-qPzgd cPfcPA cy-game-search-input"]')
    .type('Joker Jewels')
    cy.contains('Joker Jewels').click()
    cy.url('https://www.888casino.com/#page/game/2380014/real/1').should('eq', 'https://www.888casino.com/#page/game/2380014/real/1')
})

Cypress.Commands.add('launchGameMirage', (gameName)=>{
    cy.get('[class="cy-navbar-container"]').find('[class="cy-burger-button"]').click({force:true})
    cy.get('[class="cy-menu-item"]')
    .type(gameName)
    cy.contains(gameName).click()
    //cy.url().should('eq', 'https://mirage-orbit-latest-eu.888casino.com/#page/game/2380014/real/1')
})

Cypress.Commands.add('launchGameMiragePC', (gameName)=>{
    cy.get('.cy-game-search-box').click()
    cy.get('.cy-game-search-input')
    .type(gameName)
    cy.contains(gameName).click()
    //cy.url().should('eq', 'https://mirage-orbit-latest-eu.888casino.com/#page/game/2380014/real/1')
})

Cypress.Commands.add('getIframe', (iframe) => {
    return cy.get(iframe)
        .its('0.contentDocument.body')
        .should('be.visible')
        .then(cy.wrap);
})

Cypress.Commands.add('orbitBypass',()=>{
    cy.get('.cy-modal-dialog-consumer-content').within(()=>{
        cy.get('[placeholder="Environment password"]').type('orbit1234')
        cy.get('[type="submit"]').click()
    })
})
