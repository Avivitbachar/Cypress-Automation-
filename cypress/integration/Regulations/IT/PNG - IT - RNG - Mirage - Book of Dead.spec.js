/// <reference types="cypress" />

describe('PNG - IT - RNG - Mirage - Book of Dead', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":1,"brandID":31,"subBrandID":46},"Currency":{"anonymousCurrency":"EUR"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"ita","language":"ita","iso2":"it","publicationID":1870,"cmsSource":"https://www.888casino.it","addedGameTypesFromSdm":[2350170,2350126,2350330],"gameTypes":"2350170,2350126,2350330"}}');
       
    })

    it('Launch + spin + check history', () => {
         //Logs in to website using the hardcoded credentials (custom command).
         cy.orbitBypass()
         cy.loginPC('andreigit', '12345678')

         //Gets the history button and clicks it.
         cy.get('.cy-profile-picture').click()
         cy.contains('Cronologia di gioco').click()
 
         // Grabs the 1st history ID it finds
         cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory=>{
            cy.log(firstHistory)

        cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
            //Launches a game based on the provided name (custom command).
         cy.launchGameMiragePC('Book of Dead')

         //Italy solution
         cy.get('.cy-modal')
         cy.get('.cy-italy-game-limit-default-amount-option').within(()=>{
             cy.get('input[type="radio"]').should('be.checked')
         })
         cy.get('#otherLimitContainer').should('be.visible')
         cy.get('.cgp-msg-button').click()


         cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })
 
         cy.wait(40000)

         //Italy stripe check
         cy.get('.cy-italy-regulation-stripe-game-session-id').should('be.visible')
         cy.get('.cy-italy-regulation-stripe-participation-ticket-id').should('be.visible')

         //Grabs the 1st iFrame and takes the balance from within it
         cy.getIframe('.cgp-game-iframe').within(()=>{
             cy.get('canvas').click(623, 558)
            
             
             for(let i=0;i<10;i++){
                 cy.get('canvas').click(543, 632)
             }
             cy.intercept('POST', 'https://itastagefly.playngonetwork.com/').as('PNGPostBet')
             cy.get('canvas').click(871, 643)
             cy.wait(20000)   
             cy.wait('@PNGPostBet')
             cy.get('@PNGPostBet').then(png=>{
                expect(png.response.statusCode).to.eq(200)
             })
                    
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

