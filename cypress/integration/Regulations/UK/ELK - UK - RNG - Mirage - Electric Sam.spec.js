/// <reference types="cypress" />

describe('ELK - UK - RNG - Mirage - Electric Sam', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":255,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"GBP"},"OAuth2":{"fakeClientIP":"213.219.55.4"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"gbr","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2340025],"gameTypes":"2340025"}}');

    })

    it('Launch + spin + check history', () => {

        cy.orbitBypass()
        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreiguk3', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)

            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/netPosition/initialize').as('netPosition')
            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Electric Sam')
            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })

            cy.wait('@netPosition')
            cy.get('@netPosition').then(netUKGC=>{
                expect(netUKGC.response.statusCode).to.eq(200)
            })
            
            cy.wait(30000)
            cy.getIframe('.cy-game-iframe').within(() => {
                cy.intercept('POST', 'https://gc6-stage.gp103.nyxgib.eu/capi/10007/real/purchase').as('electricSpin')
                cy.get('#ui').click(528, 332)
                cy.wait(15000)
                cy.get('#ui').click(66, 597)
                cy.wait(1000)
                cy.get('#ui').click(215, 213)
                
                cy.get('#ui').click(933, 522)
                cy.wait('@electricSpin')
                cy.get('@electricSpin').then(betStatus => {
                    expect(betStatus.response.statusCode).to.eq(200)
                })

            })

            //Closes the game window
            cy.wait(30000)
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

