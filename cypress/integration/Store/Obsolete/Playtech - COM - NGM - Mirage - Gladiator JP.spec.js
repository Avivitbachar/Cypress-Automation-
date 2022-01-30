/// <reference types="cypress" />

describe('First test', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":255,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"GBP"},"OAuth2":{"fakeClientIP":"213.219.55.4"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"gbr","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2010144,2010058,2010060,2010065,2330106],"gameTypes":"2010144,2010058,2010060,2010065,2330106"}}')
    })

    it('Launch + spin + check history', () => {


        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigcanad', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        //Grabs the first history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').as('firstHistory')
        cy.log('@firstHistory')
        //Launches a game based on the provided name (custom command).
        cy.launchGameMiragePC('Gladiator')



        //Gives the game time to load.
        cy.wait(20000)

        //for loop for clicking on the reduce bet button (applicable for Pragmatic games).


        //Grabs the iframe and clicks on the bet button.
        cy.getIframe('.cgp-game-iframe').within(() => {
            cy.get('.playerBalanceGoodDesktop').invoke('text').as('firstBalance')
            cy.log('@firstBalance')

            cy.getIframe('.gameFrame').within(() => {
                for (let i = 0; i < 25; i++) {
                    //custom command
                    cy.get('canvas').click(316, 598)
                }
                cy.get('canvas').click(991, 595)
                cy.wait(5000)
            })          
            //cy.find('#cp-playerBalance').invoke('text').then(balancePlayer => {
            //    cy.log(balancePlayer);
            //});
        });

        cy.get('.cy-game-navbar-close-button').should('be.visible').click()

        //Grabs now the newest balance it finds in history and compares it with the old one.
      cy.wait(10000)
      cy.reload()
      cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory=>{
          expect(newHistory).to.not.eq('@firstHistory')
      })

    })


})

