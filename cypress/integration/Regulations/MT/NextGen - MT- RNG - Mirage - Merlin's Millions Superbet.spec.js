/// <reference types="cypress" />

describe('NextGen - MT - RNG - Mirage - Merlin\'s Millions Superbet', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":16,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"Game":{"ChillEnvironment":"Mirage_210","GRS":{"AdditionalState":"LATEST"}},"Regulation":{"Spain":{"MaxDurationsInMinutesForPC":"5,10,15"}},"OAuth2":{"fakeClientIP":"5.62.83.160"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"deu","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2340002],"gameTypes":"2340002"}}');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).
        cy.orbitBypass()
        
        cy.loginPC('andreigmt', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)

            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Merlin\'s Millions Superbet')
            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })
            cy.wait(30000)
            cy.getIframe('.cy-game-iframe').within(() => {
                cy.getIframe('#gameIFrame').within(()=>{
                    cy.getIframe('#gameiframe').within(()=>{
                        cy.get('#game').click(679, 453)
                        cy.wait(5000)
                        for(let i=0; i < 5; i++){
                            cy.get('#game').click(111, 662, {force: true})
                        }
                        cy.intercept('POST', 'https://ogs-gdm-stage.nyxgib.eu/nextgen/**').as('merlinSpin') 
                        cy.get('#game').click(1058, 662)
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

