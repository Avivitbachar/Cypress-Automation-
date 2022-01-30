/// <reference types="cypress" />

describe('888 - COM - Baccarat - Production - Baccarat', () => {

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

            cy.contains('Casino Games').click()
            cy.get('.cy-filters-games-list').contains('Baccarat').click()
            cy.intercept('POST', 'https://cgp.safe-iplay.com/cgpapi/game/OpenRealGame').as('openRealGame')
            //Launches a game based on the provided name (custom command).
            cy.get('.game-type-130082').click()

            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })

            cy.wait(20000)

            cy.getIframe('.cy-game-iframe').within(() => {

                cy.get('.icon-volume').click()
                cy.get('#game_settings_button').click()
                //cy.get('[data-settings-name="LimitName"]').check({force:true})
                cy.get('[data-text-key="SAVE"]').click()
                cy.get('[class="select-btn left"]').click()
                //cy.get('[data-value="100"]').first().scrollIntoView().click()
                cy.get('.wrapper').find('span').eq(1).invoke('text').then(balanceStart => {
                    //cy.get('[class="table hover-plate"]').invoke('addClass', 'hidden')
                    const numBalanceStart = Number(balanceStart.slice(1, 6))
                    cy.get('[data-bet-name="player-bet"]').click()
                    cy.get('[data-text-key="DEAL"]').click()
                    cy.wait(15000)
                    cy.get('.wrapper').find('span').eq(1).invoke('text').then(balancePostSpin => {
                        cy.get('#total_bet').invoke('text').then(bet => {
                            let betAmount = Number(bet.slice(1, 6))
                            const numBalancePostSpin = Number(balancePostSpin.slice(1, 6))
                            cy.log(betAmount)
                            cy.get('#total_paid').invoke('text').then(win => {
                                let winAmount = Number(win.slice(1, 6))
                                if (betAmount === winAmount) {
                                    expect(numBalanceStart).to.eq(numBalancePostSpin)
                                } else {
                                    expect(numBalanceStart).to.not.eq(numBalancePostSpin)
                                }
                                cy.get('[data-text-key="NEW_GAME"]').click()
                            })
                        })



                    })

                })


            })
            cy.wait(2000)
            //Closes the game window
            cy.get('.cy-game-navbar-close-button').should('be.visible').click()

            //Goes to the history page, waits for 10secs and then reloads the page, and then compares the history ID it gets with the 1st one.
            cy.get('.cy-profile-picture').click()
            cy.contains('Gaming History').click()
            cy.wait(10000)
            cy.reload()
            cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory => {
                expect(newHistory).to.not.equal(firstHistory)
            })

        })



    })
})

