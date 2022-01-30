/// <reference types="cypress" />

describe ('Intercepting GetJackpots API', ()=>{
    
    it('Intercept the API', ()=>{
        cy.visit("www.888casino.com");
        cy.get('.cy-login-button-text').click();

        //cy.intercept('**/GetJackpots').as('GetJackpots')
        
        cy.wait('@GetJackpots')
        cy.get('@GetJackpots').then(xhr=>{
            expect(xhr.response.statusCode).to.equal(200)
            console.log(xhr)
            expect(xhr.response.body.GamesJackpots).to.contain('130003')
        })
    })
})