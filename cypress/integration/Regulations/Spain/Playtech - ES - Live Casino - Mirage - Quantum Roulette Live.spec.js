/// <reference types="cypress" />

// REQUIRES FURTHER CODING AS IT CURRENTLY PLACES A BET ON ALL POSITIONS

describe('Playtech - ES - Live Casino - Mirage - Quantum Roulette Live', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":2,"brandID":58,"subBrandID":82},"Currency":{"anonymousCurrency":"EUR"},"Game":{"ChillEnvironment":"Mirage_50","GRS":{"GameState":"APPROVED","AdditionalState":"APPROVED"}}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"esp","language":"spa","iso2":"es","publicationID":1884,"cmsSource":"https://www.888casino.es","addedGameTypesFromSdm":[2330017],"gameTypes":"2330017"}}');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).
        cy.get('.cy-modal-dialog-consumer-content').within(()=>{
            cy.get('[placeholder="Environment password"]').type('orbit1234')
            cy.get('[type="submit"]').click()
        })
        
        cy.loginPC('andreigesrea', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Historial de juego').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)

            cy.get('.cy-menu-item').contains('Casino en Vivo').click()
            cy.get('.cy-live-casino-grid-item-2330017').within(() => {
                cy.get('.cy-live-casino-grid-item-thumbnail-image').should('have.attr', 'src')
                cy.get('.cy-live-casino-grid-item-bet-interval').should('be.visible')
                cy.get('.cy-live-casino-grid-item-infobar-game-seats-count').should('be.visible')
                cy.get('.cy-live-casino-grid-item-infobar-dealer-name').should('be.visible')
                cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
                cy.get('.cy-live-casino-grid-item-thumbnail-overlay').click()
            })

            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })

            cy.wait(20000)

            cy.getIframe('.cy-game-iframe').within(() => {
                cy.get('.roulette-round-result-position__text').should('be.visible')
                cy.wait(2000)
                cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/GetGameSessionData').as('spainSessionData')
                cy.get('[data-automation-locator="betPlace.spots50x50-red"]').click()
                cy.wait(30000)
                cy.wait('@spainSessionData')
                cy.get('@spainSessionData').then(spainValidation=>{
                    const wins = spainValidation.response.body.TotalWins
                    const bets = spainValidation.response.body.TotalBets
                    expect(bets).to.not.equal(0)
                   cy.log(`**Total bets are: ${bets}**`)
                   cy.log(`**Total wins are: ${wins}**`)
                })
            })
            //Closes the game window
            cy.get('.cy-game-navbar-close-button').should('be.visible').click()

            //Goes to the history page, waits for 10secs and then reloads the page, and then compares the history ID it gets with the 1st one.
            cy.get('.cy-profile-picture').click()
            cy.contains('Historial de juego').click()
            cy.wait(10000)
            cy.reload()
            cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory => {
                expect(newHistory).to.not.equal(firstHistory)
            })

        })



    })
})

