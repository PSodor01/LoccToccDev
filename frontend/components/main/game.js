import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Text, View, StyleSheet, Alert, Linking, FlatList, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import moment from 'moment'

import * as Notifications from 'expo-notifications'

import { useNavigation } from '@react-navigation/native';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import email from 'react-native-email'
import { Avatar } from 'react-native-elements';

import analytics from "@react-native-firebase/analytics";
import { BannerAdSize, TestIds, BannerAd } from 'react-native-google-mobile-ads';

import firebase from 'firebase'
require("firebase/firestore")

import { connect } from 'react-redux'

function game(props) {

    const [postId, setPostId] = useState("");
    const [loading, setLoading] = useState(true);
    const [sortCriteria, setSortCriteria] = useState(true);
    const [listAllPlayers, setListAllPlayers] = useState(false);
    const [awayVote, setAwayVote] = useState("");
    const [homeVote, setHomeVote] = useState("");
    const [drawVote, setDrawVote] = useState("");
    const [golfGames, setGolfGames] = useState([]);
    const [futureGames, setFutureGames] = useState([]);
    const [formula1Races, setFormula1Races] = useState([]);
    const [playerProps, setPlayerProps] = useState([]);
    const [propDescription, setPropDescription] = useState(null);
    const [propOver, setPropOver] = useState(null);
    const [propUnder, setPropUnder] = useState(null);
    const [propShortName, setPropShortName] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [combinedData, setCombinedData] = useState([]);
    const [fullscreen, setFullscreen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);


    const {gameId, gameDate, homeTeam, awayTeam, homeMoneyline, awayMoneyline, homeSpread, awaySpread, homeSpreadOdds, awaySpreadOdds, over, overOdds, under, underOdds, drawMoneyline, sport, fantasyTopic, awayTeamLogo, homeTeamLogo} = props.route.params;

    const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8519029912093094/8258310490'
    const nativeAdUnitId = __DEV__ ? TestIds.NATIVE_AD : 'ca-app-pub-8519029912093094/2848035284';


    
    useEffect(() => {
            analytics().logScreenView({ screen_name: 'game', screen_class: 'game', user_name: props.currentUser.name})

    }, [props.route.params.postId, props.users])

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
          fetchCombinedData();
          
        });
    
        return unsubscribe;
      }, [props.navigation, props.blocking, props.liked, props.faded]);

    useEffect(() => {
        setGolfGames(props.golfGames)
        setFutureGames(props.futureGames)
        setFormula1Races(props.formula1Races)
    }, [])

    

    const fetchCombinedData = async () => {
        const [users, gamePosts] = await Promise.all([
            firebase.firestore().collection("users").get(),
            firebase.firestore().collectionGroup("userPosts").where('gameId', '==', gameId).orderBy('creation', 'desc').get()
        ]);

        const usersData = users.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const gamePostsData = gamePosts.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const combinedData = gamePostsData.map((gamePost) => {
            const user = usersData.find((user) => user.id === gamePost.creator);
            return { ...gamePost, user };
        });

        for (let i = 0; i < combinedData.length; i++) {
            if (props.blocking.indexOf(combinedData[i].creator) > -1) {
                combinedData[i].blocked = true
            } else {
                combinedData[i].blocked = false
            }

            if (props.liked.indexOf(combinedData[i].id) > -1) {
                combinedData[i].liked = true
            } else {
                combinedData[i].liked = false
            }

            if (props.faded.indexOf(combinedData[i].id) > -1) {
                combinedData[i].faded = true
            } else {
                combinedData[i].faded = false
            }
            
        }
    
            setCombinedData(combinedData);
            setVoteCount()
            setLoading(false)
    };

    const handleImagePress = (url) => {
        setSelectedImage(url);
        setFullscreen(true);
        analytics().logEvent('fullSizeImage', {user_name: props.currentUser.name});
      };

    const storeLike = (postId, userId) => {
        firebase.firestore()
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .collection("userLikes")
            .doc(postId)
            .set({})

        analytics().logEvent('hammerPost', {user_name: props.currentUser.name});
            
    }

    const deleteLike = (postId, userId) => {
        firebase.firestore()
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .collection("userLikes")
            .doc(postId)
            .delete({})

    }

    const storeFade = (postId) => {
        firebase.firestore()
            .collection("fades")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFades")
            .doc(postId)
            .set({})

        analytics().logEvent('fadePost', {user_name: props.currentUser.name});
    }

    const deleteFade = (postId) => {
        firebase.firestore()
            .collection("fades")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFades")
            .doc(postId)
            .delete({})

    }

    const onLikePress = (userId, postId) => {

        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})

        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(1)
            })

    }

    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(-1)
            })

        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
        
    }

    const onFadePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                fadesCount: firebase.firestore.FieldValue.increment(1)
            })

        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("fades")
            .doc(firebase.auth().currentUser.uid)
            .set({})

    }

    const onUnfadePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                fadesCount: firebase.firestore.FieldValue.increment(-1)
            })

        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("fades")
            .doc(firebase.auth().currentUser.uid)
            .delete()

    }

    const sendNotification = async (notification, token) => {

        const currentBadgeNumber = await Notifications.getBadgeCountAsync();
        const nextBadgeNumber = currentBadgeNumber + 1;

        const message = {
            to: token,
            sound: 'default',
            body: notification ? notification : '',
            badge: nextBadgeNumber,
        };
        
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        // Update the badge number in the local notification center
        await Notifications.setBadgeCountAsync(nextBadgeNumber);

    }

    const sendNotificationForLike = async (uid, name) => {
        
        const users = await firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let data = snapshot.data();

                    const token = data.token

                    if (token != undefined) {
                        const likedName = props.currentUser.name
                        if (awayTeam  != undefined) {const notification = '(' + name + '): ' + likedName + ' hammered your post on the ' + awayTeam + "/" + homeTeam + " game"
                            sendNotification(notification, token)}
                            else {const notification = '(' + name + '): ' + likedName + ' hammered your post'
                            sendNotification(notification, token)}
                    } else {
                    }
                }
                else {
                }
            })
        
        
        };

    const sendNotificationForFade = async (uid, name) => {
        const users = await firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let data = snapshot.data();

                    const token = data.token

                    if (token != undefined) {
                        const likedName = props.currentUser.name
                        if (awayTeam != undefined) {const notification = '(' + name + '): ' + likedName + ' faded your post on the ' + awayTeam + "/" + homeTeam + " game"
                            sendNotification(notification, token)}
                            else {const notification = '(' + name + '): ' + likedName + ' faded your post'
                            sendNotification(notification, token)}
                        
                    } else {
                    }
                }
                else {
                }
            })
    };


    const gameVote = () => {

        analytics().logEvent('gameVote', {user_name: props.currentUser.name});

        firebase.firestore()
            .collection("votes")
            .doc(gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    firebase.firestore()
                    .collection("votes")
                    .doc(gameId)
                    .collection("gameVotes")
                    .doc(firebase.auth().currentUser.uid)
                    .get()
                    .then((snapshot) => {
                        if (snapshot.exists) {
                        }
                        else {

                            firebase.firestore()
                            .collection("votes")
                            .doc(gameId)
                            .collection("gameVotes")
                            .doc(firebase.auth().currentUser.uid)
                            .set({})

                        }
                    })
                }
                else {
                    firebase.firestore()
                    .collection("votes")
                    .doc(gameId)
                    .collection("gameVotes")
                    .doc(firebase.auth().currentUser.uid)
                    .set({})
                    
                    const gameVotes = 
                        firebase.firestore()
                        .collection("votes")
                        .doc(gameId)
                        .collection("gameVotes")
                        .doc('info')

                    gameVotes
                        .set({
                            gameDate: gameDate,
                            awayCount: 0,
                            homeCount: 0,
                            drawCount: 0,
                            gamePostsCount: 0,

                        })
                }
            })
    }

    const increaseAwayCount = () => {
        firebase.firestore()
            .collection("votes")
            .doc(gameId)
            .collection("gameVotes")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    
                }
                else {

                    firebase.firestore()
                    .collection("votes")
                    .doc(gameId)
                    .collection("gameVotes")
                    .doc('info')
                    .update({
                        awayCount: firebase.firestore.FieldValue.increment(1)
                    })

                }
            })
    }

    const increaseHomeCount = () => {
        firebase.firestore()
            .collection("votes")
            .doc(gameId)
            .collection("gameVotes")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    
                }
                else {

                    firebase.firestore()
                    .collection("votes")
                    .doc(gameId)
                    .collection("gameVotes")
                    .doc('info')
                    .update({
                        homeCount: firebase.firestore.FieldValue.increment(1)
                    })

                }
            })
    }

    const increaseDrawCount = () => {
        firebase.firestore()
            .collection("votes")
            .doc(gameId)
            .collection("gameVotes")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    
                }
                else {

                    firebase.firestore()
                    .collection("votes")
                    .doc(gameId)
                    .collection("gameVotes")
                    .doc('info')
                    .update({
                        drawCount: firebase.firestore.FieldValue.increment(1)
                    })

                }
            })
    }

    const setVoteCount = () => {
        firebase.firestore()
        .collection("votes")
        .doc(gameId)
        .collection("gameVotes")
        .doc("info")
        .get()
        .then((snapshot) => {
            if (snapshot.exists) {
                let votes = snapshot.data();

                const away = votes.awayCount ? parseFloat((votes.awayCount / (votes.awayCount + votes.homeCount + votes.drawCount))*100).toFixed(0)+"%" : null 
                const home = votes.homeCount ? parseFloat((votes.homeCount / (votes.awayCount + votes.homeCount + votes.drawCount))*100).toFixed(0)+"%" : null
                const draw = votes.drawCount ? parseFloat((votes.drawCount / (votes.awayCount + votes.homeCount + votes.drawCount))*100).toFixed(0)+"%" : null 

                setAwayVote(away)
                setHomeVote(home)
                setDrawVote(draw)

            }
            else {
            }
        })

    }

    const renderListItem = ({ item }) => {
        return (
            <View>
                <View style={styles.golfGameContainer}>
                        <View style={styles.golfOddsContainer}>
                            <View style={styles.golfPlayerContainer}>
                                <Text style={styles.golfPlayerText}>{item.playerName}</Text>
                            </View>
                            <View>
                                {item.playerOdds > 0 ?
                                <Text>+{item.playerOdds}</Text> : <Text>{item.playerOdds}</Text>
                                } 
                            </View>
                            
                        </View>
                </View>
            </View>
        )
    }

   

    const openAdLink = () => {

        analytics().logEvent('adClick', {user_name: props.currentUser.name, sponsorName: 'betalytics'});
            
        }


    const handleReportPostEmail = (name, caption) => {

        analytics().logEvent('reportPost', {user_name: props.currentUser.name});

        const to = ['ReportPost@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'LoccTocc Report Post',
            body: name && caption
        }).catch(console.error)
    }

    const reportPostHandler = (name, caption) => {
        Alert.alert(
            'Report Post',
            'Please report this post if you feel it contains objectionable content. Our team will investigate within 24 hours and may remove the content or content creator based on our findings.',
            
            [
                { text: 'Report', onPress: () => handleReportPostEmail({name, caption})},
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
            ],
            { cancelable: true }

        )
    }

    const EmptyListMessage = () => {
        return (
          // Flat List Item
          <Text
            style={styles.emptyListStyle}
            >
            No posts yet, click the + button below to be the first!
          </Text>
        );
      };

    const sortFunction = () => {
        if (sortCriteria == true) {
            setSortCriteria(false)
        } else {
            setSortCriteria(true)
            analytics().logEvent('sortPosts', {user_name: props.currentUser.name});
        }
    }

    const listAllPlayersFunction = () => {
        if (listAllPlayers == true) {
            setListAllPlayers(false)
        } else {
            setListAllPlayers(true)
            analytics().logEvent('seeAllPlayers', {user_name: props.currentUser.name});
        }
    }

    const fetchNBAPropData = async (propName, propOverOdds, propUnderOdds) => {

        analytics().logEvent('selectNBAProps', {user_name: props.currentUser.name});

        const playerData = await firebase.firestore()
          .collection("nba")
          .doc("props")
          .collection("players")
          .where('gameId', '==', gameId)
          .get();
      
        const filteredPlayerTotal = playerData.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((player) => player.hasOwnProperty(propName))
          .map((player) => ({ id: player.id, [propName]: player[propName] }));
      
        const filteredPlayerOverOdds = playerData.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((player) => player.hasOwnProperty(propOverOdds))
          .map((player) => ({ id: player.id, [propOverOdds]: player[propOverOdds] }));
      
        const filteredPlayerUnderOdds = playerData.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((player) => player.hasOwnProperty(propUnderOdds))
          .map((player) => ({ id: player.id, [propUnderOdds]: player[propUnderOdds] }));
      
        const filteredPlayer = filteredPlayerTotal.concat(filteredPlayerOverOdds, filteredPlayerUnderOdds)
          .reduce((acc, curr) => {
            const existingPlayer = acc.find(p => p.id === curr.id);
            if (existingPlayer) {
              Object.assign(existingPlayer, curr);
            } else {
              acc.push(curr);
            }
            return acc;
          }, []);

          setPlayerProps(filteredPlayer)
      
      };

      const fetchNHLPropData = async (propName, propOverOdds, propUnderOdds) => {

        analytics().logEvent('selectNHLProps', {user_name: props.currentUser.name});

        const playerData = await firebase.firestore()
          .collection("nhl")
          .doc("props")
          .collection("players")
          .where('gameId', '==', gameId)
          .get();
      
        const filteredPlayerTotal = playerData.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((player) => player.hasOwnProperty(propName))
          .map((player) => ({ id: player.id, [propName]: player[propName] }));
      
        const filteredPlayerOverOdds = playerData.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((player) => player.hasOwnProperty(propOverOdds))
          .map((player) => ({ id: player.id, [propOverOdds]: player[propOverOdds] }));
      
        const filteredPlayerUnderOdds = playerData.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((player) => player.hasOwnProperty(propUnderOdds))
          .map((player) => ({ id: player.id, [propUnderOdds]: player[propUnderOdds] }));
      
        const filteredPlayer = filteredPlayerTotal.concat(filteredPlayerOverOdds, filteredPlayerUnderOdds)
          .reduce((acc, curr) => {
            const existingPlayer = acc.find(p => p.id === curr.id);
            if (existingPlayer) {
              Object.assign(existingPlayer, curr);
            } else {
              acc.push(curr);
            }
            return acc;
          }, []);

          setPlayerProps(filteredPlayer)
      
      };

      const setPropDataTypes = async (propName, propShortName, propOverOdds, propUnderOdds) => {
        setPropDescription(propName)
        setPropOver(propOverOdds)
        setPropUnder(propUnderOdds)
        setPropShortName(propShortName)
    
      };
      


      const renderPlayerPropItem = useCallback(({ item }) => (
        <View style={styles.propsContainer}>
          <View style={styles.propsNameContainer}>
            <Text style={{ fontWeight: 'bold' }}>{item.id}</Text>
          </View>
          <View style={styles.propsOddsMainContainer}>
            <View style={styles.propsOddsContainer}>
              {propDescription && (
                <>
                  <Text style={styles.spreadText}>O {item[propDescription]}</Text>
                  {item[propOver] > 0 ? (
                    <Text style={styles.oddsTopRowText}>+{item[propOver]}</Text>
                  ) : (
                    <Text style={styles.oddsTopRowText}>{item[propOver]}</Text>
                  )}
                </>
              )}
            </View>
            <View style={styles.propsOddsContainer}>
              {propDescription && (
                <>
                  <Text style={styles.spreadText}>U {item[propDescription]}</Text>
                  {item[propUnder] > 0 ? (
                    <Text style={styles.oddsTopRowText}>+{item[propUnder]}</Text>
                  ) : (
                    <Text style={styles.oddsTopRowText}>{item[propUnder]}</Text>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      ), [propDescription, propOver, propUnder]);

    const renderNBAPlayerPropListItem = ({ item }) => (
        <View style={styles.playerPropListItemContainer}>
            <TouchableOpacity onPress={() => {
                handlePresentModal();
                fetchNBAPropData(item.propTitle, item.propOverOdds, item.propUnderOdds);
                setPropDataTypes(item.propTitle, item.propName, item.propOverOdds, item.propUnderOdds);
                }}>
                <Text style={styles.playerPropListItemText}>{item.propName}</Text>
            </TouchableOpacity>
        </View>
        
        
    );

    const renderNHLPlayerPropListItem = ({ item }) => (
        <View style={styles.playerPropListItemContainer}>
            <TouchableOpacity onPress={() => {
                handlePresentModal();
                fetchNHLPropData(item.propTitle, item.propOverOdds, item.propUnderOdds);
                setPropDataTypes(item.propTitle, item.propName, item.propOverOdds, item.propUnderOdds);
                }}>
                <Text style={styles.playerPropListItemText}>{item.propName}</Text>
            </TouchableOpacity>
        </View>
        
        
    );

  const nbaPlayerPropList = [
      {
          id: '1',
          propName: 'Points',
          propTitle: 'player_pointsTotal',
          propOverOdds: 'player_pointsOverOdds',
          propUnderOdds: 'player_pointsUnderOdds',
      },
      {
          id: '2',
          propName: 'Rebounds',
          propTitle: 'player_reboundsTotal',
          propOverOdds: 'player_reboundsOverOdds',
          propUnderOdds: 'player_reboundsUnderOdds'
      },
      {
          id: '3',
          propName: 'Assists',
          propTitle: 'player_assistsTotal',
          propOverOdds: 'player_assistsOverOdds',
          propUnderOdds: 'player_assistsUnderOdds'
      },
      {
          id: '4',
          propName: 'Threes',
          propTitle: 'player_threesTotal',
          propOverOdds: 'player_threesOverOdds',
          propUnderOdds: 'player_threesUnderOdds'
      },
      {
          id: '5',
          propName: 'P/R/A',
          propTitle: 'player_points_rebounds_assistsTotal',
          propOverOdds: 'player_points_rebounds_assistsOverOdds',
          propUnderOdds: 'player_points_rebounds_assistsUnderOdds'
      },
      {
          id: '6',
          propName: 'P/R',
          propTitle: 'player_points_reboundsTotal',
          propOverOdds: 'player_points_reboundsOverOdds',
          propUnderOdds: 'player_points_reboundsUnderOdds'
      },
      {
          id: '7',
          propName: 'P/A',
          propTitle: 'player_points_assistsTotal',
          propOverOdds: 'player_points_assistsOverOdds',
          propUnderOdds: 'player_points_assistsUnderOdds'
      },
      {
          id: '8',
          propName: 'Steals',
          propTitle: 'player_stealsTotal',
          propOverOdds: 'player_stealsOverOdds',
          propUnderOdds: 'player_stealsUnderOdds'
      },
      {
          id: '9',
          propName: 'Blocks',
          propTitle: 'player_blocksTotal',
          propOverOdds: 'player_blocksOverOdds',
          propUnderOdds: 'player_blocksUnderOdds'
      },
      {
          id: '10',
          propName: 'Turnovers',
          propTitle: 'player_turnoversTotal',
          propOverOdds: 'player_turnoversOverOdds',
          propUnderOdds: 'player_turnoversUnderOdds'
      },
    ];

    const nhlPlayerPropList = [
        {
            id: '1',
            propName: 'Points',
            propTitle: 'player_pointsTotal',
            propOverOdds: 'player_pointsOverOdds',
            propUnderOdds: 'player_pointsUnderOdds',
        },
        {
            id: '2',
            propName: 'Shots on Goal',
            propTitle: 'player_shots_on_goalTotal',
            propOverOdds: 'player_shots_on_goalOverOdds',
            propUnderOdds: 'player_shots_on_goalUnderOdds'
        },
        {
            id: '3',
            propName: 'Assists',
            propTitle: 'player_assistsTotal',
            propOverOdds: 'player_assistsOverOdds',
            propUnderOdds: 'player_assistsUnderOdds'
        },
        {
            id: '4',
            propName: 'Blocked Shots',
            propTitle: 'player_blocked_shotsTotal',
            propOverOdds: 'player_blocked_shotsOverOdds',
            propUnderOdds: 'player_blocked_shotsUnderOdds'
        },
        {
            id: '5',
            propName: 'Power Play Points',
            propTitle: 'player_power_play_pointsTotal',
            propOverOdds: 'player_power_play_pointsOverOdds',
            propUnderOdds: 'player_power_play_pointsUnderOdds'
        },
        
      ];

    const bottomSheetModalRef = useRef(null)

    const snapPoints = ["60%", "95%"]

    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
        setIsOpen(true);
    }

   
        
   
    
    const renderItem =  ({ item, index }) => {
        return (
            <View>
                { item.blocked == true || item.id == postId ?

                null
                    
                :

                item.user !== undefined ?
                <View style={styles.feedItem}>
                    <TouchableOpacity
                    onPress={() => props.navigation.navigate("Profile", {uid: item.user.id})}>
                    <Avatar
                        source={{ uri: item.user.userImg }}
                        icon={{ name: 'person', type: 'ionicons', color: 'white' }}
                        overlayContainerStyle={{ backgroundColor: '#95B9C7' }}
                        style={{ width: 50, height: 50 }}
                        rounded
                        size="medium"
                    />
                </TouchableOpacity>
                <View style={styles.postRightContainer}>
                    
                    <View style={styles.postHeaderContainer}>
                        <Text style={styles.profileNameFeedText}>{item.user.name}</Text>
                        <Text style={styles.postTimeContainer}>{moment(item.creation.toDate()).fromNow()}</Text>
                    </View>
                    <View style={styles.postContentContainer}>
                        {item.caption != null ? <Text style={styles.captionText}>{item.caption}</Text> : null}
                        {item.downloadURL != "blank" ?
                            <View style={styles.postPictureContainer}>
                                <TouchableOpacity onPress={() => handleImagePress(item.downloadURL)}>
                                <Image
                                    resizeMode="cover"
                                    source={{ uri: item.downloadURL }}
                                    style={styles.postImage}
                                />
                                </TouchableOpacity>
                                <Modal visible={fullscreen} transparent={true}>
                                <TouchableOpacity style={styles.fullscreenContainer} onPress={() => setFullscreen(false)}>
                                    <Image resizeMode="contain" source={{ uri: selectedImage }} style={styles.fullscreenImage} />
                                </TouchableOpacity>
                                </Modal>
                            </View>
                            : null
                        }
                            {item.userTagList ? 
                                <View>
                                    {Array.isArray(item.userTagList) ? 
                                    item.userTagList.map((user, index) => (
                                        <Text key={index} style={{ color: '#0033cc', fontWeight: 'bold' }}>@{user}</Text>
                                    )) 
                                    :
                                    item.userTagList.split(',').map((user, index) => (
                                        <Text key={index} style={{ color: '#0033cc', fontWeight: 'bold' }}>@{user.trim()}</Text>
                                    ))
                                    }
                                </View>
                                : null
                            }
                    </View>
                    <View style={styles.postFooterContainer}>
                        { item.liked == true ?
                        <View style={styles.likeContainer}>
                            <TouchableOpacity
                                onPress={() => {onDislikePress(item.user.id, item.id); deleteLike(item.id)}} >
                                <Ionicons name={"hammer"} size={20} color={"black"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('LikesList', {userId: item.creator, postId: item.id})} >
                                <Text style={styles.likeNumber}>{item.likesCount}</Text>
                            </TouchableOpacity>
                        </View>
                        
                        :
                        
                        <View style={styles.likeContainer}>
                            <TouchableOpacity
                                onPress={() => {onLikePress(item.user.id, item.id); storeLike(item.id); sendNotificationForLike(item.user.id, item.user.name)}}> 
                                <Ionicons name={"hammer-outline"}  size={20} color={"grey"}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('LikesList', {userId: item.creator, postId: item.id})} >
                                <Text style={styles.likeNumber}>{item.likesCount}</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        { item.faded == true ?
                        <View style={styles.likeContainer}>
                            <TouchableOpacity
                                onPress={() => {onUnfadePress(item.user.id, item.id); deleteFade(item.id)}} >
                                <Foundation name={"skull"} size={20} color={"black"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('FadesList', {userId: item.creator, postId: item.id})} >
                                <Text style={styles.likeNumber}>{item.fadesCount}</Text>
                            </TouchableOpacity>
                        </View>
                        
                        :
                        
                        <View style={styles.likeContainer}>
                            <TouchableOpacity
                                onPress={() => {onFadePress(item.user.id, item.id); storeFade(item.id), sendNotificationForFade(item.user.id, item.user.name)}}> 
                                <Foundation name={"skull"}  size={20} color={"#B3B6B7"}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('FadesList', {userId: item.creator, postId: item.id})} >
                                <Text style={styles.likeNumber}>{item.fadesCount}</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        <TouchableOpacity
                            style={styles.commentsContainer}
                            onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.id, posterId: item.user.id, posterName: item.user.name, postCreation: item.creation, postCaption: item.caption, posterImg: item.user.userImg, postImg: item.downloadURL, awayTeam: awayTeam, homeTeam: homeTeam })}>
                            <Ionicons name={"chatbubble-outline"} size={20} color={"grey"} marginRight={10} />
                            <Text style={styles.likeNumber}>{item.comments}</Text>
                        </TouchableOpacity>
                        {sport == 'formula1' ? 
                        null
                        :
                        <TouchableOpacity
                            style={styles.commentsContainer}
                            onPress={() => props.navigation.navigate('SocialShare', {gameId: gameId, gameDate: gameDate, homeTeam: homeTeam, awayTeam: awayTeam, homeSpread: homeSpread, awaySpread: awaySpread, homeSpreadOdds: homeSpreadOdds, awaySpreadOdds: awaySpreadOdds, awayMoneyline: awayMoneyline, homeMoneyline: homeMoneyline, over: over, overOdds: overOdds, under: under, underOdds: underOdds, sport: sport,
                                posterName: item.user.name, postCreation: item.creation, postCaption: item.caption, posterImg: item.user.userImg, postImg: item.downloadURL, userTagList: item.userTagList, likesCount: item.likesCount, fadesCount: item.fadesCount, comment: item.comments
                                })}>
                            <Ionicons name={"share-outline"} size={20} color={"grey"} marginRight={10} />
                        </TouchableOpacity>
                        }
                        <TouchableOpacity
                            style={styles.flagContainer}
                            onPress={() => reportPostHandler({name: item.user.name, caption: item.caption})}>
                            <Icon name={"ios-flag"} size={20} color={"grey"} marginRight={10} />
                        </TouchableOpacity>
                    </View>
                </View>
                    

                    </View>
                    
                    : null}
            </View>
        )}
      
    const navigation = useNavigation();

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    backgroundStyle={{ borderRadius: 50, }}
                    onDismiss={() => setIsOpen(false)}
                >
                    <View style={styles.bottomSheetContainer}>
                        <Text style={styles.bottomSheetTitle}>Player Props</Text>
                        <Text style={styles.spreadText}>{propShortName}</Text>
                        {propDescription ? (
                            <BottomSheetFlatList
                            data = {playerProps}
                            renderItem={renderPlayerPropItem}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={<Text style={styles.emptyListMessage}>No player props for this game currently</Text>}

                            />
                                ) : (
                            <ActivityIndicator />
                                )}
                    </View>
            </BottomSheetModal>
            
        <View style={[styles.container,{ backgroundColor: isOpen ? "#e1e2e6" : "white" }]}>
            <View style={styles.gameContainer}>
            {sport == 'basketball_nba' || sport == 'basketball_ncaab' ? 
                <FlatList
                    data={nbaPlayerPropList}
                    renderItem={renderNBAPlayerPropListItem}
                    horizontal={true}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{paddingHorizontal: 5,marginBottom:6, borderBottomColor: "#e1e2e6", borderBottomWidth: 1}}
                />
            : null}

            {sport == 'icehockey_nhl'  ? 
                <FlatList
                    data={nhlPlayerPropList}
                    renderItem={renderNHLPlayerPropListItem}
                    horizontal={true}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{paddingHorizontal: 5,marginBottom:6, borderBottomColor: "#e1e2e6", borderBottomWidth: 1}}
                />
            : null}

            {sport == 'US Tournament Lines - Winner' || 
            sport == 'NFL - Suberbowl Champion' ||
            sport == 'MLB - World Series Winner' ||
            sport == 'NBA - Championship' ||
            sport == 'NHL - Stanley Cup Winner' ||
            sport == 'FIFA World Cup Winner'
           
            ?
            
            <View style={styles.gameHeaderContainer}>
                <Text style={styles.gameHeaderText}>{sport}</Text>
                <TouchableOpacity 
                    onPress={() => {listAllPlayersFunction()}}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            :
            <View></View> 
            
            }
                <View>
                    {
                    sport == 'NFL - Suberbowl Champion' || sport == 'MLB - World Series Winner' || sport == 'NBA - Championship' || sport == 'NHL - Stanley Cup Winner' || sport == 'FIFA World Cup Winner' ?
                    listAllPlayers == false ?
                    <FlatList 
                        data = {futureGames.sort((a, b) => parseFloat(a.playerOdds) - parseFloat(b.playerOdds)).filter(futureSport => futureSport.sport == sport).slice(0, 5)}
                        renderItem={renderListItem}
                    />
                    :
                    <FlatList 
                        data = {futureGames.sort((a, b) => parseFloat(a.playerOdds) - parseFloat(b.playerOdds)).filter(futureSport => futureSport.sport == sport)}
                        renderItem={renderListItem}
                    />

                    :

                    sport == 'formula1' ?
                    <View>
                        <View style={styles.teamContainer} >
                            <View style={styles.headerView}>
                                <Text style={styles.detailsHeader}>Race</Text>
                            </View>
                            <View style={styles.detailsView}>
                                <Text style={styles.detailsText}>{props.formula1Races.raceName}</Text>
                            </View>
                        </View>
                        <View style={styles.teamContainer} >
                            <View style={styles.headerView}>
                                <Text style={styles.detailsHeader}>Track</Text>
                            </View>
                            <View style={styles.detailsView}>
                                <Text style={styles.detailsText}>{props.formula1Races.trackName}</Text>
                            </View>
                        </View>
                        <View style={styles.teamContainer} >
                            <View style={styles.headerView}>
                                <Text style={styles.detailsHeader}>City</Text>
                            </View>
                            <View style={styles.detailsView}>
                                <Text style={styles.detailsText}>{props.formula1Races.raceCity}</Text>
                            </View>
                        </View>
                        <View style={styles.teamContainer} >
                            <View style={styles.headerView}>
                                <Text style={styles.detailsHeader}>Country</Text>
                            </View>
                            <View style={styles.detailsView}>
                                <Text style={styles.detailsText}>{props.formula1Races.raceCountry}</Text>
                            </View>
                        </View>
                        <View style={styles.teamContainer} >
                            <View style={styles.headerView}>
                                <Text style={styles.detailsHeader}>Distance</Text>
                            </View>
                            <View style={styles.detailsView}>
                                <Text style={styles.detailsText}>{props.formula1Races.raceDistance}</Text>
                            </View>
                        </View>
                        <View style={styles.teamContainer} >
                            <View style={styles.headerView}>
                                <Text style={styles.detailsHeader}>Total Laps</Text>
                            </View>
                            <View style={styles.detailsView}>
                                <Text style={styles.detailsText}>{props.formula1Races.totalLaps}</Text>
                            </View>
                        </View>
                    </View>
                    
                    :

                    sport == 'Fantasy' ?
                    <View style={styles.gameHeaderContainer}>
                        <Text style={styles.gameHeaderText}>{sport} - {fantasyTopic}</Text>
                    </View>
                    
                    :

                    sport == 'US Tournament Lines - Winner' ?
                    listAllPlayers == false ?
                    <FlatList 
                        data = {golfGames.sort((a, b) => parseFloat(a.playerOdds) - parseFloat(b.playerOdds)).slice(0, 5)}
                        renderItem={renderListItem}
                    />

                    :
                    
                    <FlatList 
                        data = {golfGames.sort((a, b) => parseFloat(a.playerOdds) - parseFloat(b.playerOdds))}
                        renderItem={renderListItem}
                    />
                    :
                    sport == 'soccer_epl' ? 
                    <View>
                         
                        <View style={styles.awayGameInfoContainer}>
                            <View style={styles.teamItem}>
                                <TouchableOpacity
                                    onPress={() => {gameVote(); increaseAwayCount()}}>
                                    <View style={styles.voteContainer}>
                                        <Text style={styles.teamText}>{awayTeam}</Text>

                                        {awayVote == '0%' ? 
                                            <Text style={styles.noVote}>{awayVote} </Text>
                                            :
                                            awayVote == '100%' ? 
                                                <Text style={styles.winningVote}>{awayVote} </Text> 
                                                :
                                                awayVote == '50%' ? 
                                                <Text style={styles.noVote}>{awayVote} </Text> 
                                                :
                                                awayVote > '50%' ? 
                                                <Text style={styles.winningVote}>{awayVote} </Text> 
                                                :
                                                <Text style={styles.losingVote}>{awayVote} </Text>
                                            
                                        }
                                        
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.moneylineItem}>
                                {awayMoneyline > 0 ? 
                                    <Text style={styles.spreadText}>+{awayMoneyline}</Text> 
                                    : <Text style={styles.spreadText}>{awayMoneyline}</Text>
                                }
                            </View>
                            <View style={styles.totalItem}>
                                <Text style={styles.spreadText}>{over}</Text>
                                {overOdds > 0 ? 
                                    <Text style={styles.oddsTopRowText}>+{overOdds}</Text> 
                                    : <Text style={styles.oddsTopRowText}>{overOdds}</Text>
                                }
                            </View>
                        </View>
                        <View style={styles.awayGameInfoContainer}>
                            <View style={styles.teamItem}>
                                <TouchableOpacity
                                    onPress={() => {gameVote(); increaseHomeCount()}}>
                                    <View style={styles.voteContainer}>
                                        <Text style={styles.teamText}>{homeTeam}</Text>
                                        

                                        {homeVote == '0%' ? 
                                            <Text style={styles.noVote}>{homeVote} </Text>
                                            :
                                            homeVote == '100%' ? 
                                                <Text style={styles.winningVote}>{homeVote} </Text> 
                                                :
                                                homeVote == '50%' ? 
                                                <Text style={styles.noVote}>{homeVote} </Text> 
                                                :
                                                homeVote > '50%' ? 
                                                <Text style={styles.winningVote}>{homeVote} </Text> 
                                                :
                                                <Text style={styles.losingVote}>{homeVote} </Text>
                                            
                                        }
                                        
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.moneylineItem}>
                                {homeMoneyline > 0 ? 
                                    <Text style={styles.spreadText}>+{homeMoneyline}</Text> 
                                    : <Text style={styles.spreadText}>{homeMoneyline}</Text>
                                }
                            </View>
                            <View style={styles.totalItem}>
                                <Text style={styles.spreadText}>{under}</Text> 
                                {underOdds > 0 ?
                                    <Text style={styles.oddsBottomRowText}>+{underOdds}</Text>
                                    : <Text style={styles.oddsBottomRowText}>{underOdds}</Text>
                                }
                            </View>
                        </View>
                        <View style={styles.homeGameInfoContainer}>
                            <View style={styles.teamItem}>
                                <TouchableOpacity
                                    onPress={() => {gameVote(); increaseDrawCount()}}>
                                    <View style={styles.voteContainer}>
                                        <Text style={styles.teamText}>Draw</Text>

                                        {drawVote == '0%' ? 
                                            <Text style={styles.noVote}>{drawVote} </Text>
                                            :
                                            drawVote == '100%' ? 
                                                <Text style={styles.winningVote}>{drawVote} </Text> 
                                                :
                                                drawVote == '50%' ? 
                                                <Text style={styles.noVote}>{drawVote} </Text> 
                                                :
                                                drawVote > '50%' ? 
                                                <Text style={styles.winningVote}>{drawVote} </Text> 
                                                :
                                                <Text style={styles.losingVote}>{drawVote} </Text>
                                            
                                        }
                                        
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.moneylineItem}>
                                {drawMoneyline > 0 ? 
                                    <Text style={styles.spreadText}>+{drawMoneyline}</Text> 
                                    : <Text style={styles.spreadText}>{drawMoneyline}</Text>
                                }
                            </View>
                            <View style={styles.totalItem}>
                                <Text style={styles.spreadText}>{under}</Text> 
                                {underOdds > 0 ?
                                    <Text style={styles.oddsBottomRowText}>+{underOdds}</Text>
                                    : <Text style={styles.oddsBottomRowText}>{underOdds}</Text>
                                }
                            </View>
                        </View>
                    </View>
                    :
                        <View>
                        <View style={styles.awayGameInfoContainer}>
                               
                                
                            <View style={styles.teamItem}>
                                <TouchableOpacity
                                    onPress={() => {gameVote(); increaseAwayCount()}}>
                                    <View style={styles.voteContainer}>
                                        {sport == 'mma_mixed_martial_arts' ?
                                        null
                                        :
                                        <Image  source={{ uri: awayTeamLogo }} style={styles.logoImage} />}
                                        <Text style={styles.teamText}>{awayTeam}</Text>
                                        {awayVote == '0%' ? 
                                            <Text style={styles.noVote}>{awayVote} </Text>
                                            :
                                            awayVote == '100%' ? 
                                                <Text style={styles.winningVote}>{awayVote} </Text> 
                                                :
                                                awayVote == '50%' ? 
                                                <Text style={styles.noVote}>{awayVote} </Text> 
                                                :
                                                awayVote > '50%' ? 
                                                <Text style={styles.winningVote}>{awayVote} </Text> 
                                                :
                                                <Text style={styles.losingVote}>{awayVote} </Text>
                                            
                                        }
                                        
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.moneylineItem}>
                                {awayMoneyline > 0 ? 
                                    <Text style={styles.spreadText}>+{awayMoneyline}</Text> 
                                    : <Text style={styles.spreadText}>{awayMoneyline}</Text>
                                }
                            </View>
                            <View style={styles.spreadItem}>
                                {awaySpread > 0 ? 
                                    <Text style={styles.spreadText}>+{awaySpread}</Text> 
                                    : <Text style={styles.spreadText}>{awaySpread}</Text>
                                }
                                {awaySpreadOdds > 0 ? 
                                    <Text style={styles.oddsTopRowText}>+{awaySpreadOdds}</Text> 
                                    : <Text style={styles.oddsTopRowText}>{awaySpreadOdds}</Text>
                                }
                            </View>
                            <View style={styles.totalItem}>
                                {sport == 'mma_mixed_martial_arts' ?
                                <Text style={styles.spreadText}>{over}</Text>
                                :
                                <Text style={styles.spreadText}>{over}</Text>
                                }
                                {overOdds > 0 ? 
                                    <Text style={styles.oddsTopRowText}>+{overOdds}</Text> 
                                    : <Text style={styles.oddsTopRowText}>{overOdds}</Text>
                                }
                            </View>
                        </View>
                        <View style={styles.homeGameInfoContainer}>
                            <View style={styles.teamItem}>
                                <TouchableOpacity
                                    onPress={() => {gameVote(); increaseHomeCount()}}>
                                    <View style={styles.voteContainer}>
                                        {sport == 'mma_mixed_martial_arts' ?
                                        null
                                        :
                                        <Image  source={{ uri: homeTeamLogo }} style={styles.logoImage} />}
                                        <Text style={styles.teamText}>{homeTeam}</Text>

                                        {homeVote == '0%' ? 
                                            <Text style={styles.noVote}>{homeVote} </Text>
                                            :
                                            homeVote == '100%' ? 
                                                <Text style={styles.winningVote}>{homeVote} </Text> 
                                                :
                                                homeVote == '50%' ? 
                                                <Text style={styles.noVote}>{homeVote} </Text> 
                                                :
                                                homeVote > '50%' ? 
                                                <Text style={styles.winningVote}>{homeVote} </Text> 
                                                :
                                                <Text style={styles.losingVote}>{homeVote} </Text>
                                            
                                        }
                                        
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.moneylineItem}>
                                {homeMoneyline > 0 ? 
                                    <Text style={styles.spreadText}>+{homeMoneyline}</Text> 
                                    : <Text style={styles.spreadText}>{homeMoneyline}</Text>
                                }
                            </View>
                            <View style={styles.spreadItem}>
                                {homeSpread > 0 ? 
                                    <Text style={styles.spreadText}>+{homeSpread}</Text> 
                                    : <Text style={styles.spreadText}>{homeSpread}</Text>
                                }
                                {homeSpreadOdds > 0 ?
                                    <Text style={styles.oddsBottomRowText}>+{homeSpreadOdds}</Text>
                                    : <Text style={styles.oddsBottomRowText}>{homeSpreadOdds}</Text>
                                }
                                
                            </View>
                            <View style={styles.totalItem}>
                                {sport == 'mma_mixed_martial_arts' ?
                                <Text style={styles.spreadText}>{under}</Text>
                                :
                                <Text style={styles.spreadText}>{under}</Text>
                                }
                                {underOdds > 0 ?
                                    <Text style={styles.oddsBottomRowText}>+{underOdds}</Text>
                                    : <Text style={styles.oddsBottomRowText}>{underOdds}</Text>
                                }
                            </View>
                        </View>
                    </View>
                    
                    }
                </View>                    
            </View> 
            <View style={styles.sortContainer}>
                <Text style={styles.sortText}>Sort: </Text>
                <TouchableOpacity 
                    onPress={() => {sortFunction()}}>
                    <Foundation name={"clock"} size={20} color={"#33A8FF"} />
                </TouchableOpacity>
                <Text style={styles.sortText}> or </Text>
                <TouchableOpacity 
                    onPress={() => {sortFunction()}}>
                    <MaterialCommunityIcons name={"arrow-vertical-lock"} size={20} color={"#33A8FF"} />
                </TouchableOpacity>
            </View>
            {sortCriteria == true ? 
            <FlatList
                data = {combinedData.sort(function (x, y) {return y.creation - x.creation})}
                ListEmptyComponent={EmptyListMessage}
                onRefresh={() => fetchCombinedData()}
                refreshing={loading}
                renderItem={renderItem}
            />
                : 

                
            <FlatList
                data = {combinedData.sort((a, b) => parseFloat(b.likesCount) - parseFloat(a.likesCount))}
                ListEmptyComponent={EmptyListMessage}
                onRefresh={() => fetchCombinedData()}
                refreshing={loading}
                renderItem={renderItem}
            />
            }

            
         

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => props.navigation.navigate('NewPost', { gameId: gameId, homeTeam: homeTeam, awayTeam: awayTeam, gameDate: gameDate, sport: sport})}
            >
                <MaterialCommunityIcons name={"plus"} size={30} color="white" />
            </TouchableOpacity>

            <View  style={styles.adView}>
                <TouchableOpacity
                    style={{ width: "90%", height: 60, alignItems: 'center', backgroundColor: "red"}}
                    onPress={() => { Linking.openURL('https://betalytics.com'); openAdLink()}} >
                    <Image 
                        source={require('../../assets/betalyticsBanner.png')}
                        style={{   width: "100%", height: 60, resizeMode: 'stretch'  }}
                    />
                </TouchableOpacity>
            </View> 
            
        </View>
        </BottomSheetModalProvider>

        
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 2,
        backgroundColor: "#ffffff",
    },
    gameContainer: {
        padding: 6,
        marginVertical:4,
        marginRight: "1%",
        marginLeft: "1%",
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",

    },
    awayGameInfoContainer: { 
        flexDirection: 'row',
    },
    homeGameInfoContainer: { 
        flexDirection: 'row',
    },
    gameHeaderText: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
    spreadText: {
        textAlign: 'right',
    },
    oddsTopRowText: {
        textAlign: 'right',
        color: 'grey',
        paddingBottom: 5,
        fontSize: 12,
    },
    oddsBottomRowText: {
        textAlign: 'right',
        color: 'grey',
        fontSize: 12,
    },
    teamItem: {
        width: "55%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 2,
    },
    teamNameItem: {
        width: "90%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 2,
    },
    spreadItem: {
        width: "15%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    moneylineItem: {
        width: "15%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    totalItem: {
        width: "15%",
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    gameHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: '4%'
    },
    postButtonContainer: {
        paddingBottom: 5,
        borderBottomColor: "#CACFD2",
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    shareText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    feedItem:{
        padding:6,
        marginVertical:5,
        marginHorizontal:5,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
        flexDirection: 'row',
    },
    postPictureContainer: {
        width: 250,
        height: 200,
        aspectRatio: 1 * 1.4
    },
    postImage: {
        resizeMode: "contain",
        width: "100%",
        height: "100%",
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      },
      fullscreenImage: {
        flex: 1,
        width: "100%",
        height: "100%",
      },
    captionText: {
        paddingBottom: 5,
    },
    profilePhotoCommentContainer: {
        width: 50,
        height: 50,
        borderRadius: 40,
        backgroundColor: "#e1e2e6"
      },
    likeContainer: {
        flexDirection: 'row',
    },
    commentsContainer: {
        flexDirection: 'row',
    },
    flagContainer: {
        flexDirection: 'row',
    },
    likeNumber: {
        marginLeft: 5,
        marginTop: 5,
        color: "grey",
    },
    profileNameFeedText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postTimeContainer: {
        fontSize: 10,
    },
    postContentContainer: {
        width: "95%",
        marginLeft: "3%",
    },
    postHeaderContainer: {
        flexDirection: 'row',
        width: "95%",
        justifyContent: 'space-between',
        paddingBottom: 4,
        marginLeft: "3%",
    },
    postFooterContainer: {
        flexDirection: 'row',
        paddingTop: 4,
        justifyContent: 'space-between',
        width: "80%",
        paddingTop: 5,
        marginLeft: "3%",
        paddingBottom: 2,
    },
    postRightContainer: {
        flex: 1,
    },
    button: {
        backgroundColor: "#009387",
        position: 'absolute',
        bottom: 60,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: .7,
    },
    emptyListStyle: {
        padding: 10,
        fontSize: 18,
        textAlign: 'justify',
        marginHorizontal: "5%",
      },
    adView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    adContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
      },
    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginHorizontal: "2%",
    },
    sortText: {
        color: '#33A8FF' 
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    losingVote: {
        color: "#F9350E",
        fontSize: 12
    },
    winningVote: {
        color: "#35EA10",
        fontSize: 12
    },
    noVote: {
        color: "#B3B6B7",
        fontSize: 12
    },
    golfGameContainer: {
        padding: 10,
        marginRight: 2,
        marginLeft: 2,
        borderTopWidth: .8,
        borderTopColor: "#ccc",
        backgroundColor: "#ffffff",
    },
    golfOddsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    golfPlayerText: {
    },
    gameHeaderText: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
    dateText: {
        color: 'grey',
        fontSize: 12,
    },
    seeAllText: {
        color: '#2e64e5',
        fontWeight: 'bold',
        fontSize: 12,
    },
    formula1Container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%'
    },
    formula1TeamContainer: {
        paddingHorizontal: 10
    },
    listFormula1Text: {
        fontSize: 14,
    },
    detailsText: {
        fontSize: 12,
    },
    detailsHeader: {
        fontSize: 12,
        textTransform: 'uppercase',
        color: 'grey'
    },
    headerText: {
        fontSize: 16,
        
    },
    headerContainer: {
        alignItems: 'left'
    },
    borderView: {
        borderBottomColor: '#CACFD2',
        borderBottomWidth: 1,
    },
    detailsView:{
        
    },
    headerView:{
        width: '35%'
    },
    teamContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: '1%',
        paddingLeft: 4
    },
    bottomSheetContainer: {
        flex: 1,
        alignItems: 'center',
    },
    bottomSheetTitle: {
        fontWeight: "900",
        letterSpacing: .5,
        fontSize: 16
    },
    propsContainer: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        marginHorizontal: "10%",
        borderBottomColor: "#CACFD2",
        borderBottomWidth: 1,
    },
    propsOddsMainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "35%"
    },
    propsOddsContainer: {
        alignItems: 'center',
    },
    propsNameContainer: {
        width: "65%"
    },
    playerPropListItemContainer: {
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingBottom: 5,
        marginHorizontal: 8,
    },
    playerPropListItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    emptyListMessage: {
        textAlign: 'center',
        paddingTop: 20,
        fontSize: 16,
        color: 'grey'
    },
    logoImage: {
        resizeMode: "contain",
        width: 30,
        height: 30,
        marginRight: 10,
    },
    
    
})

const mapStateToProps = (store) => ({
    users: store.usersState.users,
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    blocking: store.userState.blocking,
    liked: store.userState.liked,
    faded: store.userState.faded,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
    futureGames: store.futureGamesState.futureGames,
    formula1Races: store.formula1RacesState.formula1Races,
    golfGames: store.golfGamesState.golfGames,
})

export default connect(mapStateToProps)(game);
