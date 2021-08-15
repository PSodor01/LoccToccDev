/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp();


exports.getMLBGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=32537244e2372228d57f009ba53a1d46&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
          const writeResult = admin
            .firestore()
            .collection("games")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_title,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awaySpread: game.bookmakers[1].markets[1].outcomes[1].point,
              homeSpread: game.bookmakers[1].markets[1].outcomes[0].point,
              awaySpreadOdds: game.bookmakers[1].markets[1].outcomes[1].price,
              homeSpreadOdds: game.bookmakers[1].markets[1].outcomes[0].price,
              awayMoneyline: game.bookmakers[1].markets[0].outcomes[1].price,
              homeMoneyline: game.bookmakers[1].markets[0].outcomes[0].price,
              over: game.bookmakers[1].markets[2].outcomes[0].point,
              under: game.bookmakers[1].markets[2].outcomes[1].point,
              overOdds: game.bookmakers[1].markets[2].outcomes[0].price,
              underOdds: game.bookmakers[1].markets[2].outcomes[1].price,
          })
        })
      })
  }catch(err) {console.error(err.message)}

  })

exports.getNFLGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=32537244e2372228d57f009ba53a1d46&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
          const writeResult = admin
            .firestore()
            .collection("games")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_key,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awaySpread: game.bookmakers[0].markets[1].outcomes[1].point,
              homeSpread: game.bookmakers[0].markets[1].outcomes[0].point,
              awaySpreadOdds: game.bookmakers[0].markets[1].outcomes[1].price,
              homeSpreadOdds: game.bookmakers[0].markets[1].outcomes[0].price,
              awayMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
              homeMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
              over: game.bookmakers[0].markets[2].outcomes[0].point,
              under: game.bookmakers[0].markets[2].outcomes[1].point,
              overOdds: game.bookmakers[0].markets[2].outcomes[0].price,
              underOdds: game.bookmakers[0].markets[2].outcomes[1].price,
          })
        })
      })
  }catch(err) {console.error(err.message)}

  })

  exports.getNCAAFGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_ncaaf/odds/?apiKey=32537244e2372228d57f009ba53a1d46&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
        .then(result => {
          result.data.forEach(game => {
            const writeResult = admin
              .firestore()
              .collection("games")
              .doc(game.id)
              .set({
                gameId: game.id,
                sport: game.sport_key,
                gameDate: game.commence_time,
                awayTeam: game.away_team,
                homeTeam: game.home_team,
                awaySpread: game.bookmakers[0].markets[1].outcomes[1].point,
                homeSpread: game.bookmakers[0].markets[1].outcomes[0].point,
                awaySpreadOdds: game.bookmakers[0].markets[1].outcomes[1].price,
                homeSpreadOdds: game.bookmakers[0].markets[1].outcomes[0].price,
                awayMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
                homeMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
                over: game.bookmakers[0].markets[2].outcomes[0].point,
                under: game.bookmakers[0].markets[2].outcomes[1].point,
                overOdds: game.bookmakers[0].markets[2].outcomes[0].price,
                underOdds: game.bookmakers[0].markets[2].outcomes[1].price,
            })
          })
        })
    }catch(err) {console.error(err.message)}
  
    })


  


      
    
      

    