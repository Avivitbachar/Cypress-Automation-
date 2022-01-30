/// <reference types="cypress" />

describe('Habanero - IT - RNG - Mirage - Hot Hot Fruit', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":1,"brandID":31,"subBrandID":46},"Currency":{"anonymousCurrency":"EUR"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"ita","language":"ita","iso2":"it","publicationID":1870,"cmsSource":"https://www.888casino.it","addedGameTypesFromSdm":[2350170],"gameTypes":"2350170"}}');

    })

    it('Launch + spin + check history', () => {

        cy.orbitBypass()
        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigit', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Cronologia di gioco').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)

            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/GetGameSessionData').as('italySessionData')
            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Hot Hot Fruit')

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
                //Italy stripe check
                cy.wait(3000)
                cy.get('.cy-italy-regulation-stripe-game-session-id').should('be.visible')
                cy.get('.cy-italy-regulation-stripe-participation-ticket-id').should('be.visible')
                
                cy.wait(40000)
                //Grabs the 1st iFrame and takes the balance from within it
                cy.getIframe('.cgp-game-iframe').within(() => {
               
                    cy.intercept('POST', 'https://gs-test.g-loader.com/ps?**').as('hotHotFruit')
                    cy.wait('@italySessionData')
                    cy.get('@italySessionData').then(italyBalance => {
                        console.log(italyBalance)
                        let centBalance = italyBalance.response.body.OriginalGameLimit
                        let actualBalance = centBalance / 100
                        cy.log('**Starting balance is** ' + actualBalance)
                        cy.log(actualBalance)
                        cy.get('canvas').click(624, 632, {force:true})
                        cy.wait('@hotHotFruit')
                        cy.get('@hotHotFruit').then(hotFruitBet => {
                            console.log(hotFruitBet)
                            let newBalance = hotFruitBet.response.body.header.player.realbalance
                            let winAmount = hotFruitBet.response.body.portmessage.totalwincash

                            if (actualBalance === newBalance) {
                                expect(winAmount).to.eq(1.5)
                                cy.log('**Bet amount equals win amount, thus balance remains unchanged.**')
                            } else {
                                expect(actualBalance).to.not.eq(newBalance)
                                cy.log('**Starting balance is different than post-spin balance.**')
                            }
                        })
                        cy.wait(10000)


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

