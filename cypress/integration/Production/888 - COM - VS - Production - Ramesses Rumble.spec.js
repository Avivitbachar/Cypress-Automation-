/// <reference types="cypress" />

describe('888 - COM - VS - Production - Ramesses Rumble', () => {

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
            cy.launchGameMiragePC('Ramesses Rumble')

            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })

            cy.wait(30000)

            cy.getIframe('.cy-game-iframe').within(() => {

                cy.get('[class="continue visible"]').click()
                cy.wait(5000)
                cy.get('.gs-buttons').click()
                cy.get('#balance').find('span').eq(1).invoke('text').then(balanceStart=>{
                        
                   cy.get('#bet_value').invoke('text').then(betButton=>{
                    cy.log(betButton)
                    let betAmount = cy.get('#bet_value').invoke('text')
                    let winAmount = cy.get('#win_value').invoke('text')
                    cy.get('#spin_button').click()
                    cy.wait(20000)
                    cy.get('#balance').find('span').eq(1).invoke('text').then(balancePostSpin=>{
                        if(balanceStart === balancePostSpin){
                            expect(betAmount).to.eq(winAmount)
                            cy.log('**Bet amount equals win amount, thus balance remains unchanged.**')
                        }else{
                            expect(balanceStart).to.not.eq(balancePostSpin)
                            cy.log('**Starting balance is different than post-spin balance.**')
                        }
                    })

               
             
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

