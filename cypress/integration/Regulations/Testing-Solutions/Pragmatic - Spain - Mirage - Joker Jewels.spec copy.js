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
            //cy.getIframe('.cgp-game-iframe').click(934, 608)
            cy.intercept('https://888casino.prerelease-env.biz/gs2c/v3/gameService').as('GetService')
        
        cy.wait('@GetService')
        cy.get('@GetService').then(xhr=>{
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.response.body).to.contain.text('balance_bonus=0.00')
           
        })

        //Launch - Add authtoken - check description = ok (https://888casino.prerelease-env.biz/gs2c/stats.do?mgckey=AUTHTOKEN@94d43a68ead6d418551d8ba63642aef3ee84a66a261b2f527b548756abc4968d~stylename@888_888casinoes~SESSION@c1852159-bbbc-43a6-ad8e-462f7be13d9b&channel=desktop)
        //1st call should contain a balance (like line 63)
        //Launch - Check gameService is received

        cy.wait(20000)
//tw=0.00&balance=102.76&index=4&balance_cash=102.76&balance_bonus=0.00&na=s&stime=1624024596000&sa=9,6,5,6,4&sb=8,8,6,6,6&sh=3&c=0.01&sver=5&counter=8&l=5&s=5,6,6,6,7,5,8,5,9,7,8,8,6,6,7&w=0.00
//https://888casino.prerelease-env.biz/gs2c/v3/gameService

//tw=0.10&def_s=8,7,4,9,8,6,7,4,9,8,3,7,7,6,6&balance=102.26&action=doCollect&cfgs=3840&reel1=5,5,5,8,8,8,8,8,7,7,7,7,7,9,9,9,3,5,9,3,4,4,4,1,8,4,6,6,6,8,7,6&ver=2&reel0=7,3,5,8,8,8,5,1,8,6,6,6,7,4,9,9,9,9,8,6,6,6,4&index=1&balance_cash=102.26&def_sb=4,7,7,7,6&def_sa=7,3,5,8,8&reel3=9,6,6,6,6,3,9,7,6,8,7,1,5,5,5,8,5,9,7,6,4&reel2=7,7,7,7,4,4,6,7,3,3,3,5,9,9,9,7,6,8,8,8,4,6,9,1,9,5,3,8&reel4=4,7,7,7,6,5,5,9,9,9,6,1,7,8,8,8,7,3,7,7,4,9,3,6,5,8,9,9&balance_bonus=0.00&na=s&scatters=1~250,50,10,0,0~0,0,0,0,0~1,1,1,1,1&gmb=0,0,0&rt=d&l0=0~0.05~5~6&l1=4~0.05~10~6&stime=1624026403962&sa=4,9,4,5,7&sb=9,1,7,8,9&sc=0.01,0.02,0.05,0.10,0.20,0.50,1.00,2.00,3.00,5.00,10.00,15.00,20.00&defc=0.20&sh=3&wilds=2~0,0,0~1,1,1&bonuses=0&fsbonus=&c=0.01&sver=5&counter=2&l=5&paytable=0,0,0,0,0;0,0,0,0,0;0,0,0,0,0;5000,1000,100,0,0;1000,200,50,0,0;1000,200,50,0,0;200,50,20,0,0;200,50,20,0,0;200,40,20,0,0;200,40,20,5,0&rtp=96.50&s=1,9,7,9,7,9,9,4,9,6,9,7,6,8,3&w=0.10

            //Assert that after the bet the bet strip and session balance strip have changed
            /*cy.get('.cgp-stripe').then(newRegulationStrip=>{
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
            })*/
        })

        
    })
})

