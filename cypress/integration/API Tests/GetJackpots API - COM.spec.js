/// <reference types="cypress" />

describe('GetJackpots API - COM', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"Regulation":{"reminderIntervals":"0,1,3,5"},"Game":{"GRS":{"GameState":"LATEST","AdditionalState":"LATEST"}},"OAuth2":{"fakeClientIP":"5.62.92.0"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2360001],"gameTypes":"2360001"}}');

    })

    it('GetJackpots API check', () => {

        cy.get('.cy-modal-dialog-consumer-content').within(()=>{
            cy.get('[placeholder="Environment password"]').type('orbit1234')
            cy.get('[type="submit"]').click()
        })
        
        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigcanad', '12345678')

        cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/liveFeed/GetJackpots').as('GetJackpots')
        cy.wait('@GetJackpots')
        cy.get('@GetJackpots').then(jackpotsData=>{
            let sectionEight = jackpotsData.response.body.GamesJackpots[130211]
            let redtiger = jackpotsData.response.body.GamesJackpots[2360001]
            cy.log('**---888 check---**').then(()=>{
                expect(sectionEight.AmountInCents).to.not.equal(0)
            })
            cy.log(`**---RedTiger check---**`).then(()=>{
                expect(redtiger.AmountInCents).to.not.equal(0)
            })
            
           
        })



    })
})

