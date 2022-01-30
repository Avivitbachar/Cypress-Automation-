/// <reference types="cypress" />

describe('Yggdrasil - COM - RNG - Mirage - Wolf Hunters', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2350042],"gameTypes":"2350042"}}');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).
        cy.orbitBypass()
        cy.loginPC('andreigcan1', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)

            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Wolf Hunters')

            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })
            cy.intercept('POST', 'https://staginggib.yggdrasilgaming.com/game.web/service?fn=authenticate').as('yggdrasilAuthenticate')
            cy.wait('@yggdrasilAuthenticate')
            cy.get('@yggdrasilAuthenticate').then(yggdrasilAuthen => {
                console.log(yggdrasilAuthen)
                let startBalance = yggdrasilAuthen.response.body.data.balance.cash
                cy.log(startBalance)

                cy.wait(30000)

                //Grabs the 1st iFrame and takes the balance from within it
                cy.getIframe('.cy-game-iframe').within(() => {


                    cy.get('video').click(672, 472)


                    for (let i = 0; i < 10; i++) {
                        cy.get('canvas').click(200, 657)
                    }
                    cy.intercept('POST', 'https://staginggib.yggdrasilgaming.com/game.web/service?fn=play').as('yggdrasilPostSpin')
                    cy.get('canvas').click(631, 648)
                    cy.wait(40000)
                    cy.wait('@yggdrasilPostSpin')
                    cy.get('@yggdrasilPostSpin').then(yggdrasilPostBet => {
                        console.log(yggdrasilPostBet)
                        let afterSpinBalance = yggdrasilPostBet.response.body.data.resultBal.cash
                        let betSum = yggdrasilPostBet.response.body.data.wager.bets[0].betdata.ncoins
                        let winSum = yggdrasilPostBet.response.body.data.wager.bets[0].betdata.accC

                        if (startBalance === afterSpinBalance) {
                            expect(betSum).to.eq(winSum)
                            cy.log('Bet amount equals win amount, thus balance remains unchanged.')
                        } else {
                            expect(startBalance).to.not.eq(afterSpinBalance)
                            cy.log('Starting balance is different than post-spin balance.')
                        }
                    })


                })



            })


            //Closes the game window
            cy.get('.cy-game-navbar-close-button').should('be.visible').click()

            //Goes to the history page, waits for 10secs and then reloads the page, and then compares the history ID it gets with the 1st one.
            cy.wait(10000)
            cy.reload()
            cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory => {
                expect(newHistory).to.not.equal(firstHistory)
            })

        })



    })
})

