/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp();

const db = admin.firestore()

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
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=410146d3f5db8991f4ef289a2ecd9ec2&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
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
            
        })

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
           
        })

        }

        
      })
    })
}catch(err) {console.error(err.message)}

})

exports.getNFLGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
  try {
    const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=410146d3f5db8991f4ef289a2ecd9ec2&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.away_team == game.bookmakers[0].markets[1].outcomes[0].name) {

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
          })

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
          })

          }

          
        })
      })
  }catch(err) {console.error(err.message)}

  })

  exports.getNCAAFGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/americanfootball_ncaaf/odds/?apiKey=410146d3f5db8991f4ef289a2ecd9ec2&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.away_team == game.bookmakers[0].markets[1].outcomes[0].name) {

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
          })

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
          })

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

  exports.getNBAGameData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    try {
      const response = await axios.get('https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=410146d3f5db8991f4ef289a2ecd9ec2&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso')
      .then(result => {
        result.data.forEach(game => {

          if (game.away_team == game.bookmakers[0].markets[1].outcomes[0].name) {

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
          })

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
          })

          }

          
        })
      })
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

  


      
    
      

    