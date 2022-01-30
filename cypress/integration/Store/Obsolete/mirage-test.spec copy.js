/// <reference types="cypress" />

describe ('First test', ()=>{
    
    beforeEach('Access the link', ()=>{
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"OAuth2":{"fakeClientIP":"5.62.92.0"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2380014],"gameTypes":"2380014"}}');
    }) 
   
    it('Launch + spin', ()=>{
        //cy.viewport(1920, 1080);
        cy.login('andreigcanad', '12345678')
        cy.get('.cy-welcome-buttons-container').click()
        cy.contains('Gaming History').click()
        let firstRound = cy.get('.cy-gaming-history-game-name').first().invoke('text').then(actualRound =>{
            cy.log(actualRound )
        })
        cy.launchJokerJewelsMirage()
        cy.wait(10000)


        for (let i = 0; i < 12; i++) {
            cy.getIframe('.cgp-game-iframe').click(702, 529)
        }
        cy.getIframe('.cgp-game-iframe').click(774, 526)
        cy.wait(5000)
        //.click(700, 548)
        //.click(774, 526)
        cy.get('.cy-game-navbar-close-button').should('be.visible').click()

        cy.get('.cy-welcome-buttons-container').click()
        cy.contains('Gaming History').click({force: true})
     
        let firstDisplay = document.getElementsByClassName('.cy-gaming-history-game-name')  
        let newRound = firstDisplay[0]
        if (newRound != 'Joker Jewels'){
            for (let i = 0; i < 5; i++) {
                cy.wait(5000),
                cy.reload(),
                cy.get('.cy-gaming-history-game-name').first().invoke('text').should('have.text', 'Joker Jewels')
            } 
        }else {
            newRound.should('have.value', 'Joker Jewels')
        }
        /* cy.get('.cy-gaming-history-game-name').first().invoke('text').then(jokerRound =>{
            if (jokerRound != 'Joker Jewels'){
                for (let i = 0; i < 5; i++) {
                    cy.wait(5000),
                    cy.reload(),
                };
                    cy.get('.cy-gaming-history-game-name').first().invoke('text').should('have.text', 'Joker Jewels') 
            }else {
                cy.wrap(jokerRound).should('have.text', 'Joker Jewels')
            }
        })*/
       
    })
})

 