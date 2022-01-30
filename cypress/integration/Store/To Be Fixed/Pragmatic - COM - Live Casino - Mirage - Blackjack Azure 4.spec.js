/// <reference types="cypress" />

describe('Pragmatic - COM - Live Casino - Mirage - Blackjack Azure 4', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":16,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"OAuth2":{"fakeClientIP":"5.62.83.160"},"Regulation":{"reminderIntervals":"0,1,3,5"},"Game":{"GRS":{"GameState":"LATEST","AdditionalState":"LATEST"}}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"deu","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2380057],"gameTypes":"2380057"}}');
       
    })

    it('Launch + spin + check history', () => {
         //Logs in to website using the hardcoded credentials (custom command).
         cy.loginPC('andreigcanad', '12345678')

         //Gets the history button and clicks it.
         cy.get('.cy-profile-picture').click()
         cy.contains('Gaming History').click()
 
         // Grabs the 1st history ID it finds
         cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory=>{
            cy.log(firstHistory)

        cy.get('.cy-menu-item').contains('Live Casino').click()
        cy.get('.cy-live-casino-filter-button-all-blackjack').click()
        cy.get('.cy-live-casino-grid-item-2380057').within(()=>{
            cy.get('.cy-live-casino-grid-item-thumbnail-image').should('have.attr', 'src')
            cy.get('.cy-live-casino-grid-item-bet-interval').should('be.visible')
            cy.get('.cy-live-casino-grid-item-infobar-game-seats-count').should('be.visible')
            cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
            cy.get('.cy-live-casino-grid-item-thumbnail-overlay').click()
        })
        cy.wait('@openRealGame')
        cy.get('@openRealGame').then(realGame => {
            console.log(realGame)
            expect(realGame.response.statusCode).to.eq(200)
        })
        cy.wait(40000)
 
        cy.getIframe('.cy-game-iframe').within(()=>{
            cy.get('.bal_div').find('label').invoke('text').as('firstBalanceTaken')
            cy.get('.activeviewtransform')
            cy.get('#dz48').click()
            cy.wait(30000)
            cy.get('.bal_div').find('label').invoke('text').then(secondBalanceTaken=>{
                cy.log(secondBalanceTaken)
                cy.get('@firstBalanceTaken').then((yeldedBalance)=>{
                    expect(yeldedBalance).to.not.eq(secondBalanceTaken)
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
       cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory=>{
        expect(newHistory).to.not.equal(firstHistory)
    })
        
        })
         


    })
})

