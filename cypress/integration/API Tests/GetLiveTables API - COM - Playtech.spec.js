/// <reference types="cypress" />

describe('GetLiveTables API - COM - Playtech', () => {

    beforeEach('Access the link', () => {
        cy.viewport(1376, 768);
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":4,"brandID":0,"subBrandID":0},"Currency":{"anonymousCurrency":"USD"},"Regulation":{"reminderIntervals":"0,1,3,5"},"Game":{"GRS":{"GameState":"LATEST","AdditionalState":"LATEST"}},"OAuth2":{"fakeClientIP":"5.62.92.0"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"alb","language":"eng","iso2":"en","publicationID":1841,"cmsSource":"https://www.888casino.com","addedGameTypesFromSdm":[2330017,2330042,2330084],"gameTypes":"2330017,2330042,2330084"}}');

    })

    it('Check GetLiveTables for Playtech', () => {

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
            let playtechBaccarat = liveTablesData.response.body.LiveTables[2330084]
            let playtechRoulette = liveTablesData.response.body.LiveTables[2330017]
            let playtechBlackjack = liveTablesData.response.body.LiveTables[2330042]
            cy.log('**---Playtech Baccarat---**').then(()=>{
        
                cy.wrap(playtechBaccarat.Dealer).should('not.be.empty')
                cy.log(`**Value for Dealer is: ${playtechBaccarat.Dealer}**`)

                cy.wrap(playtechBaccarat.IsOpen).should('be.true')
                cy.log(`**Value for IsOpen parameter is: ${playtechBaccarat.IsOpen}**`)

                cy.wrap(playtechBaccarat.Name).should('not.be.empty')
                cy.log(`**Value for Name is: ${playtechBaccarat.Name}**`)

                cy.wrap(playtechBaccarat.Players).should('not.be.null')
                cy.log(`**Value for Players active is: ${playtechBaccarat.Players}**`)

                cy.wrap(playtechBaccarat.Seats).should('not.be.null')
                cy.log(`**Value for amount of Seats is: ${playtechBaccarat.Seats}**`)

                cy.wrap(playtechBaccarat.SeatsTaken).should('be.empty')
                cy.log(`**Value for SeatsTaken is: ${playtechBaccarat.SeatsTaken.length}**`)

                cy.wrap(playtechBaccarat.TableImage).should('not.be.empty')
                cy.log(`**Value for TableImage is ${playtechBaccarat.TableImage}**`)

                for (let i = 0;i<playtechBaccarat.Limits.length;i++){
                    cy.wrap(playtechBaccarat.Limits[i].currency).should('not.be.empty')                 
                    cy.wrap(playtechBaccarat.Limits[i].maxBet).should('not.equal', 0)
                    cy.wrap(playtechBaccarat.Limits[i].minBet).should('not.equal', 0)
                    cy.log(`**Currency ${playtechBaccarat.Limits[i].currency} has max bet ${playtechBaccarat.Limits[i].maxBet} and min bet: ${playtechBaccarat.Limits[i].minBet}**`)  
                }
                
            }
            )
            cy.log('**---Playtech Roulette---**').then(()=>{
        
                cy.wrap(playtechRoulette.Dealer).should('not.be.empty')
                cy.log(`**Value for Dealer is: ${playtechRoulette.Dealer}**`)

                cy.wrap(playtechRoulette.IsOpen).should('be.true')
                cy.log(`**Value for IsOpen parameter is: ${playtechRoulette.IsOpen}**`)

                cy.wrap(playtechRoulette.Name).should('not.be.empty')
                cy.log(`**Value for Name is: ${playtechRoulette.Name}**`)

                cy.wrap(playtechRoulette.Players).should('not.be.null')
                cy.log(`**Value for Players active is: ${playtechRoulette.Players}**`)

                cy.wrap(playtechRoulette.RouletteLast5Numbers).should('have.length', 5)
                cy.log(`**Value for Roulette Number length is: ${playtechRoulette.RouletteLast5Numbers.length} and the numbers are: ${playtechRoulette.RouletteLast5Numbers}**`)

                cy.wrap(playtechRoulette.Seats).should('not.be.null')
                cy.log(`**Value for available Seats is: ${playtechBaccarat.Seats}**`)

                cy.wrap(playtechRoulette.SeatsTaken).should('be.empty')
                cy.log(`**Value for SeatsTaken is: ${playtechRoulette.SeatsTaken.length}**`)

                cy.wrap(playtechRoulette.TableImage).should('not.be.empty')
                cy.log(`**Value for TableImage is ${playtechRoulette.TableImage}**`)

                for (let i = 0;i<playtechRoulette.Limits.length;i++){
                    cy.wrap(playtechRoulette.Limits[i].currency).should('not.be.empty')                 
                    cy.wrap(playtechRoulette.Limits[i].maxBet).should('not.equal', 0)
                    cy.wrap(playtechRoulette.Limits[i].minBet).should('not.equal', 0)
                    cy.log(`**Currency ${playtechRoulette.Limits[i].currency} has max bet ${playtechRoulette.Limits[i].maxBet} and min bet: ${playtechRoulette.Limits[i].minBet}**`)  
                }
            })
            cy.log('**---Playtech Blackjack---**').then(()=>{
        
                cy.wrap(playtechBlackjack.Dealer).should('not.be.empty')
                cy.log(`**Value for Dealer is: ${playtechRoulette.Dealer}**`)

                cy.wrap(playtechBlackjack.IsOpen).should('be.true')
                cy.log(`**Value for IsOpen parameter is: ${playtechBlackjack.IsOpen}**`)

                cy.wrap(playtechBlackjack.Name).should('not.be.empty')
                cy.log(`**Value for Name is: ${playtechBlackjack.Name}**`)

                cy.wrap(playtechBlackjack.Players).should('not.be.null')
                cy.log(`**Value for Players active is: ${playtechBlackjack.Players}**`)

                cy.wrap(playtechBlackjack.Seats).should('equal', 7)
                cy.log(`**Value for available Seats is: ${playtechBlackjack.Seats}**`)

                cy.wrap(playtechBlackjack.SeatsTaken).should('exist')
                cy.log(`**Value for SeatsTaken is: ${playtechBlackjack.SeatsTaken.length}**`)

                cy.wrap(playtechBlackjack.TableImage).should('not.be.empty')
                cy.log(`**Value for TableImage is ${playtechBlackjack.TableImage}**`)

                for (let i = 0;i<playtechBlackjack.Limits.length;i++){
                    cy.wrap(playtechBlackjack.Limits[i].currency).should('not.be.empty')                 
                    cy.wrap(playtechBlackjack.Limits[i].maxBet).should('not.equal', 0)
                    cy.wrap(playtechBlackjack.Limits[i].minBet).should('not.equal', 0)
                    cy.log(`**Currency ${playtechBlackjack.Limits[i].currency} has max bet ${playtechBlackjack.Limits[i].maxBet} and min bet: ${playtechBlackjack.Limits[i].minBet}**`)  
                }
              
            })
           
        })



    })
})

