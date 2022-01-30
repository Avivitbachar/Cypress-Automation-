/// <reference types="cypress" />

describe('First test', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2380014,2380001],"gameTypes":"2380014,2380001"}}');
       
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

        cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory=>{
            expect(newHistory).to.not.equal(firstHistory)
        })
     })
    

       


    })
})

