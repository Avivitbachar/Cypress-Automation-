/// <reference types="cypress" />

describe('Playtech - MT - NGM - Mirage - AOG RNG Jackpot', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":16,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"OAuth2":{"fakeClientIP":"5.62.83.160"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"deu","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2330180],"gameTypes":"2330180"}}');
       
    })

    it('Launch + spin + check history', () => {
         //Logs in to website using the hardcoded credentials (custom command).
         cy.orbitBypass()
        
         cy.loginPC('andreigmt', '12345678')

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

