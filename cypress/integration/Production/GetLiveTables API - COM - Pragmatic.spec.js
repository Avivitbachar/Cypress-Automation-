/// <reference types="cypress" />

describe('GetLiveTables API - COM - Pragmatic - PROD', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://www.888casino.com/');

    })

    it('Check GetLiveTables for Pragmatic', () => {


        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('RTGAutoGIB', 'Auto1234!')

        cy.intercept('POST', 'https://cgp.safe-iplay.com/cgpapi/liveFeed/GetLiveTables').as('GetLiveTables')
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

