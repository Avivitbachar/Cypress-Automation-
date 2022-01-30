/// <reference types="cypress" />

describe('Pragmatic - COM - RNG - Mirage - Release The Kraken', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2380014,2380001],"gameTypes":"2380014,2380001"}}');

    })

    it('Launch + spin + check history', () => {
        cy.orbitBypass()
        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigcanad', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)
            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')

            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Release the Kraken')
            cy.intercept('POST', 'https://888casino.prerelease-env.biz/gs2c/ge/v3/gameService').as('pragmaticLaunchString')
            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })
            cy.wait(40000)
            cy.getIframe('.cgp-game-iframe').within(() => {
                //for loop for clicking on the reduce bet button (applicable for Pragmatic games).
                cy.wait('@pragmaticLaunchString')
                cy.get('@pragmaticLaunchString').then(pragmaFirst=>{
                    let launchResult = pragmaFirst.response.body
                    let startingBalanceIndex = launchResult.indexOf('balance')
                    let startingBalanceLastIndex = launchResult.indexOf('&action')
                    let startingBalance = launchResult.slice(startingBalanceIndex,startingBalanceLastIndex)
                    console.log(startingBalance)

                    for (let i = 0; i < 12; i++) {
                        //custom command
                        cy.get('canvas').click(856, 660)
                    }
                    cy.intercept('POST', 'https://888casino.prerelease-env.biz/gs2c/ge/v3/gameService').as('pragmaticRoundString')
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
            })

        })



    })
})

