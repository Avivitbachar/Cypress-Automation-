/// <reference types="cypress" />



describe('Evolution - COM - Mirage - Immersive Roullete', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('www.888casino.com')
    })

    it('Launch + spin + check history', () => {


        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigcanad', '12345678')

        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Gaming History').click()

        //Grabs the first history ID it finds
        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory=>{
            cy.log(firstHistory)
        
             //Launches a game based on the provided name (custom command).
        cy.launchGameMiragePC('Immersive Roulette')



        //Gives the game time to load.
        cy.wait(20000)

        //for loop for clicking on the reduce bet button (applicable for Pragmatic games).

cy.visit('https://mirage-orbit-latest-eu.888casino.com/gaming-history/#page/game/2330110/real/1')
        //Grabs the iframe and clicks on the bet button.
        cy.getIframe('.cgp-game-iframe').within(() => {
           cy.get('.footerMiddle--3yPRd')
           cy.wait(5000)
           cy.get('[data-role="balance-label__value"]').invoke('text').as('firstBalanceTaken')    
           cy.get('[data-bet-spot-id="red"]').click()     
            //cy.find('#cp-playerBalance').invoke('text').then(balancePlayer => {
            //    cy.log(balancePlayer);
            //});
            cy.wait(50000)
            cy.get('[data-role="balance-label__value"]').invoke('text').then(secondBalanceTaken=>{
                expect('@firstBalanceTaken').to.not.eq(secondBalanceTaken)
            })
        });

        cy.get('.cy-game-navbar-close-button').should('be.visible').click()

        //Grabs now the newest balance it finds in history and compares it with the old one.
      cy.wait(10000)
      cy.reload()
      cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory=>{
        expect(newHistory).to.not.equal(firstHistory)
      })
        })
       

    })


})

