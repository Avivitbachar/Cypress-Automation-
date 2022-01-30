/// <reference types="cypress" />

describe('Evolution - RO - Mirage - Bucharest Blackjack B', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":9,"brandID":76,"subBrandID":119},"Currency":{"anonymousCurrency":"RON"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"rum","language":"rum","iso2":"ro","publicationID":1903,"cmsSource":"https://www.888casino.ro","addedGameTypesFromSdm":[2330180],"gameTypes":"2330180"}}')
    })

    it('Launch + spin + check history', () => {


        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigron40', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Istoric joc').click()

        //Grabs the first history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)

            //Launches a game based on the provided name (custom command).
           //cy.get('.message_block').find('img').click()
            cy.launchGameMiragePC('Live Bucharest Blackjack 2')



            //Gives the game time to load.
            cy.wait(20000)

            //for loop for clicking on the reduce bet button (applicable for Pragmatic games).


            //Grabs the iframe and clicks on the bet button.
            cy.getIframe('.cgp-game-iframe').within(() => {
                cy.get('canvas').click(631, 632)

                //Grabs and balance pre-bet.
                cy.get('[data-role="balance-label__value"]').invoke('text').then(firstBalanceTaken => {

                    cy.log(firstBalanceTaken)
                    //Grabs the minimum bet and places it
                    cy.get('.expandedChipStackItem--6_BRs').eq(1).click()
                    cy.get('canvas').click(631, 632)

                    //Records the bet amount and then clicks on the "Deal Now" option
                    cy.get('[data-role="total-bet-label__value"]').invoke('text').then(betAmount => {
                        cy.log(betAmount)
                        cy.get('[data-role="dealNow"]').click()
                        cy.get('[data-role="stand"]').eq(1).click()

                        //Waits for the round to finish, then grabs the win amount and compares balances
                        cy.wait(20000)
                        cy.get('[data-role="total-bet-label__value"]').invoke('text').then(winAmount => {
                            cy.log(winAmount)
                            cy.get('[data-role="balance-label__value"]').invoke('text').then(secondBalanceTaken => {
                                if (firstBalanceTaken === secondBalanceTaken) {
                                    expect(winAmount).to.eq(betAmount)
                                } else {
                                    expect(firstBalanceTaken).to.not.eq(secondBalanceTaken)
                                }
                            })
                            cy.get('[data-role="unseatButton"]').eq(3).click()
                    


                        });

                        
                    })

                })

            })
        //Closes the game window
        cy.get('.cy-game-navbar-close-button').should('be.visible').click()

        //Grabs the latest history and compares it with the old one.
        cy.wait(10000)
        cy.reload()

        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory => {
            expect(newHistory).to.not.equal(firstHistory)
        })

        })

    })


})

