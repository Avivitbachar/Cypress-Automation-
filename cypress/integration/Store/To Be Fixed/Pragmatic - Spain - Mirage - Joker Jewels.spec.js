/// <reference types="cypress" />

describe('Pragmatic - Spain PC - Mirage', () => {

    beforeEach('Open mirage link', () => {
        cy.viewport(1376, 768);  
        cy.visit('https://mirage-orbit-latest-eu.888casino.com#clientData={"sdk":{"api":"https://mirage-cgp-latest-eu.888casino.com","server":"https://mirage-cgp-latest-eu.888casino.com","Skin":{"regulationID":2,"brandID":58,"subBrandID":82},"Currency":{"anonymousCurrency":"EUR"}},"orbit":{"server":"https://mirage-cgp-latest-eu.888casino.com","country":"esp","language":"spa","iso2":"es","publicationID":1884,"cmsSource":"https://www.888casino.es","addedGameTypesFromSdm":[2380014],"gameTypes":"2380014"}}');
    })

    it('Launch + spin + check balance', () => {
        

        //Logs in to website using the hardcoded credentials (custom command).
        cy.loginPC('andreigesrea', '12345678')
        
        //Gets the history button and clicks it.
        cy.get('.cy-profile-picture').click()
        cy.contains('Historial de juego').click()

           //Records the 1st balance value it finds.
           cy.get('.cy-gaming-history-bankroll-value').first().then(firstBalance => {
            let oldBalance = firstBalance.text()
            cy.log(oldBalance)
        
            cy.launchGameMiragePC('Joker Jewels')

        //Sets the limits for Spain (maximum values on both time and session limit)
        cy.get('.cgp-spain-game-limit-selection-block').should('be.visible')
        cy.get('.cy-spain-game-limit-duration-select').select('720')
        cy.get('select.cy-spain-game-limit-loss-limit-select option').eq(1).invoke('val').then((val)=>{      
            cy.get('select.cy-spain-game-limit-loss-limit-select').select(val)
          })
        cy.get('.cy-spain-game-limit-continue-play-button').click()
        
        
            //Gives the game time to load.
            cy.wait(20000)

            //Assert that the regulation strips are appearing ok
            cy.get('.cgp-stripe').then(regulationStrip=>{
                let betStrip = regulationStrip.find('#session_bets').children()
                let winStrip = regulationStrip.find('#session_wins').children()
                let sessionBalanceStrip = regulationStrip.find('#session_balance').children()
                expect(betStrip).to.contain.text('Importes de apuesta total:0,00')
                expect(winStrip).to.contain.text('Importes de ganancia total:0,00')
                expect(sessionBalanceStrip).to.contain.text('Saldo de la sesión:0,00')
            })

            //for loop for clicking on the reduce bet button (applicable for Pragmatic games).
            for (let i = 0; i < 12; i++) {
                //custom command
                cy.getIframe('.cgp-game-iframe').click(846, 626)
            }

            //Grabs the iframe and clicks on the bet button.
            cy.getIframe('.cgp-game-iframe').click(934, 608)
            cy.wait(20000)

            //Assert that after the bet the bet strip and session balance strip have changed
            cy.get('.cgp-stripe').then(newRegulationStrip=>{
                let newBetStrip = newRegulationStrip.find('#session_bets').children()
                let newSessionBalanceStrip = newRegulationStrip.find('#session_balance').children()
                expect(newBetStrip).to.contain.text('Importes de apuesta total:0,05')
                expect(newSessionBalanceStrip).to.not.contain.text('Saldo de la sesión:0,00')
            })
                        
            //Grabs the close button and clicks it.
            cy.get('.cy-game-navbar-close-button').should('be.visible').click()

            //Gets the modal (closed session popup) and asserts that the placed bet was registered
            cy.get('.cy-modal-content div').should('contain.text', 'Apuestas totales: 0,05€')
            cy.get('.cy-modal-dialog-buttons-area').find('button').click()

            //Goes to the history again.
            cy.get('.cy-profile-picture').click()
            cy.contains('Historial de juego').click()
            
            //Gives it time and reloads to have the highest chance of the history round being written.
            cy.wait(10000)
            cy.reload()

            //Grabs now the newest balance it finds in history and compares it with the old one.
            cy.get('.cy-gaming-history-bankroll-value').first().then(balance => {
                let newBalance = balance.text()
                expect(oldBalance).to.not.eq(newBalance)
               // cy.get('.cy-gaming-history-bet-value').first().should('have.text', '$0.05')
            })
        })

        
    })
})

