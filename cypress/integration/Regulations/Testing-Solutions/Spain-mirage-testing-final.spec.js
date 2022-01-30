/// <reference types="cypress" />

describe('First test', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1920, 1080);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":2,"brandID":58,"subBrandID":82},"Currency":{"anonymousCurrency":"EUR"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"esp","language":"spa","iso2":"es","publicationID":1884,"cmsSource":"https://www.888casino.es","addedGameTypesFromSdm":[2380014],"gameTypes":"2380014"}}');
    })

    it('Launch + spin + check history', () => {
        

        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigesrea', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Historial de juego').click()

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
                cy.getIframe('.cgp-game-iframe').click(702, 529)
            }

            //Grabs the iframe and clicks on the bet button.
            cy.getIframe('.cgp-game-iframe').click(774, 526)
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

