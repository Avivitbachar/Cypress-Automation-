/// <reference types="cypress" />

describe('Playtech - COM - GPAS - Mirage - Book of Kings', () => {

  beforeEach('Access the link', () => {
    cy.viewport(1376, 768);
    cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":255,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"GBP"},"OAuth2":{"fakeClientIP":"213.219.55.4"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"gbr","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2350016,2330032,2330180,2330110,2380010,2380001,2010016],"gameTypes":"2350016,2330032,2330180,2330110,2380010,2380001,2010016"}}');

  })

  it('Launch + spin + check history', () => {
    //Logs in to website using the hardcoded credentials (custom command).
    cy.orbitBypass()
    cy.loginPC('andreiguk3', '12345678')

    //Gets the history button and clicks it.
    cy.get('.cy-profile-picture').click()
    cy.contains('Gaming History').click()

    cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(firstHistory => {
      cy.log(firstHistory)
      cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/game/OpenRealGame').as('openRealGame')
      cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/netPosition/initialize').as('netPosition')

      //Launches a game based on the provided name (custom command).
      cy.launchGameMiragePC('Book of Kings')
      cy.wait('@openRealGame')
      cy.get('@openRealGame').then(realGame => {
        console.log(realGame)
        expect(realGame.response.statusCode).to.eq(200)
      })

      //Checks to see that the netposition appears.
      cy.wait('@netPosition')
      cy.get('@netPosition').then(netUKGC => {
        expect(netUKGC.response.statusCode).to.eq(200)
      })
      cy.wait(40000)
      cy.getIframe('.cgp-game-iframe').within(() => {

        cy.get('#gdkContainer').click(629, 598)
        //for loop for clicking on the reduce bet button (applicable for Pragmatic games).
        for (let i = 0; i < 8; i++) {
          //custom command
          cy.get('#gdkContainer').click(814, 597)
        }
        cy.get('#gdkContainer').click(627, 595)
        cy.wait(20000)
      })

      cy.get('.cy-game-navbar-close-button').should('be.visible').click()

      //Grabs now the newest balance it finds in history and compares it with the old one.
      cy.wait(10000)
      cy.reload()
      cy.get('.cy-gaming-history-game-name').first().next().invoke('text').then(newHistory => {
        expect(newHistory).to.not.equal(firstHistory)
      })

    })



  })
})

