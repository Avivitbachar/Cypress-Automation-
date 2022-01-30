/// <reference types="cypress" />

describe('Pragmatic - COM - RNG - Production - Release The Kraken', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('www.888casino.com');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('GenComUsd', 'Test1234!')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)
            cy.intercept('POST', 'https://cgp.safe-iplay.com/cgpapi/game/OpenRealGame').as('openRealGame')

            //Launches a game based on the provided name (custom command).
            cy.intercept('POST', 'https://888casino-dk3.pragmaticplay.net/gs2c/v3/gameService').as('pragmaticLaunchString')
            cy.launchGameMiragePC('Release the Kraken')
            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })
            cy.wait(40000)
            
            cy.getIframe('.cgp-game-iframe').within(() => {
                cy.wait('@pragmaticLaunchString')
                cy.get('@pragmaticLaunchString').then(pragmaFirst=>{
                    let launchResult = pragmaFirst.response.body
                    let startingBalanceIndex = launchResult.indexOf('balance')
                    let startingBalanceLastIndex = launchResult.indexOf('&action')
                    let startingBalance = launchResult.slice(startingBalanceIndex,startingBalanceLastIndex)
                    console.log(startingBalance)
                
                    cy.get('canvas').click(991, 449)
                    //for loop for clicking on the reduce bet button (applicable for Pragmatic games).
                    for (let i = 0; i < 12; i++) {
                        //custom command
                        cy.get('canvas').click(856, 660)
                    }
                    cy.get('canvas').click(942, 638)
                    cy.intercept('POST', 'https://888casino-dk3.pragmaticplay.net/gs2c/v3/gameService').as('pragmaticRoundString')
                    cy.get('canvas').click(942, 638)
                    cy.wait('@pragmaticRoundString')
                    cy.get('@pragmaticRoundString').then(stringPragma=>{
                        console.log(stringPragma)
                        let stringResult = stringPragma.response.body
                        let balanceFirstIndex= stringResult.indexOf('balance')
                        let balanceLastIndex= stringResult.indexOf('&index')
                        let winStringFirstIndex = stringResult.indexOf('tw=')
                        let winStringSecondIndex = stringResult.indexOf('&ls')
                        let balanceString = stringResult.slice(balanceFirstIndex,balanceLastIndex)
                        let winString = stringResult.slice(winStringFirstIndex,winStringSecondIndex)
                        console.log(winString)

                        if(startingBalance===balanceString){
                            expect(winString).to.not.eq('0.00')
                        }else{
                            expect(startingBalance).to.not.eq(balanceString)
                        }
                    })
                    cy.wait(20000)
                })
               
            })

            cy.get('.cy-game-navbar-close-button').should('be.visible').click()

            //Grabs now the newest balance it finds in history and compares it with the old one.
            cy.wait(10000)
            cy.reload()
            cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory => {
                expect(newHistory).to.not.equal(firstHistory)
                cy.get('.cy-history-more-details').first().click()
                cy.get('.cgp-details-history-game-container').should('be.visible')
                cy.wait(15000)
                cy.getIframe('.cy-game-iframe').within(()=>{
                    cy.get('.GameTitle').should('be.visible')
                })
            })

        })



    })
})

