/// <reference types="cypress" />

describe('Pariplay - UK - RNG - Mirage - Fire and Ice', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":255,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"GBP"},"OAuth2":{"fakeClientIP":"213.219.55.4"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"gbr","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2350001],"gameTypes":"2350001"}}');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).
        cy.orbitBypass()
        cy.loginPC('andreiguk3', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)
            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
           cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/netPosition/initialize').as('netPosition')
            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Fire and Ice')
            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })
            
            //Checks to see that the netposition appears.
            cy.wait('@netPosition')
            cy.get('@netPosition').then(netUKGC=>{
                expect(netUKGC.response.statusCode).to.eq(200)
            })

            //Intercept Pariplay Authentication API in order to record the starting balance
            cy.intercept('POST', 'https://rgstorgs.stage.pariplaygames.com/client/loadgame').as('pariplayAuthenticate')
            cy.wait('@pariplayAuthenticate')
            cy.get('@pariplayAuthenticate').then(pariplayAuthen => {
                console.log(pariplayAuthen)
                let startBalance = pariplayAuthen.response.body.Status.Balance
                cy.log('**Starting balance is** ' + startBalance)
  
            cy.wait(30000)
                //Grabs the 1st iFrame and takes the balance from within it
                cy.getIframe('.cy-game-iframe').within(() => {

                    cy.getIframe('#game-iframe').within(()=>{
                        cy.intercept('POST', 'https://rgstorgs.stage.pariplaygames.com/client/PlaceBet').as('pariplayPostSpin')
                        cy.get('canvas').click(1028, 602)
                        cy.wait(40000)
                        cy.wait('@pariplayPostSpin')
                        cy.get('@pariplayPostSpin').then(pariplayPostBet => {
                            console.log(pariplayPostBet)
                            let afterSpinBalance = pariplayPostBet.response.body.Balance.BalanceAfter
                            let betSum = pariplayPostBet.response.body.Ticket.TotalBet
                            let winSum = pariplayPostBet.response.body.Ticket.TotalWinAmount
    
                            if (startBalance === afterSpinBalance) {
                                expect(betSum).to.eq(winSum)
                                cy.log('**Bet amount equals win amount, thus balance remains unchanged.**')
                            } else {
                                expect(startBalance).to.not.eq(afterSpinBalance)
                                cy.log('**Starting balance is different than post-spin balance.**')
                            }
                        })
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

