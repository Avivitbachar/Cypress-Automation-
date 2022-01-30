/// <reference types="cypress" />

describe('Net Position - UK - RNG - Production- Fire & Ice', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://cgp.safe-iplay.com","server":"https://cgp-cdn2.safe-iplay.com","Skin":{"regulationID":255,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"GBP"},"OAuth2":{"fakeClientIP":"213.219.55.4"}},"orbit":{"server":"https://cgp-cdn2.safe-iplay.com","country":"gbr","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com"}}');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('GenComUsd', 'Test1234!')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)
            cy.intercept('POST', 'https://cgp.safe-iplay.com/cgpapi/game/OpenRealGame').as('openRealGame')
            cy.intercept('POST', 'https://cgp.safe-iplay.com/cgpapi/netPosition/initialize').as('netPosition')
            //Launches a game based on the provided name (custom command).
            cy.launchGameMiragePC('Fire and Ice')
            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })

            //Checks to see that the netposition appears.
            cy.wait('@netPosition')
            cy.get('@netPosition').then(netUKGC => {
                expect(netUKGC.response.statusCode).to.eq(200)
            })

            //Intercept Pariplay Authentication API in order to record the starting balance
            cy.intercept('POST', 'https://rgstorgsgib.pariplaygames.com/client/loadgame').as('pariplayAuthenticate')
            cy.wait('@pariplayAuthenticate')
            cy.get('@pariplayAuthenticate').then(pariplayAuthen => {
                console.log(pariplayAuthen)
                let startBalance = pariplayAuthen.response.body.Status.Balance
                cy.log('**Starting balance is** ' + startBalance)

                cy.wait(30000)
                //Grabs the 1st iFrame and takes the balance from within it
                cy.getIframe('.cy-game-iframe').within(() => {
                    cy.getIframe('#game-iframe').within(() => {

                        cy.intercept('POST', 'https://rgstorgsgib.pariplaygames.com/client/PlaceBet').as('pariplayPostSpin')
                        cy.get('canvas').click(1132, 626)
                        cy.wait(20000)
                        cy.wait('@pariplayPostSpin')
                        cy.get('@pariplayPostSpin').then(pariplayPostBet => {
                            console.log(pariplayPostBet)
                            let afterSpinBalance = pariplayPostBet.response.body.Balance.BalanceAfter
                            let betSum = pariplayPostBet.response.body.Ticket.TotalBet
                            let winSum = pariplayPostBet.response.body.Ticket.TotalWinAmount
                            if (startBalance === afterSpinBalance) {
                                expect(betSum).to.eq(winSum)
                                cy.log('**Bet amount equals win amount, thus balance remains unchanged.**')
                            } else {
                                expect(startBalance).to.not.eq(afterSpinBalance)
                                cy.log('**Starting balance is different than post-spin balance.**')

                            }
                            cy.wrap(afterSpinBalance).as('balancePostSpin')
                            cy.wrap(betSum).as('netPosBet')
                            cy.wrap(winSum).as('netPoswin')
                        })

                    })
                })
            })

            cy.wait(5000)
            cy.get('.cy-regulation-strip-net-position-value').invoke('text').then(netPositionText => {
                cy.log(netPositionText)
                cy.get('@netPoswin').then(netPositionWin => {
                    cy.get('@netPosBet').then(netPositionBet => {
                        const divider = 100
                        if (netPositionBet > netPositionWin) {
                            let sessionResult = ((netPositionBet * divider) - (netPositionWin * divider)) / divider
                            if (sessionResult.toFixed(1)) {
                                let netPositionNumber = Number(netPositionText.slice(2, 6))
                                expect(netPositionNumber).to.eq(sessionResult)
                                cy.log(`**Net Position value is: ${netPositionText}**`)
                            } else if (sessionResult.toFixed(2)) {
                                let netPositionNumber = Number(netPositionText.slice(2, 6))
                                expect(netPositionNumber).to.eq(sessionResult)
                                cy.log(`**Net Position value is: ${netPositionText}**`)
                            }

                        } else {
                            let sessionResult = ((netPositionWin * divider) - (netPositionBet * divider)) / divider
                            if (sessionResult.toFixed(1)) {
                                let netPositionNumber = Number(netPositionText.slice(1, 5))
                                expect(netPositionNumber).to.eq(sessionResult)
                                cy.log(`**Net Position value is: ${netPositionText}**`)
                            } else if (sessionResult.toFixed(2)) {
                                let netPositionNumber = Number(netPositionText.slice(1, 6))
                                expect(netPositionNumber).to.eq(sessionResult)
                                cy.log(`**Net Position value is: ${netPositionText}**`)
                            }


                        }
                        cy.wait(10000)
                        //Second bet starts here
                        cy.getIframe('.cy-game-iframe').within(() => {
                            cy.getIframe('#game-iframe').within(() => {

                                cy.intercept('POST', 'https://rgstorgsgib.pariplaygames.com/client/PlaceBet').as('pariplayPostSpin')
                                cy.get('canvas').click(1132, 626)
                                cy.wait(20000)
                                cy.wait('@pariplayPostSpin')
                                cy.get('@pariplayPostSpin').then(pariplayPostBet => {
                                    cy.get('@balancePostSpin').then(afterSpinBalanceFirst => {
                                        console.log(pariplayPostBet)
                                        let afterSpinBalanceTwo = pariplayPostBet.response.body.Balance.BalanceAfter
                                        let betSum = pariplayPostBet.response.body.Ticket.TotalBet
                                        let winSum = pariplayPostBet.response.body.Ticket.TotalWinAmount
                                        let totalBetSum = pariplayPostBet.response.body.SessionData.TotalBet
                                        let totalWinSum = pariplayPostBet.response.body.SessionData.TotalWin
                                        if (afterSpinBalanceTwo === afterSpinBalanceFirst) {
                                            expect(betSum).to.eq(winSum)
                                            cy.log('**Bet amount equals win amount, thus balance remains unchanged.**')
                                        } else {
                                            expect(afterSpinBalanceTwo).to.not.eq(afterSpinBalanceFirst)
                                            cy.log('**Starting balance is different than post-spin balance.**')

                                        }
                                        cy.wrap(totalBetSum).as('netPosTotalBet')
                                        cy.wrap(totalWinSum).as('netPosTotalWin')
                                    })

                                })

                            })
                        })
                        /*netPositionText = the first net position
                        netPositionBet = first round bet value
                        netPositionWin = first round win (if any)
                        */
                        cy.wait(5000)
                        cy.get('.cy-regulation-strip-net-position-value').invoke('text').then(netPositionTextTwo => {
                            cy.log(netPositionTextTwo)
                            cy.get('@netPosTotalWin').then(netPositionTotalWin => {
                                cy.get('@netPosTotalBet').then(netPositionTotalBet => {
                                    const divider = 100
                                    if (netPositionTotalBet > netPositionTotalWin) {
                                        let sessionResult = ((netPositionTotalBet * divider) - (netPositionTotalWin * divider)) / divider
                                        if (sessionResult.toFixed(1)) {
                                            let netPositionNumberTwo = Number(netPositionTextTwo.slice(2, 6))
                                            expect(netPositionNumberTwo).to.eq(sessionResult)
                                            cy.log(`**Net Position value is: ${netPositionTextTwo}**`)
                                        } else if (sessionResult.toFixed(2)) {
                                            let netPositionNumberTwo = Number(netPositionTextTwo.slice(2, 6))
                                            expect(netPositionNumberTwo).to.eq(sessionResult)
                                            cy.log(`**Net Position value is: ${netPositionTextTwo}**`)
                                        }

                                    } else {
                                        let sessionResult = ((netPositionTotalWin * divider) - (netPositionTotalBet * divider)) / divider
                                        if (sessionResult.toFixed(1)) {
                                            let netPositionNumberTwo = Number(netPositionTextTwo.slice(1, 5))
                                            expect(netPositionNumberTwo).to.eq(sessionResult)
                                            cy.log(`**Net Position value is: ${netPositionTextTwo}**`)
                                        } else if (sessionResult.toFixed(2)) {
                                            let netPositionNumberTwo = Number(netPositionTextTwo.slice(1, 6))
                                            expect(netPositionNumberTwo).to.eq(sessionResult)
                                            cy.log(`**Net Position value is: ${netPositionTextTwo}**`)
                                        }


                                    }


                                })
                            })
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
