/// <reference types="cypress" />

describe('First test', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768); 
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"OAuth2":{"fakeClientIP":"5.62.92.0"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2380014],"gameTypes":"2380014"}}')
    })

    it('Launch + spin + check history', () => {
        

        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigcanad', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        //records the 1st balance value it finds.
        cy.get('.cy-gaming-history-bankroll-value').first().then(firstBalance => {
            let oldBalance = firstBalance.text()
            cy.log(oldBalance)
            

            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Joker Jewels')

            

            //Gives the game time to load.
            cy.wait(10000)

            //for loop for clicking on the reduce bet button (applicable for Pragmatic games).
            for (let i = 0; i < 12; i++) {
                //custom command
                cy.getIframe('.cgp-game-iframe').click(859, 657)
            }

            //Grabs the iframe and clicks on the bet button.
            cy.getIframe('.cgp-game-iframe').click(934, 608)
            cy.intercept('https://888casino.prerelease-env.biz/gs2c/v3/gameService').as('gameService')
            cy.wait('@gameService')
            cy.get('@gameService').then(realGame=>{
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })
            cy.wait(20000)

           
            //Grabs the close button and clicks it.
            cy.get('.cy-game-navbar-close-button').should('be.visible').click()

            //Goes to the history again.
            cy.get('.cy-welcome-buttons-container').click()
            cy.contains('Gaming History').click({ force: true })

            //Gives it time and reloads to have the highest chance of the history round being written.
            cy.wait(10000)
            cy.reload()

            //Grabs now the newest balance it finds in history and compares it with the old one.
            cy.get('.cy-gaming-history-bankroll-value').first().then(balance => {
                let newBalance = balance.text()
                expect(oldBalance).to.not.eq(newBalance)
                cy.get('.cy-gaming-history-bet-value').first().should('have.text', '$0.05')
                

            })
        })


    })
})

