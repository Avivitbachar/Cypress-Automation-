/// <reference types="cypress" />

// REQUIRES FURTHER CODING AS IT CURRENTLY PLACES A BET ON ALL POSITIONS

describe('Playtech - UK - Live Casino - Mirage - All Bets Blackjack', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":255,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"GBP"},"OAuth2":{"fakeClientIP":"213.219.55.4"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"gbr","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2330024,2330110,2330185,2330180,2330032],"gameTypes":"2330024,2330110,2330185,2330180,2330032"}}');

    })

    it('Launch + spin + check history', () => {
        //Logs in to website using the hardcoded credentials (custom command).
        cy.orbitBypass()
        cy.loginPC('andreiguk3', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        // Grabs the 1st history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
            cy.log(firstHistory)

            cy.get('.cy-menu-item').contains('Live Casino').click()
            cy.get('.cy-live-casino-filter-button-all-blackjack').click()
            cy.get('.cy-live-casino-grid-item-2330032').within(() => {
                cy.get('.cy-live-casino-grid-item-thumbnail-image').should('have.attr', 'src')
                cy.get('.cy-live-casino-grid-item-bet-interval').should('be.visible')
                cy.get('.cy-live-casino-grid-item-infobar-game-seats-count').should('be.visible')
                cy.get('.cy-live-casino-grid-item-infobar-dealer-name').should('be.visible')
                cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
                cy.get('.cy-live-casino-grid-item-thumbnail-overlay').click()
            })

            cy.wait('@openRealGame')
            cy.get('@openRealGame').then(realGame => {
                console.log(realGame)
                expect(realGame.response.statusCode).to.eq(200)
            })

            cy.wait(20000)

            cy.getIframe('.cy-game-iframe').within(() => {
                cy.get('[data-automation-locator="footer.balance"]').invoke('text').as('firstBalanceTaken').then(balanceValidation => {
                    expect(balanceValidation).to.not.eq('$ 0')
                })
                cy.get('.abjl-bet-place_active')
                cy.get('.abjl-bet-place__ante-label').click({force:true})
               

                cy.get('[data-automation-locator="footer.betAmount"]').then(bet => {
                    let betAmount = bet.text()
                    cy.log(betAmount)
                })
                cy.get('.notification-text').should('have.text', 'Bet confirmed')
                cy.get('.action-button_stand').click()

                cy.wait(30000)
                cy.get('[data-automation-locator="footer.winAmount"]').then(win => {
                    let winAmount = win.text()
                    cy.log(winAmount)
                })
                cy.get('[data-automation-locator="footer.balance"]').invoke('text').then(secondBalanceTaken => {
                    cy.log(secondBalanceTaken)
                    cy.get('@firstBalanceTaken').then((yeldedBalance) => {
                        if (yeldedBalance === secondBalanceTaken) {
                            expect(betAmount).to.eq(winAmount)
                            cy.log('Bet amount equals win amount, thus balance remains unchanged.')
                        } else {
                            expect(yeldedBalance).to.not.eq(secondBalanceTaken)
                            cy.log('Starting balance is different than post-spin balance.')
                        }

                    })
                })
            })
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

