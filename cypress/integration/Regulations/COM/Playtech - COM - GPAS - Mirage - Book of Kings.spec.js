/// <reference types="cypress" />

describe('Playtech - COM - GPAS - Mirage - Book of Kings', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2380014,2380001,2330110],"gameTypes":"2380014,2380001,2330110"}}');
       
    })

    it('Launch + spin + check history', () => {
         //Logs in to website using the hardcoded credentials (custom command).
         cy.orbitBypass()
         cy.loginPC('andreigcanad', '12345678')

         //Gets the history button and clicks it.
         cy.get('.cy-profile-picture').click()
         cy.contains('Gaming History').click()
 
         cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory=>{
            cy.log(firstHistory)

            //Launches a game based on the provided name (custom command).
         cy.launchGameMiragePC('Book of Kings')
 
         cy.wait(40000)
         cy.getIframe('.cgp-game-iframe').within(()=>{

            cy.get('#gdkContainer').click(629, 598)
          //for loop for clicking on the reduce bet button.
          for (let i = 0; i < 8; i++) {
            cy.get('#gdkContainer').click(814, 597)
                }
           cy.get('#gdkContainer').click(627, 595)
           cy.wait(20000)
         })
   
         cy.get('.cy-game-navbar-close-button').should('be.visible').click()

         //Grabs now the newest balance it finds in history and compares it with the old one.
       cy.wait(10000)
       cy.reload()
       cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory=>{
        expect(newHistory).to.not.equal(firstHistory)
    })
        
        })
         


    })
})

