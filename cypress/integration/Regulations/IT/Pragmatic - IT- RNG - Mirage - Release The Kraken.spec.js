/// <reference types="cypress" />

describe('Pragmatic - IT - RNG - Mirage - Release The Kraken', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":1,"brandID":31,"subBrandID":46},"Currency":{"anonymousCurrency":"EUR"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"ita","language":"ita","iso2":"it","publicationID":1870,"cmsSource":"https://www.888casino.it","addedGameTypesFromSdm":[2380001],"gameTypes":"2380001"}}');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).
        cy.orbitBypass()
        cy.loginPC('andreigit', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Cronologia di gioco').click()

        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)
            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')

            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Release the Kraken')

            //Italy solution
            cy.get('.cy-modal')
            cy.get('.cy-italy-game-limit-default-amount-option').within(() => {
                cy.get('input[type="radio"]').should('be.checked')
            })
            cy.get('#otherLimitContainer').should('be.visible')
            cy.get('.cgp-msg-button').click()

            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })

            cy.wait(40000)

            //Italy stripe check
            cy.get('.cy-italy-regulation-stripe-game-session-id').should('be.visible')
            cy.get('.cy-italy-regulation-stripe-participation-ticket-id').should('be.visible')

            cy.getIframe('.cgp-game-iframe').within(() => {
                //for loop for clicking on the reduce bet button (applicable for Pragmatic games).
                for (let i = 0; i < 12; i++) {
                    //custom command
                    cy.get('canvas').click(856, 660)
                }
                cy.get('canvas').click(942, 638)
                cy.wait(20000)
            })

            cy.get('.cy-game-navbar-close-button').should('be.visible').click()

            //Grabs now the newest balance it finds in history and compares it with the old one.
            cy.wait(10000)
            cy.reload()
            cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory => {
                expect(newHistory).to.not.equal(firstHistory)
            })

        })



    })
})

