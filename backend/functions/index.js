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


exports.getMLBGameData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
    .then(result => {
      result.data.forEach(game => {

        if (game.bookmakers.findIndex((item) => item.key === 'draftkings') > -1) {
          let i = game.bookmakers.findIndex((item) => item.key === 'draftkings')
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
            .collection("mlb")
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

exports.getNFLGameData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.bookmakers.findIndex((item) => item.key === 'fanduel') > -1) {
            let i = game.bookmakers.findIndex((item) => item.key === 'fanduel')
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
                sportsbook: game.bookmakers[i].key,
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
              .collection("nfl")
              .doc(game.id)
              .set({
                gameId: game.id,
                sport: game.sport_key,
                gameDate: game.commence_time,
                awayTeam: game.away_team,
                homeTeam: game.home_team,
                sportsbook: game.bookmakers[i].key,
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

  exports.getNFLScoresData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/scores/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
  
          if (game.away_team == game.scores[0].name) {
  
            const writeResult = admin
            .firestore()
            .collection("nfl")
            .doc(game.id)
            .set({
              awayScore: game.scores[0].score,
              homeScore: game.scores[1].score,
              
            }, { merge:true });
  
          } else {
            const writeResult = admin
            .firestore()
            .collection("nfl")
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

exports.getNCAAFGameData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_ncaaf/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.bookmakers.findIndex((item) => item.key === 'fanduel') > -1) {
            let i = game.bookmakers.findIndex((item) => item.key === 'fanduel')
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
                sportsbook: game.bookmakers[i].key,
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
              .collection("ncaaf")
              .doc(game.id)
              .set({
                gameId: game.id,
                sport: game.sport_key,
                gameDate: game.commence_time,
                awayTeam: game.away_team,
                homeTeam: game.home_team,
                sportsbook: game.bookmakers[i].key,
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

  exports.getNCAAFScoresData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_ncaaf/scores/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
  
          if (game.away_team == game.scores[0].name) {
  
            const writeResult = admin
            .firestore()
            .collection("ncaaf")
            .doc(game.id)
            .set({
              awayScore: game.scores[0].score,
              homeScore: game.scores[1].score,
              
            }, { merge:true });
  
          } else {
            const writeResult = admin
            .firestore()
            .collection("ncaaf")
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

  exports.getNBAGameData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
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

  exports.getNCAABGameData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.bookmakers.findIndex((item) => item.key === 'mybookieag') > -1) {
            let i = game.bookmakers.findIndex((item) => item.key === 'mybookieag')
            if(game.away_team == "Ohio Bobcats") {
              console.log("skip")
            } else {

            
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
          }} else {
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

  exports.getEPLGameData = functions.pubsub.schedule('every 20 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {
  
          if (game.bookmakers.findIndex((item) => item.key === 'barstool') > -1) {
            let i = game.bookmakers.findIndex((item) => item.key === 'barstool')
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
              awayMoneyline: game.bookmakers[i].markets[0].outcomes[0].price,
              homeMoneyline: game.bookmakers[i].markets[0].outcomes[1].price,
              drawMoneyline: game.bookmakers[i].markets[0].outcomes[2].price,
              overOdds: game.bookmakers[i].markets[1].outcomes[0].price,
              over: game.bookmakers[i].markets[1].outcomes[0].point,
              underOdds: game.bookmakers[i].markets[1].outcomes[1].price,
              under: game.bookmakers[i].markets[1].outcomes[1].point
              
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
              awayMoneyline: game.bookmakers[i].markets[0].outcomes[1].price,
              homeMoneyline: game.bookmakers[i].markets[0].outcomes[0].price,
              drawMoneyline: game.bookmakers[i].markets[0].outcomes[2].price,
              overOdds: game.bookmakers[i].markets[1].outcomes[0].price,
              over: game.bookmakers[i].markets[1].outcomes[0].point,
              underOdds: game.bookmakers[i].markets[1].outcomes[1].price,
              under: game.bookmakers[i].markets[1].outcomes[1].point
             
            }, { merge:true });
  
          }
        } else {
          return

        }
      })
    })
  }catch(err) {console.error(err.message)}
  
  })

  exports.getEPLScoresData = functions.pubsub.schedule('every 20 minutes').onRun(async() => {
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

  exports.getNHLGameData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/icehockey_nhl/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.bookmakers.findIndex((item) => item.key === 'barstool') > -1) {
            let i = game.bookmakers.findIndex((item) => item.key === 'barstool')
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
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/golf_pga_championship_winner/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&Format=american&dateFormat=iso')
        .then(result => {
          result.data.forEach(game => {

            for (let i = 0; i < game.bookmakers[0].markets[0].outcomes.length; i++){
                const writeResult = admin
                .firestore()
                .collection('golf')
                .doc(game.bookmakers[0].markets[0].outcomes[i].name)
                .set({
                  playerName: game.bookmakers[0].markets[0].outcomes[i].name,
                  playerOdds: Math.round((game.bookmakers[0].markets[0].outcomes[i].price -1) * 100),
                  gameId: game.id,
                  sport: 'US Masters Tournament Lines - Winner',
                  
                }, { merge:true });
            }
          })
        })
    }catch(err) {console.error(err.message)}
  
    })

  exports.getFuturesData = functions.pubsub.schedule('every 20 minutes').onRun(async() => {
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
                  playerOdds: game.bookmakers[0].markets[0].outcomes[i].price > 2 ? Math.round((game.bookmakers[0].markets[0].outcomes[i].price -1)*100) : Math.round(-100/(game.bookmakers[0].markets[0].outcomes[i].price -1)),
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

            if (game.bookmakers.findIndex((item) => item.key === 'draftkings') > -1) {
              let j = game.bookmakers.findIndex((item) => item.key === 'draftkings')
              for (let i = 0; i < game.bookmakers[j].markets[0].outcomes.length; i++){
                const writeResult = admin
                .firestore()
                .collection('futures')
                .doc(game.bookmakers[j].markets[0].outcomes[i].name)
                .set({
                  playerName: game.bookmakers[j].markets[0].outcomes[i].name,
                  playerOdds: game.bookmakers[j].markets[0].outcomes[i].price > 2 ? Math.round((game.bookmakers[j].markets[0].outcomes[i].price -1)*100) : Math.round(-100/(game.bookmakers[j].markets[0].outcomes[i].price -1)),
                  gameId: game.id,
                  sport: 'MLB - World Series Winner',
                  
                }, { merge:true });
            }
    
            } else {
              return
  
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
                  playerOdds: game.bookmakers[0].markets[0].outcomes[i].price > 2 ? Math.round((game.bookmakers[0].markets[0].outcomes[i].price -1)*100) : Math.round(-100/(game.bookmakers[0].markets[0].outcomes[i].price -1)),
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

            if (game.bookmakers.findIndex((item) => item.key === 'fanduel') > -1) {
              let j = game.bookmakers.findIndex((item) => item.key === 'fanduel')
              for (let i = 0; i < game.bookmakers[j].markets[0].outcomes.length; i++){
                const writeResult = admin
                .firestore()
                .collection('futures')
                .doc(game.bookmakers[j].markets[0].outcomes[i].name)
                .set({
                  playerName: game.bookmakers[j].markets[0].outcomes[i].name,
                  playerOdds: game.bookmakers[j].markets[0].outcomes[i].price > 2 ? Math.round((game.bookmakers[j].markets[0].outcomes[i].price -1)*100) : Math.round(-100/(game.bookmakers[j].markets[0].outcomes[i].price -1)),
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

    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&Format=american&dateFormat=iso')
        .then(result => {
          result.data.forEach(game => {

            for (let i = 0; i < game.bookmakers[0].markets[0].outcomes.length; i++){
                const writeResult = admin
                .firestore()
                .collection('futures')
                .doc(game.bookmakers[0].markets[0].outcomes[i].name)
                .set({
                  playerName: game.bookmakers[0].markets[0].outcomes[i].name,
                  playerOdds: game.bookmakers[0].markets[0].outcomes[i].price > 2 ? Math.round((game.bookmakers[0].markets[0].outcomes[i].price -1)*100) : Math.round(-100/(game.bookmakers[0].markets[0].outcomes[i].price -1)),
                  gameId: game.id,
                  sport: 'FIFA World Cup Winner',
                  
                }, { merge:true });
            }
          })
        })
    }catch(err) {console.error(err.message)}


  
    })

  exports.getMMAGameData = functions.pubsub.schedule('every 20 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/mma_mixed_martial_arts/odds/?apiKey=0f4aac73c624d8228321aa92f6c34b83&regions=us&Format=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.bookmakers.findIndex((item) => item.key === 'draftkings') > -1) {
            let i = game.bookmakers.findIndex((item) => item.key === 'draftkings')
            if (game.away_team == game.bookmakers[0].markets[0].outcomes[0].name) {

              const writeResult = admin
              .firestore()
              .collection("mma")
              .doc(game.id)
              .set({
                gameId: game.id,
                sport: game.sport_key,
                gameDate: game.commence_time,
                awayTeam: game.away_team,
                homeTeam: game.home_team,
                awayMoneyline: game.bookmakers[i].markets[0].outcomes[0].price > 2 ? Math.round((game.bookmakers[i].markets[0].outcomes[0].price -1)*100) : Math.round(-100/(game.bookmakers[i].markets[0].outcomes[0].price -1)),
                homeMoneyline: game.bookmakers[i].markets[0].outcomes[1].price > 2 ? Math.round((game.bookmakers[i].markets[0].outcomes[1].price -1)*100) : Math.round(-100/(game.bookmakers[i].markets[0].outcomes[1].price -1)),
            }, { merge:true });
  
            } else {
              const writeResult = admin
              .firestore()
              .collection("mma")
              .doc(game.id)
              .set({
                gameId: game.id,
                sport: game.sport_key,
                gameDate: game.commence_time,
                awayTeam: game.away_team,
                homeTeam: game.home_team,
                awayMoneyline: game.bookmakers[i].markets[0].outcomes[1].price > 2 ? Math.round((game.bookmakers[i].markets[0].outcomes[1].price -1)*100) : Math.round(-100/(game.bookmakers[i].markets[0].outcomes[1].price -1)),
                homeMoneyline: game.bookmakers[i].markets[0].outcomes[0].price > 2 ? Math.round((game.bookmakers[i].markets[0].outcomes[0].price -1)*100) : Math.round(-100/(game.bookmakers[i].markets[0].outcomes[0].price -1)),
            }, { merge:true });
  
            }
          } else {
            return

          }
        })
      })
  }catch(err) {console.error(err.message)}
  
    })

  exports.getFormula1TeamData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    const options = {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'x-rapidapi-key': '2354874cc8e479f89b4d769daf9de0df',
        'x-rapidapi-host': 'v1.formula-1.api-sports.io'
      },
    };

    try {
      const response = await axios.get("https://v1.formula-1.api-sports.io//rankings/teams?season=2023", options)
      .then(result => {

          for (let i = 0; i < result.data.response.length; i++){
            const writeResult = admin
              .firestore()
              .collection("formula1")
              .doc("info")
              .collection('teams')
              .doc(result.data.response[i].team.name)
              .set({
                currentSeasonRank: result.data.response[i].position,
                name: result.data.response[i].team.name,
                logo: result.data.response[i].team.logo,
                currentSeasonPoints: result.data.response[i].points,
            }, { merge:true });           
        }
             
      })
    }catch(err) {console.error(err.message)}

    try {
      const response = await axios.get("https://v1.formula-1.api-sports.io/teams  ", options)
      .then(result => {

          for (let i = 0; i < result.data.response.length; i++){
            const writeResult = admin
              .firestore()
              .collection("formula1")
              .doc("info")
              .collection('teams')
              .doc(result.data.response[i].name)
              .set({
                base: result.data.response[i].base,
                first_team_entry: result.data.response[i].first_team_entry,
                world_championships: result.data.response[i].world_championships,
                highest_race_finish: result.data.response[i].highest_race_finish.position,
                pole_positions: result.data.response[i].pole_positions,
                fastest_laps: result.data.response[i].fastest_laps,
                president: result.data.response[i].president,
                director: result.data.response[i].director,
                chassis: result.data.response[i].chassis,
                engine: result.data.response[i].engine,
                tyres: result.data.response[i].tyres,

            }, { merge:true });           
        }
             
      })
    }catch(err) {console.error(err.message)}

   

  })

  exports.getFormula1RaceData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    const options = {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'x-rapidapi-key': '2354874cc8e479f89b4d769daf9de0df',
        'x-rapidapi-host': 'v1.formula-1.api-sports.io'
      },
    };

    try {
      const response = await axios.get("https://v1.formula-1.api-sports.io/races?next=1&type=Race", options)
      .then(result => {
        let raceId = result.data.response[0].id

        try {
          const response = axios.get("https://v1.formula-1.api-sports.io/races?id=" + raceId, options)
          .then(result => {
    
              for (let i = 0; i < result.data.response.length; i++){
                const writeResult = admin
                  .firestore()
                  .collection("formula1")
                  .doc("info")
                  .collection('races')
                  .doc("currentRace")
                  .set({
                    raceType: result.data.response[i].type,
                    gameId: result.data.response[i].id + 'abc2023',
                    sport: 'formula1',
                    gameDate: result.data.response[i].date,
                    raceName: result.data.response[i].competition.name,
                    raceCountry: result.data.response[i].competition.location.country,
                    raceCity: result.data.response[i].competition.location.city,
                    trackName: result.data.response[i].circuit.name,
                    trackImage: result.data.response[i].circuit.image,
                    currentLap: result.data.response[i].laps.current,
                    totalLaps: result.data.response[i].laps.total,
                    fastestLapDriver: result.data.response[i].fastest_lap.driver.id,
                    raceDistance: result.data.response[i].distance,
                    weather: result.data.response[i].weather,
                    status: result.data.response[i].status,
                    currentRace: true
    
                }, { merge:true });           
            }
                 
          })
        }catch(err) {console.error(err.message)}

        try {
          const response = axios.get("https://v1.formula-1.api-sports.io/rankings/races?race=" + raceId, options)
          .then(result => {
              for (let i = 0; i < result.data.response.length; i++){
                const writeResult = admin
                  .firestore()
                  .collection("formula1")
                  .doc("info")
                  .collection('races')
                  .doc(result.data.response[i].driver.name)
                  .set({
                    driverId: result.data.response[i].driver.id,
                    driverName: result.data.response[i].driver.name,
                    driverImage: result.data.response[i].driver.image,
                    driverTeam: result.data.response[i].team.name,
                    driverPosition: result.data.response[i].position,
                    time: result.data.response[i].time,
                    pits: result.data.response[i].pits,
    
                }, { merge:true });           
            }
                 
          })
        }catch(err) {console.error(err.message)}
      })
    }catch(err) {console.error(err.message)}

  })

  exports.getFormula1IndividualDriverData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    const options = {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'x-rapidapi-key': '2354874cc8e479f89b4d769daf9de0df',
        'x-rapidapi-host': 'v1.formula-1.api-sports.io'
      },
    };

    try {
      const response = await axios.get("https://v1.formula-1.api-sports.io/drivers?id=83", options)
      .then(result => {

          for (let i = 0; i < result.data.response.length; i++){
            const writeResult = admin
              .firestore()
              .collection("formula1")
              .doc("info")
              .collection('drivers')
              .doc(result.data.response[i].name)
              .set({
                nationality: result.data.response[i].nationality,
                country: result.data.response[i].country.name,
                birthdate: result.data.response[i].birthdate,
                birthplace: result.data.response[i].birthplace,
                numberRaces: result.data.response[i].grands_prix_entered,
                world_championships: result.data.response[i].world_championships,
                highest_race_finish: result.data.response[i].highest_race_finish.position,
                highest_grid_position: result.data.response[i].highest_grid_position,
                careerPoints: result.data.response[i].career_points,

            }, { merge:true });           
        }
             
      })
    }catch(err) {console.error(err.message)}

   

  })

  exports.getFormula1DriverData = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    const options = {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'x-rapidapi-key': '2354874cc8e479f89b4d769daf9de0df',
        'x-rapidapi-host': 'v1.formula-1.api-sports.io'
      },
    };

    try {
      const response = await axios.get("https://v1.formula-1.api-sports.io//rankings/drivers?season=2023", options)
      .then(result => {

          for (let i = 0; i < result.data.response.length; i++){
            const writeResult = admin
              .firestore()
              .collection("formula1")
              .doc("info")
              .collection('drivers')
              .doc(result.data.response[i].driver.name)
              .set({
                driverId: result.data.response[i].driver.id,
                driverName: result.data.response[i].driver.name,
                driverRank: result.data.response[i].position,
                abbr: result.data.response[i].driver.abbr,
                driverNumber: result.data.response[i].driver.number,
                driverImage: result.data.response[i].driver.image,
                driverTeam: result.data.response[i].team.name,
                currentSeasonPoints: result.data.response[i].points,

            }, { merge:true });           
        }
             
      })
    }catch(err) {console.error(err.message)}
  })

  

  exports.deleteNFLGameData = functions.pubsub.schedule('59 10 * * *').timeZone('America/New_York').onRun(async() => {
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

  exports.deleteMLBGameData = functions.pubsub.schedule('59 10 * * *').timeZone('America/New_York').onRun(async() => {
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

  exports.deleteNCAAFGameData = functions.pubsub.schedule('59 10 * * *').timeZone('America/New_York').onRun(async() => {
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

  exports.deleteNBAGameData = functions.pubsub.schedule('59 10 * * *').timeZone('America/New_York').onRun(async() => {
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

  exports.deleteNCAABGameData = functions.pubsub.schedule('59 10 * * *').timeZone('America/New_York').onRun(async() => {
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

  exports.deleteEPLGameData = functions.pubsub.schedule('59 10 * * *').timeZone('America/New_York').onRun(async() => {
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

  exports.deleteNHLGameData = functions.pubsub.schedule('59 10 * * *').timeZone('America/New_York').onRun(async() => {
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

  exports.deleteMMAGameData = functions.pubsub.schedule('59 10 * * *').timeZone('America/New_York').onRun(async() => {
    try {
      const writeResult = admin
          .firestore()
          .collection('mma')
          .get()
          .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete({});
          });
        });

      
  }catch(err) {console.error(err.message)}

  })

  
  


      
    
      

    