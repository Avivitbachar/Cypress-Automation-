/// <reference types="cypress" />

describe('888 - COM - Roulette - Production - European Roulette', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://www.888casino.com/');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).

        cy.loginPC('RTGAutoGIB', 'Auto1234!')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)

            cy.intercept('POST', 'https://cgp.safe-iplay.com/cgpapi/game/OpenRealGame').as('openRealGame')
            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('European Roulette')

            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })

            cy.wait(20000)

            cy.getIframe('.cy-game-iframe').within(() => {
               
                cy.get('.icon-volume').click()
                cy.get('#balance').find('span').eq(1).invoke('text').then(balanceStart => {
                    //cy.get('[class="table hover-plate"]').invoke('addClass', 'hidden')
                    cy.get('[class="table hover-plate"]').click()
                    cy.get('[class="main-button spin-button"]').click()
                    cy.wait(15000)                  
                    cy.get('#balance').find('span').eq(1).invoke('text').then(balancePostSpin=>{
                        expect(balanceStart).to.not.eq(balancePostSpin)
                    })

                })


            })

            //Closes the game window
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

