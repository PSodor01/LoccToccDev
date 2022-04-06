/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp();

const db = admin.firestore()

exports.testLike = functions.firestore.document('/likes/{userId}/userLikes/{postId}')
  .onCreate((snap, context) => {
    return db
      .collection('posts')
      .doc(context.params.creatorId)
      .collection('userPosts')
      .doc(context.params.postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(1)
      })
  })

  exports.addLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
  .onCreate((snap, context) => {
    return db
      .collection('posts')
      .doc(context.params.creatorId)
      .collection('userPosts')
      .doc(context.params.postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(1)
      })
  })

  exports.removeLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
  .onDelete((snap, context) => {
    return db
      .collection('posts')
      .doc(context.params.creatorId)
      .collection('userPosts')
      .doc(context.params.postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(-1)
      })
  })

  exports.addFade = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/fades/{userId}')
  .onCreate((snap, context) => {
    return db
      .collection('posts')
      .doc(context.params.creatorId)
      .collection('userPosts')
      .doc(context.params.postId)
      .update({
        fadesCount: admin.firestore.FieldValue.increment(1)
      })
  })

  exports.removeFade = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/fades/{userId}')
  .onDelete((snap, context) => {
    return db
      .collection('posts')
      .doc(context.params.creatorId)
      .collection('userPosts')
      .doc(context.params.postId)
      .update({
        fadesCount: admin.firestore.FieldValue.increment(-1)
      })
  })


exports.getMLBGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
    .then(result => {
      result.data.forEach(game => {

        if (game.away_team == game.bookmakers[0].markets[0].outcomes[0].name) {

          const writeResult = admin
          .firestore()
          .collection("mlb")
          .doc(game.id)
          .set({
            gameId: game.id,
            sport: game.sport_key,
            gameDate: game.commence_time,
            awayTeam: game.away_team,
            homeTeam: game.home_team,
            awayMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
            homeMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
            awaySpread: game.bookmakers[0].markets[1].outcomes[0].point,
            homeSpread: game.bookmakers[0].markets[1].outcomes[1].point,
            awaySpreadOdds: game.bookmakers[0].markets[1].outcomes[0].price,
            homeSpreadOdds: game.bookmakers[1].markets[1].outcomes[1].price,
            over: game.bookmakers[0].markets[2].outcomes[0].point,
            under: game.bookmakers[0].markets[2].outcomes[1].point,
            overOdds: game.bookmakers[0].markets[2].outcomes[0].price,
            underOdds: game.bookmakers[0].markets[2].outcomes[1].price,
            
        }, { merge:true });

        } else {
          const writeResult = admin
          .firestore()
          .collection("mlb")
          .doc(game.id)
          .set({
            gameId: game.id,
            sport: game.sport_key,
            gameDate: game.commence_time,
            awayTeam: game.away_team,
            homeTeam: game.home_team,
            awayMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
            homeMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
            awaySpread: game.bookmakers[0].markets[1].outcomes[1].point,
            homeSpread: game.bookmakers[0].markets[1].outcomes[0].point,
            awaySpreadOdds: game.bookmakers[0].markets[1].outcomes[1].price,
            homeSpreadOdds: game.bookmakers[0].markets[1].outcomes[0].price,
            over: game.bookmakers[0].markets[2].outcomes[0].point,
            under: game.bookmakers[0].markets[2].outcomes[1].point,
            overOdds: game.bookmakers[0].markets[2].outcomes[0].price,
            underOdds: game.bookmakers[0].markets[2].outcomes[1].price,
           
        }, { merge:true });

        }

        
      })
    })
}catch(err) {console.error(err.message)}

})

exports.getMLBScoresData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/baseball_mlb/scores/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&dateFormat=iso')
    .then(result => {
      result.data.forEach(game => {

        if (game.away_team == game.scores[0].name) {

          const writeResult = admin
          .firestore()
          .collection("mlb")
          .doc(game.id)
          .set({
            awayScore: game.scores[0].score,
            homeScore: game.scores[1].score,
            
          }, { merge:true });

        } else {
          const writeResult = admin
          .firestore()
          .collection("mlb")
          .doc(game.id)
          .set({
            awayScore: game.scores[1].score,
            homeScore: game.scores[0].score,
           
        }, { merge:true });

        }

        
      })
    })
}catch(err) {console.error(err.message)}

})

exports.getNFLGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.away_team == game.bookmakers[0].markets[0].outcomes[0].name) {

            const writeResult = admin
            .firestore()
            .collection("nfl")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_key,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awayMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
              homeMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
              awaySpread: game.bookmakers[0].markets[1].outcomes[0].point,
              homeSpread: game.bookmakers[0].markets[1].outcomes[1].point,
              awaySpreadOdds: game.bookmakers[0].markets[1].outcomes[0].price,
              homeSpreadOdds: game.bookmakers[0].markets[1].outcomes[1].price,
              over: game.bookmakers[0].markets[2].outcomes[0].point,
              under: game.bookmakers[0].markets[2].outcomes[1].point,
              overOdds: game.bookmakers[0].markets[2].outcomes[0].price,
              underOdds: game.bookmakers[0].markets[2].outcomes[1].price,
          }, { merge:true });

          } else {
            const writeResult = admin
            .firestore()
            .collection("nfl")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_key,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awayMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
              homeMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
              awaySpread: game.bookmakers[0].markets[1].outcomes[1].point,
              homeSpread: game.bookmakers[0].markets[1].outcomes[0].point,
              awaySpreadOdds: game.bookmakers[0].markets[1].outcomes[1].price,
              homeSpreadOdds: game.bookmakers[0].markets[1].outcomes[0].price,
              over: game.bookmakers[0].markets[2].outcomes[0].point,
              under: game.bookmakers[0].markets[2].outcomes[1].point,
              overOdds: game.bookmakers[0].markets[2].outcomes[0].price,
              underOdds: game.bookmakers[0].markets[2].outcomes[1].price,
          }, { merge:true });

          }

          
        })
      })
  }catch(err) {console.error(err.message)}

  })

exports.getNCAAFGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_ncaaf/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.away_team == game.bookmakers[0].markets[0].outcomes[0].name) {

            const writeResult = admin
            .firestore()
            .collection("ncaaf")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_key,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awayMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
              homeMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
              awaySpread: game.bookmakers[0].markets[1].outcomes[0].point,
              homeSpread: game.bookmakers[0].markets[1].outcomes[1].point,
              awaySpreadOdds: game.bookmakers[0].markets[1].outcomes[0].price,
              homeSpreadOdds: game.bookmakers[0].markets[1].outcomes[1].price,
              over: game.bookmakers[0].markets[2].outcomes[0].point,
              under: game.bookmakers[0].markets[2].outcomes[1].point,
              overOdds: game.bookmakers[0].markets[2].outcomes[0].price,
              underOdds: game.bookmakers[0].markets[2].outcomes[1].price,
          }, { merge:true });

          } else {
            const writeResult = admin
            .firestore()
            .collection("ncaaf")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_key,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awayMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
              homeMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
              awaySpread: game.bookmakers[0].markets[1].outcomes[1].point,
              homeSpread: game.bookmakers[0].markets[1].outcomes[0].point,
              awaySpreadOdds: game.bookmakers[0].markets[1].outcomes[1].price,
              homeSpreadOdds: game.bookmakers[0].markets[1].outcomes[0].price,
              over: game.bookmakers[0].markets[2].outcomes[0].point,
              under: game.bookmakers[0].markets[2].outcomes[1].point,
              overOdds: game.bookmakers[0].markets[2].outcomes[0].price,
              underOdds: game.bookmakers[0].markets[2].outcomes[1].price,
          }, { merge:true });

          }

          
        })
      })
  }catch(err) {console.error(err.message)}

  })

  exports.getNBAGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          let i = game.bookmakers.findIndex((item) => item.key === 'draftkings')

          if (game.away_team == game.bookmakers[i].markets[0].outcomes[0].name) {

            const writeResult = admin
            .firestore()
            .collection("nba")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_key,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awayMoneyline: game.bookmakers[i].markets[0].outcomes[0].price,
              homeMoneyline: game.bookmakers[i].markets[0].outcomes[1].price,
              awaySpread: game.bookmakers[i].markets[1].outcomes[0].point,
              homeSpread: game.bookmakers[i].markets[1].outcomes[1].point,
              awaySpreadOdds: game.bookmakers[i].markets[1].outcomes[0].price,
              homeSpreadOdds: game.bookmakers[i].markets[1].outcomes[1].price,
              over: game.bookmakers[i].markets[2].outcomes[0].point,
              under: game.bookmakers[i].markets[2].outcomes[1].point,
              overOdds: game.bookmakers[i].markets[2].outcomes[0].price,
              underOdds: game.bookmakers[i].markets[2].outcomes[1].price,
          }, { merge:true });

          } else {
            const writeResult = admin
            .firestore()
            .collection("nba")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_key,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awayMoneyline: game.bookmakers[i].markets[0].outcomes[1].price,
              homeMoneyline: game.bookmakers[i].markets[0].outcomes[0].price,
              awaySpread: game.bookmakers[i].markets[1].outcomes[1].point,
              homeSpread: game.bookmakers[i].markets[1].outcomes[0].point,
              awaySpreadOdds: game.bookmakers[i].markets[1].outcomes[1].price,
              homeSpreadOdds: game.bookmakers[i].markets[1].outcomes[0].price,
              over: game.bookmakers[i].markets[2].outcomes[0].point,
              under: game.bookmakers[i].markets[2].outcomes[1].point,
              overOdds: game.bookmakers[i].markets[2].outcomes[0].price,
              underOdds: game.bookmakers[i].markets[2].outcomes[1].price,
          }, { merge:true });

          }

          
        })
      })
  }catch(err) {console.error(err.message)}

  })

  exports.getNBAScoresData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/basketball_nba/scores/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
  
          if (game.away_team == game.scores[0].name) {
  
            const writeResult = admin
            .firestore()
            .collection("nba")
            .doc(game.id)
            .set({
              awayScore: game.scores[0].score,
              homeScore: game.scores[1].score,
              
            }, { merge:true });
  
          } else {
            const writeResult = admin
            .firestore()
            .collection("nba")
            .doc(game.id)
            .set({
              awayScore: game.scores[1].score,
              homeScore: game.scores[0].score,
             
          }, { merge:true });
  
          }
  
          
        })
      })
  }catch(err) {console.error(err.message)}
  
  })

  exports.getNCAABGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.bookmakers.findIndex((item) => item.key === 'draftkings') > -1) {
            let i = game.bookmakers.findIndex((item) => item.key === 'draftkings')
            if (game.away_team == game.bookmakers[0].markets[0].outcomes[0].name) {

              const writeResult = admin
              .firestore()
              .collection("ncaab")
              .doc(game.id)
              .set({
                gameId: game.id,
                sport: game.sport_key,
                gameDate: game.commence_time,
                awayTeam: game.away_team,
                homeTeam: game.home_team,
                awayMoneyline: game.bookmakers[i].markets[0].outcomes[0].price,
                homeMoneyline: game.bookmakers[i].markets[0].outcomes[1].price,
                awaySpread: game.bookmakers[i].markets[1].outcomes[0].point,
                homeSpread: game.bookmakers[i].markets[1].outcomes[1].point,
                awaySpreadOdds: game.bookmakers[i].markets[1].outcomes[0].price,
                homeSpreadOdds: game.bookmakers[i].markets[1].outcomes[1].price,
                over: game.bookmakers[i].markets[2].outcomes[0].point,
                under: game.bookmakers[i].markets[2].outcomes[1].point,
                overOdds: game.bookmakers[i].markets[2].outcomes[0].price,
                underOdds: game.bookmakers[i].markets[2].outcomes[1].price,
            }, { merge:true });
  
            } else {
              const writeResult = admin
              .firestore()
              .collection("ncaab")
              .doc(game.id)
              .set({
                gameId: game.id,
                sport: game.sport_key,
                gameDate: game.commence_time,
                awayTeam: game.away_team,
                homeTeam: game.home_team,
                awayMoneyline: game.bookmakers[i].markets[0].outcomes[1].price,
                homeMoneyline: game.bookmakers[i].markets[0].outcomes[0].price,
                awaySpread: game.bookmakers[i].markets[1].outcomes[1].point,
                homeSpread: game.bookmakers[i].markets[1].outcomes[0].point,
                awaySpreadOdds: game.bookmakers[i].markets[1].outcomes[1].price,
                homeSpreadOdds: game.bookmakers[i].markets[1].outcomes[0].price,
                over: game.bookmakers[i].markets[2].outcomes[0].point,
                under: game.bookmakers[i].markets[2].outcomes[1].point,
                overOdds: game.bookmakers[i].markets[2].outcomes[0].price,
                underOdds: game.bookmakers[i].markets[2].outcomes[1].price,
            }, { merge:true });
  
            }
          } else {
            return

          }
        })
      })
  }catch(err) {console.error(err.message)}

  })

  exports.getNCAABScoresData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/basketball_ncaab/scores/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
  
          if (game.away_team == game.scores[0].name) {
  
            const writeResult = admin
            .firestore()
            .collection("ncaab")
            .doc(game.id)
            .set({
              awayScore: game.scores[0].score,
              homeScore: game.scores[1].score,
              
            }, { merge:true });
  
          } else {
            const writeResult = admin
            .firestore()
            .collection("ncaab")
            .doc(game.id)
            .set({
              awayScore: game.scores[1].score,
              homeScore: game.scores[0].score,
             
          }, { merge:true });
  
          }
  
          
        })
      })
  }catch(err) {console.error(err.message)}
  
  })

  exports.getEPLGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
  
          if (game.away_team == game.bookmakers[0].markets[0].outcomes[0].name) {
  
            const writeResult = admin
            .firestore()
            .collection("epl")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_key,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awayMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
              homeMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
              drawMoneyline: game.bookmakers[0].markets[0].outcomes[2].price,
              
          }, { merge:true });
  
          } else {
            const writeResult = admin
            .firestore()
            .collection("epl")
            .doc(game.id)
            .set({
              gameId: game.id,
              sport: game.sport_key,
              gameDate: game.commence_time,
              awayTeam: game.away_team,
              homeTeam: game.home_team,
              awayMoneyline: game.bookmakers[0].markets[0].outcomes[1].price,
              homeMoneyline: game.bookmakers[0].markets[0].outcomes[0].price,
              drawMoneyline: game.bookmakers[0].markets[0].outcomes[2].price,
             
          }, { merge:true });
  
          }
  
          
        })
      })
  }catch(err) {console.error(err.message)}
  
  })

  exports.getEPLScoresData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/soccer_epl/scores/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
  
          if (game.away_team == game.scores[0].name) {
  
            const writeResult = admin
            .firestore()
            .collection("epl")
            .doc(game.id)
            .set({
              awayScore: game.scores[0].score,
              homeScore: game.scores[1].score,
              
            }, { merge:true });
  
          } else {
            const writeResult = admin
            .firestore()
            .collection("epl")
            .doc(game.id)
            .set({
              awayScore: game.scores[1].score,
              homeScore: game.scores[0].score,
             
          }, { merge:true });
  
          }
  
          
        })
      })
  }catch(err) {console.error(err.message)}
  
  })

  exports.getNHLGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/icehockey_nhl/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.bookmakers.findIndex((item) => item.key === 'lowvig') > -1) {
            let i = game.bookmakers.findIndex((item) => item.key === 'lowvig')
            if (game.away_team == game.bookmakers[0].markets[0].outcomes[0].name) {

              const writeResult = admin
              .firestore()
              .collection("nhl")
              .doc(game.id)
              .set({
                gameId: game.id,
                sport: game.sport_key,
                gameDate: game.commence_time,
                awayTeam: game.away_team,
                homeTeam: game.home_team,
                awayMoneyline: game.bookmakers[i].markets[0].outcomes[0].price,
                homeMoneyline: game.bookmakers[i].markets[0].outcomes[1].price,
                awaySpread: game.bookmakers[i].markets[1].outcomes[0].point,
                homeSpread: game.bookmakers[i].markets[1].outcomes[1].point,
                awaySpreadOdds: game.bookmakers[i].markets[1].outcomes[0].price,
                homeSpreadOdds: game.bookmakers[i].markets[1].outcomes[1].price,
                over: game.bookmakers[i].markets[2].outcomes[0].point,
                under: game.bookmakers[i].markets[2].outcomes[1].point,
                overOdds: game.bookmakers[i].markets[2].outcomes[0].price,
                underOdds: game.bookmakers[i].markets[2].outcomes[1].price,
            }, { merge:true });
  
            } else {
              const writeResult = admin
              .firestore()
              .collection("nhl")
              .doc(game.id)
              .set({
                gameId: game.id,
                sport: game.sport_key,
                gameDate: game.commence_time,
                awayTeam: game.away_team,
                homeTeam: game.home_team,
                awayMoneyline: game.bookmakers[i].markets[0].outcomes[1].price,
                homeMoneyline: game.bookmakers[i].markets[0].outcomes[0].price,
                awaySpread: game.bookmakers[i].markets[1].outcomes[1].point,
                homeSpread: game.bookmakers[i].markets[1].outcomes[0].point,
                awaySpreadOdds: game.bookmakers[i].markets[1].outcomes[1].price,
                homeSpreadOdds: game.bookmakers[i].markets[1].outcomes[0].price,
                over: game.bookmakers[i].markets[2].outcomes[0].point,
                under: game.bookmakers[i].markets[2].outcomes[1].point,
                overOdds: game.bookmakers[i].markets[2].outcomes[0].price,
                underOdds: game.bookmakers[i].markets[2].outcomes[1].price,
            }, { merge:true });
  
            }
          } else {
            return

          }
        })
      })
  }catch(err) {console.error(err.message)}

  })

  exports.getNHLScoresData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/icehockey_nhl/scores/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
  
          if (game.away_team == game.scores[0].name) {
  
            const writeResult = admin
            .firestore()
            .collection("nhl")
            .doc(game.id)
            .set({
              awayScore: game.scores[0].score,
              homeScore: game.scores[1].score,
              
            }, { merge:true });
  
          } else {
            const writeResult = admin
            .firestore()
            .collection("nhl")
            .doc(game.id)
            .set({
              awayScore: game.scores[1].score,
              homeScore: game.scores[0].score,
             
          }, { merge:true });
  
          }
  
          
        })
      })
  }catch(err) {console.error(err.message)}
  
  })

  exports.getGolfGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/golf_masters_tournament_winner/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&Format=american&dateFormat=iso')
        .then(result => {
          result.data.forEach(game => {

            for (let i = 0; i < game.bookmakers[0].markets[0].outcomes.length; i++){
                const writeResult = admin
                .firestore()
                .collection('golf')
                .doc(game.bookmakers[0].markets[0].outcomes[i].name)
                .set({
                  playerName: game.bookmakers[0].markets[0].outcomes[i].name,
                  playerOdds: (game.bookmakers[0].markets[0].outcomes[i].price -1) * 100,
                  gameId: game.id,
                  sport: 'US Masters Tournament Lines - Winner',
                  
                }, { merge:true });
            }
          })
        })
    }catch(err) {console.error(err.message)}
  
    })

  exports.getFuturesData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_nfl_super_bowl_winner/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&Format=american&dateFormat=iso')
        .then(result => {
          result.data.forEach(game => {

            for (let i = 0; i < game.bookmakers[0].markets[0].outcomes.length; i++){
                const writeResult = admin
                .firestore()
                .collection('futures')
                .doc(game.bookmakers[0].markets[0].outcomes[i].name)
                .set({
                  playerName: game.bookmakers[0].markets[0].outcomes[i].name,
                  playerOdds: Math.round((game.bookmakers[0].markets[0].outcomes[i].price -1) * 100),
                  gameId: game.id,
                  sport: 'NFL - Suberbowl Champion',
                  
                }, { merge:true });
            }
          })
        })
    }catch(err) {console.error(err.message)}

    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/baseball_mlb_world_series_winner/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&Format=american&dateFormat=iso')
        .then(result => {
          result.data.forEach(game => {

            for (let i = 0; i < game.bookmakers[0].markets[0].outcomes.length; i++){
                const writeResult = admin
                .firestore()
                .collection('futures')
                .doc(game.bookmakers[0].markets[0].outcomes[i].name)
                .set({
                  playerName: game.bookmakers[0].markets[0].outcomes[i].name,
                  playerOdds: Math.round((game.bookmakers[0].markets[0].outcomes[i].price -1) * 100),
                  gameId: game.id,
                  sport: 'MLB - World Series Winner',
                  
                }, { merge:true });
            }
          })
        })
    }catch(err) {console.error(err.message)}

    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/basketball_nba_championship_winner/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&Format=american&dateFormat=iso')
        .then(result => {
          result.data.forEach(game => {

            for (let i = 0; i < game.bookmakers[0].markets[0].outcomes.length; i++){
                const writeResult = admin
                .firestore()
                .collection('futures')
                .doc(game.bookmakers[0].markets[0].outcomes[i].name)
                .set({
                  playerName: game.bookmakers[0].markets[0].outcomes[i].name,
                  playerOdds: Math.round((game.bookmakers[0].markets[0].outcomes[i].price -1) * 100),
                  gameId: game.id,
                  sport: 'NBA - Championship',
                  
                }, { merge:true });
            }
          })
        })
    }catch(err) {console.error(err.message)}

    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/icehockey_nhl_championship_winner/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&Format=american&dateFormat=iso')
        .then(result => {
          result.data.forEach(game => {

            if (game.bookmakers.findIndex((item) => item.key === 'draftkings') > -1) {
              let j = game.bookmakers.findIndex((item) => item.key === 'draftkings')
              for (let i = 0; i < game.bookmakers[0].markets[0].outcomes.length; i++){
                const writeResult = admin
                .firestore()
                .collection('futures')
                .doc(game.bookmakers[j].markets[0].outcomes[i].name)
                .set({
                  playerName: game.bookmakers[j].markets[0].outcomes[i].name,
                  playerOdds: Math.round((game.bookmakers[0].markets[0].outcomes[i].price -1) * 100),
                  gameId: game.id,
                  sport: 'NHL - Stanley Cup Winner',
                  
                }, { merge:true });
            }
    
            } else {
              return
  
            }
          })
        })
    }catch(err) {console.error(err.message)}


  
    })

  exports.deleteNFLGameData = functions.pubsub.schedule('00 11 * * *').timeZone('America/New_York').onRun(async() => {
    try {
      const writeResult = admin
          .firestore()
          .collection('nfl')
          .get()
          .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete({});
          });
        });

      
  }catch(err) {console.error(err.message)}

  })

  exports.deleteMLBGameData = functions.pubsub.schedule('00 11 * * *').timeZone('America/New_York').onRun(async() => {
    try {
      const writeResult = admin
          .firestore()
          .collection('mlb')
          .get()
          .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete({});
          });
        });
  }catch(err) {console.error(err.message)}

  })

  exports.deleteNCAAFGameData = functions.pubsub.schedule('00 11 * * *').timeZone('America/New_York').onRun(async() => {
    try {
      const writeResult = admin
          .firestore()
          .collection('ncaaf')
          .get()
          .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete({});
          });
        });
  }catch(err) {console.error(err.message)}

  })

  exports.deleteNBAGameData = functions.pubsub.schedule('00 11 * * *').timeZone('America/New_York').onRun(async() => {
    try {
      const writeResult = admin
          .firestore()
          .collection('nba')
          .get()
          .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete({});
          });
        });

      
  }catch(err) {console.error(err.message)}

  })

  exports.deleteNCAABGameData = functions.pubsub.schedule('00 11 * * *').timeZone('America/New_York').onRun(async() => {
    try {
      const writeResult = admin
          .firestore()
          .collection('ncaab')
          .get()
          .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete({});
          });
        });
  }catch(err) {console.error(err.message)}

  })

  exports.deleteEPLGameData = functions.pubsub.schedule('00 8 * * *').timeZone('America/New_York').onRun(async() => {
    try {
      const writeResult = admin
          .firestore()
          .collection('epl')
          .get()
          .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete({});
          });
        });
  }catch(err) {console.error(err.message)}

  })

  exports.deleteNHLGameData = functions.pubsub.schedule('00 11 * * *').timeZone('America/New_York').onRun(async() => {
    try {
      const writeResult = admin
          .firestore()
          .collection('nhl')
          .get()
          .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete({});
          });
        });

      
  }catch(err) {console.error(err.message)}

  })

  
  


      
    
      

    