/// <reference types="cypress" />

describe('First test', function () {

    beforeEach('Access the link', ()=>{
        cy.visit("https://www.888casino.com");
    }) 
    it('Login', () => {


       //cy.login('RTGAutoGIB', 'Auto1234!') ended up blocked
        cy.login('nanamalta', '12345678Qa')
        
        let firstRound = cy.get('.cy-gaming-history-game-name').first().invoke('text')

        cy.launchJokerJewels()
        cy.wait(10000)


        for (let i = 0; i < 12; i++) {
            cy.getIframe('.cgp-game-iframe').click(702, 529)
        }
        cy.getIframe('.cgp-game-iframe')//.click(774, 526)
        cy.wait(5000)
        //.click(700, 548)
        //.click(774, 526)
        cy.get('.cy-game-navbar-close-button').should('be.visible').click()
        cy.url().should('eq', 'https://www.888casino.com/')

        cy.get('.cy-welcome-buttons-container').click()
        cy.contains('Gaming History').click()
        let newRound = cy.get('.cy-gaming-history-game-name').first().invoke('text')
        //let firstRound = cy.get('@firstGameRound')
        
            if (newRound === firstRound) {
                cy.reload()
            }else{
                cy.get('.cy-gaming-history-game-name').first().should('have.text', 'Joker Jewels')
            } 

    })
})

