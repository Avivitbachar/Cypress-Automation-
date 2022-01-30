/// <reference types="cypress" />

describe('PNG - MT - RNG - Mirage - Book of Dead', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":16,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"OAuth2":{"fakeClientIP":"5.62.83.160"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"deu","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2380001],"gameTypes":"2380001"}}');
 
    })

    it('Launch + spin + check history', () => {
         //Logs in to website using the hardcoded credentials (custom command).

         cy.orbitBypass()

         cy.loginPC('andreigmt', '12345678')

         //Gets the history button and clicks it.
         cy.get('.cy-profile-picture').click()
         cy.contains('Gaming History').click()
 
         // Grabs the 1st history ID it finds
         cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory=>{
            cy.log(firstHistory)

         //Launches a game based on the provided name (custom command).
         cy.launchGameMiragePC('Book of Dead')
 
         cy.wait(40000)

         //Grabs the 1st iFrame and takes the balance from within it
         cy.getIframe('.cgp-game-iframe').within(()=>{
             cy.get('canvas').click(588, 587)
            
             
             for(let i=0;i<10;i++){
                 cy.get('canvas').click(564, 654)
             }
             cy.intercept('POST', 'https://dmtflystage.playngonetwork.com/').as('PNGPostBet')
             cy.get('canvas').click(871, 643)
             cy.wait('@PNGPostBet')
             cy.get('@PNGPostBet').then(png=>{
                expect(png.response.statusCode).to.eq(200)
             })
             cy.wait(40000)           
         })

       
         //Closes the game window
         cy.get('.cy-game-navbar-close-button').should('be.visible').click()

         //Goes to the history page, waits for 10secs and then reloads the page, and then compares the history ID it gets with the 1st one.
       cy.wait(10000)
       cy.reload()
       cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory=>{
        expect(newHistory).to.not.equal(firstHistory)
    })
        
        })
         


    })
})

