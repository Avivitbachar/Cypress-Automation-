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
        cy.get('.cy-gaming-history-bankroll-value').eq(1).then(firstBalance=>{
            let oldBalance = firstBalance.text()
            cy.wrap(oldBalance).as('balanceFirst')
        })

        cy.get('.cy-gaming-history-bankroll-value').first().then(balance=>{
           let newBalance = balance.text()
           cy.wrap(newBalance).as('newestBalance')
          
  
        })
        // if clause and else clause need to be switched
     
        
       
    })
    it('compare balances', ()=>{

        cy.get('.cy-welcome-buttons-container').click()
        cy.contains('Gaming History').click()

        expect(this.balanceFirst).to.not.eq(this.newestBalance)
    })
})

 