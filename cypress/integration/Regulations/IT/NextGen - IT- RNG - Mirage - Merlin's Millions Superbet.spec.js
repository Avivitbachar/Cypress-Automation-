/// <reference types="cypress" />

describe('NextGen - IT - RNG - Mirage - Merlin\'s Millions Superbet', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":1,"brandID":31,"subBrandID":46},"Currency":{"anonymousCurrency":"EUR"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"ita","language":"ita","iso2":"it","publicationID":1870,"cmsSource":"https://www.888casino.it","addedGameTypesFromSdm":[2340025,2340002],"gameTypes":"2340025,2340002"}}');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).
        cy.orbitBypass()
        
        cy.loginPC('andreigit6', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Cronologia di gioco').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)

            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Merlin\'s Millions Superbet')

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
            cy.getIframe('.cy-game-iframe').within(() => {
                cy.getIframe('#gameIFrame').within(()=>{
                    cy.getIframe('#gameiframe').within(()=>{
                        cy.get('#game').click(685, 431)
                        cy.wait(5000)
                        for(let i=0; i < 5; i++){
                            cy.get('#game').click(111, 662, {force:true})
                        }
                        cy.intercept('POST', 'https://ogs-gdm-mt1p16-stage.nyxop.net/nextgen/**').as('merlinSpin') 
                        cy.get('#game').click(1026, 624, {force:true})
                        cy.wait('@merlinSpin')
                        cy.get('@merlinSpin').then(betStatus => {
                            expect(betStatus.response.statusCode).to.eq(200)
                        })
                    })
                })

             

            })

            //Closes the game window
            cy.wait(10000)
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

