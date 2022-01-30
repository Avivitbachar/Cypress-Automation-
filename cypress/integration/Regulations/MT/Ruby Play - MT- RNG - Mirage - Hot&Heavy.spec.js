/// <reference types="cypress" />

describe('Ruby Play - MT- RNG - Mirage - Hot&Heavy', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":16,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"Regulation":{"reminderIntervals":"0,1,3,5"},"Game":{"GRS":{"GameState":"LATEST","AdditionalState":"LATEST"}},"OAuth2":{"fakeClientIP":"5.62.83.160"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"deu","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2350103],"gameTypes":"2350103"}}');

    })

    it('Launch + spin + check history', () => {

        cy.orbitBypass()
        
        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigmt', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)
            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Hot & Heavy')
            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })

            cy.intercept('POST', 'https://rgstorgs.stage.pariplaygames.com/client/loadgame**').as('rubyPlayAuthenticate')
            cy.wait('@rubyPlayAuthenticate')
            cy.get('@rubyPlayAuthenticate').then(rubyPlayAuthen => {
                console.log(rubyPlayAuthen)
                let startBalance = rubyPlayAuthen.response.body.Status.Balance
                cy.log(startBalance)

                
            cy.wait(30000)
                //Grabs the 1st iFrame and takes the balance from within it
                cy.getIframe('.cy-game-iframe').within(() => {

                        cy.intercept('POST', 'https://rgstorgs.stage.pariplaygames.com/client/PlaceBet**').as('rubyPlayPostSpin')
                    
                        //We are using a for loop because for some reason clicking once or twice on the button does nothing.
                        for(let i=0;i<3;i++){
                            cy.get('canvas').click(576, 597)
                        }

                        //Normal for loop for lowering the bet.
                        for(let i=0;i<6;i++){
                            cy.get('canvas').click(213, 628)
                        }

                        cy.get('canvas').click(974, 630)
                        cy.wait(20000)
                        cy.wait('@rubyPlayPostSpin')
                        cy.get('@rubyPlayPostSpin').then(rubyPlayPostBet => {
                            console.log(rubyPlayPostBet)
                            let afterSpinBalance = rubyPlayPostBet.response.body.Balance.BalanceAfter
                            let betSum = rubyPlayPostBet.response.body.Ticket.TotalBet
                            let winSum = rubyPlayPostBet.response.body.Ticket.TotalWinAmount
    
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

