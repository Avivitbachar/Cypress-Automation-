/// <reference types="cypress" />

describe('PNG - ES - RNG - Mirage - Book of Dead', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":2,"brandID":58,"subBrandID":82},"Currency":{"anonymousCurrency":"EUR"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"esp","language":"spa","iso2":"es","publicationID":1884,"cmsSource":"https://www.888casino.es","addedGameTypesFromSdm":[2380002,2370000],"gameTypes":"2380002,2370000"}}');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).

        cy.get('.cy-modal-dialog-consumer-content').within(() => {
            cy.get('[placeholder="Environment password"]').type('orbit1234')
            cy.get('[type="submit"]').click()
        })

        cy.loginPC('andreigesrea', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Historial de juego').click()

        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)
            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')

            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Book of Dead')
            cy.get('.cy-modal').within(() => {
                cy.get('.cy-spain-game-limit-duration-select').select(1)
                cy.get('.cy-spain-game-limit-loss-limit-select').select(1)
                cy.get('.cy-spain-game-limit-continue-play-button').click()
            })
            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })
            cy.wait(40000)
            cy.get('.cy-spain-regulation-strip-total-bets-label').should('be.visible')
            cy.get('.cy-spain-regulation-strip-total-wins-label').should('be.visible')
            cy.get('.cy-spain-regulation-strip-session-balance-label').should('be.visible')
            //Grabs the 1st iFrame and takes the balance from within it
            cy.getIframe('.cgp-game-iframe').within(() => {
                cy.get('canvas').click(636, 561)


                for (let i = 0; i < 10; i++) {
                    cy.get('canvas').click(546, 637)
                }
                cy.intercept('POST', 'https://aeustagefly.playngonetwork.com').as('PNGPostBet')
                cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/GetGameSessionData').as('spainSessionData')
                cy.get('canvas').click(871, 643)
                cy.wait('@PNGPostBet')
                cy.get('@PNGPostBet').then(png => {
                    expect(png.response.statusCode).to.eq(200)
                })
                cy.wait(20000)
                cy.wait('@spainSessionData')
                cy.get('@spainSessionData').then(spainValidation=>{
                    const originalBalance = spainValidation.response.body.OriginalGameLimit
                    const actualBalance = spainValidation.response.body.PlayerBalance
                    const wins = spainValidation.response.body.TotalWins
                    const bets = spainValidation.response.body.TotalBets
                    if(originalBalance === actualBalance) {
                        expect(wins).to.eq(bets)
                        cy.log('**Bet amount equals win amount, thus balance remains unchanged.**')
                    }else{
                        expect(originalBalance).to.not.eq(actualBalance)
                        cy.log('**Starting balance is different than post-spin balance.**')
                    }
                })
                
            })

            cy.get('.cy-spain-regulation-strip-total-bets-value').invoke('text').should('not.eq', '0,00€')
            //Closes the game window
            cy.get('.cy-game-navbar-close-button').should('be.visible').click()
            cy.get('.cy-modal').within(() => {
                cy.get('.cy-modal-content').find('div').should('not.contain.text', 'Apuestas totales: 0,00€')
                cy.get('button').click()
            })

            //Goes to the history page, waits for 10secs and then reloads the page, and then compares the history ID it gets with the 1st one.
            cy.wait(10000)
            cy.reload()
            cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory => {
                expect(newHistory).to.not.equal(firstHistory)
            })

        })



    })
})

