/// <reference types="cypress" />

describe('Playtech - COM - NGM - Mirage - AOG RNG Jackpot', () => {

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
         cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory=>{
            cy.log(firstHistory)

            //Launches a game based on the provided name (custom command).
         cy.launchGameMiragePC('Age Of The Gods Roulette')
 
         cy.wait(40000)

         //Grabs the 1st iFrame and takes the balance from within it
         cy.getIframe('.cgp-game-iframe').within(()=>{
             cy.get('#cp-playerBalance').invoke('text').as('firstBalance')
       
             //Grabs the second iFrame and performs the spin    
             cy.getIframe('.gameFrame').within(()=>{
                cy.get('#ngm-uicore2-root').click(598, 583)
                 cy.get('#ngm-uicore2-root').click(1041, 574)
                 cy.wait(20000)
             })

             //Returns to the 1st iframe and compares the balance pre-spin with the post-spin one
             cy.get('#cp-playerBalance').invoke('text').then(secondBalanceTaken=>{
                cy.log(secondBalanceTaken)
                cy.get('@firstBalance').then((yeldedBalance)=>{
                    expect(yeldedBalance).not.eq(secondBalanceTaken)
                })
            
            })
            
         })

         //Closes the game window
         cy.get('.cy-game-navbar-close-button').should('be.visible').click()

         //Goes to the history page, waits for 10secs and then reloads the page, and then compares the history ID it gets with the 1st one.
       cy.wait(10000)
       cy.reload()
       cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory=>{
        expect(newHistory).to.not.equal(firstHistory)
    })
        
        })
         


    })
})

