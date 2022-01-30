/// <reference types="cypress" />

describe('GetLiveTables API - COM - Pragmatic', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"Regulation":{"reminderIntervals":"0,1,3,5"},"Game":{"GRS":{"GameState":"LATEST","AdditionalState":"LATEST"}},"OAuth2":{"fakeClientIP":"5.62.92.0"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2380010,2380045,2380061],"gameTypes":"2380010,2380045,2380061"}}');

    })

    it('Check GetLiveTables for Pragmatic', () => {

        cy.get('.cy-modal-dialog-consumer-content').within(()=>{
            cy.get('[placeholder="Environment password"]').type('orbit1234')
            cy.get('[type="submit"]').click()
        })
        
        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigcanad', '12345678')

        cy.intercept('POST', 'https://mirage-cgp-latest-eu.888casino.com/cgpapi/liveFeed/GetLiveTables').as('GetLiveTables')
        cy.get('.cy-menu-links-group').contains('Live Casino').click()
        cy.wait('@GetLiveTables')
        cy.get('@GetLiveTables').then(liveTablesData=>{
            console.log(liveTablesData)
            let pragmaBaccarat = liveTablesData.response.body.LiveTables[2380045]
            let pragmaRoulette = liveTablesData.response.body.LiveTables[2380010]
            let pragmaBlackjack = liveTablesData.response.body.LiveTables[2380061]
            cy.log('**---Pragmatic Baccarat---**').then(()=>{
        
                cy.wrap(pragmaBaccarat.Dealer).should('not.be.empty')
                cy.log(`**Value for Dealer is: ${pragmaBaccarat.Dealer}**`)

                cy.wrap(pragmaBaccarat.IsOpen).should('be.true')
                cy.log(`**Value for IsOpen parameter is: ${pragmaBaccarat.IsOpen}**`)

                cy.wrap(pragmaBaccarat.Name).should('not.be.empty')
                cy.log(`**Value for Name is: ${pragmaBaccarat.Name}**`)

                cy.wrap(pragmaBaccarat.Players).should('not.be.null')
                cy.log(`**Value for Players active is: ${pragmaBaccarat.Players}**`)

                cy.wrap(pragmaBaccarat.Seats).should('not.be.null')
                cy.log(`**Value for amount of Seats is: ${pragmaBaccarat.Seats}**`)

                cy.wrap(pragmaBaccarat.SeatsTaken).should('be.empty')
                cy.log(`**Value for SeatsTaken is: ${pragmaBaccarat.SeatsTaken.length}**`)

                cy.wrap(pragmaBaccarat.TableImage).should('not.be.empty')
                cy.log(`**Value for TableImage is ${pragmaBaccarat.TableImage}**`)

                for (let i = 0;i<pragmaBaccarat.Limits.length;i++){
                    cy.wrap(pragmaBaccarat.Limits[i].currency).should('not.be.empty')                 
                    cy.wrap(pragmaBaccarat.Limits[i].maxBet).should('not.equal', 0)
                    cy.wrap(pragmaBaccarat.Limits[i].minBet).should('not.equal', 0)
                    cy.log(`**Currency ${pragmaBaccarat.Limits[i].currency} has max bet ${pragmaBaccarat.Limits[i].maxBet} and min bet: ${pragmaBaccarat.Limits[i].minBet}**`)  
                }
                
            }
            )
            cy.log('**---Pragmatic Roulette---**').then(()=>{
        
                cy.wrap(pragmaRoulette.Dealer).should('not.be.empty')
                cy.log(`**Value for Dealer is: ${pragmaRoulette.Dealer}**`)

                cy.wrap(pragmaRoulette.IsOpen).should('be.true')
                cy.log(`**Value for IsOpen parameter is: ${pragmaRoulette.IsOpen}**`)

                cy.wrap(pragmaRoulette.Name).should('not.be.empty')
                cy.log(`**Value for Name is: ${pragmaRoulette.Name}**`)

                cy.wrap(pragmaRoulette.Players).should('not.be.null')
                cy.log(`**Value for Players active is: ${pragmaRoulette.Players}**`)

                cy.wrap(pragmaRoulette.RouletteLast5Numbers).should('have.length', 5)
                cy.log(`**Value for Roulette Number length is: ${pragmaRoulette.RouletteLast5Numbers.length} and the last numbers are: ${pragmaRoulette.RouletteLast5Numbers}**`)

                cy.wrap(pragmaRoulette.Seats).should('not.be.null')
                cy.log(`**Value for available Seats is: ${pragmaBaccarat.Seats}**`)

                cy.wrap(pragmaRoulette.SeatsTaken).should('be.empty')
                cy.log(`**Value for SeatsTaken is: ${pragmaRoulette.SeatsTaken.length}**`)

                cy.wrap(pragmaRoulette.TableImage).should('not.be.empty')
                cy.log(`**Value for TableImage is ${pragmaRoulette.TableImage}**`)

                for (let i = 0;i<pragmaRoulette.Limits.length;i++){
                    cy.wrap(pragmaRoulette.Limits[i].currency).should('not.be.empty')                 
                    cy.wrap(pragmaRoulette.Limits[i].maxBet).should('not.equal', 0)
                    cy.wrap(pragmaRoulette.Limits[i].minBet).should('not.equal', 0)
                    cy.log(`**Currency ${pragmaRoulette.Limits[i].currency} has max bet ${pragmaRoulette.Limits[i].maxBet} and min bet: ${pragmaRoulette.Limits[i].minBet}**`)  
                }
            })
            cy.log('**---Pragmatic Blackjack---**').then(()=>{
        
                cy.wrap(pragmaBlackjack.Dealer).should('not.be.empty')
                cy.log(`**Value for Dealer is: ${pragmaRoulette.Dealer}**`)

                cy.wrap(pragmaBlackjack.IsOpen).should('be.true')
                cy.log(`**Value for IsOpen parameter is: ${pragmaBlackjack.IsOpen}**`)

                cy.wrap(pragmaBlackjack.Name).should('not.be.empty')
                cy.log(`**Value for Name is: ${pragmaBlackjack.Name}**`)

                cy.wrap(pragmaBlackjack.Players).should('not.be.null')
                cy.log(`**Value for Players active is: ${pragmaBlackjack.Players}**`)

                cy.wrap(pragmaBlackjack.Seats).should('equal', 7)
                cy.log(`**Value for available Seats is: ${pragmaBlackjack.Seats}**`)

                cy.wrap(pragmaBlackjack.SeatsTaken).should('exist')
                cy.log(`**Value for SeatsTaken is: ${pragmaBlackjack.SeatsTaken.length}**`)

                cy.wrap(pragmaBlackjack.TableImage).should('not.be.empty')
                cy.log(`**Value for TableImage is ${pragmaBlackjack.TableImage}**`)

                for (let i = 0;i<pragmaBlackjack.Limits.length;i++){
                    cy.wrap(pragmaBlackjack.Limits[i].currency).should('not.be.empty')                 
                    cy.wrap(pragmaBlackjack.Limits[i].maxBet).should('not.equal', 0)
                    cy.wrap(pragmaBlackjack.Limits[i].minBet).should('not.equal', 0)
                    cy.log(`**Currency ${pragmaBlackjack.Limits[i].currency} has max bet ${pragmaBlackjack.Limits[i].maxBet} and min bet: ${pragmaBlackjack.Limits[i].minBet}**`)  
                }
              
            })
           
        })



    })
})

