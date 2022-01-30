/// <reference types="cypress" />

describe ('First test', ()=>{
    
    beforeEach('Access the link', ()=>{
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"OAuth2":{"fakeClientIP":"5.62.92.0"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2380014],"gameTypes":"2380014"}}');
    }) 
   
    it('Launch + spin + check history', ()=>{
        //cy.viewport(1920, 1080);
        cy.login('andreigcanad', '12345678')
        cy.get('.cy-welcome-buttons-container').click()
        cy.contains('Gaming History').click()
        /*let firstRound = cy.get('.cy-gaming-history-game-name').first().invoke('text').then(actualRound =>{
            cy.log(actualRound )
        })*/
        cy.launchGameMirage('Joker Jewels')
        cy.wait(10000)
        for (let i = 0; i < 12; i++) {
            cy.getIframe('.cgp-game-iframe').click(702, 529)
        }
        cy.getIframe('.cgp-game-iframe').click(774, 526)
        cy.wait(20000)
        cy.get('.cy-game-navbar-close-button').should('be.visible').click()
        cy.get('.cy-welcome-buttons-container').click()
        cy.contains('Gaming History').click({force: true})
        cy.get('.cy-gaming-history-game-name').first().invoke('text').then(jokerRound =>{
            if (jokerRound != 'Joker Jewels'){
                for (let i = 0; i < 2; i++) {
                    cy.wait(10000),
                    cy.reload()
                    
                }
                cy.get('.cy-gaming-history-game-name').first().should(jokers=>{
                    expect(jokers).to.contain('Joker Jewels')
                })
            }else {
             
                expect(jokerRound).to.contain('Joker Jewels')
             
            }
        })
       
    })
})

 