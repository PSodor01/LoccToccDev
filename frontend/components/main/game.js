import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, ActivityIndicator, Linking, FlatList, TouchableOpacity, Image, Platform} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import moment from 'moment'

import * as Device from 'expo-device';

import { useNavigation } from '@react-navigation/native';

import email from 'react-native-email'

import analytics from "@react-native-firebase/analytics";

import  firebase  from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function game(props) {

    const [gamePosts, setGamePosts] = useState([]);
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


    const {gameId, gameDate, homeTeam, awayTeam, homeMoneyline, awayMoneyline, homeSpread, awaySpread, homeSpreadOdds, awaySpreadOdds, over, overOdds, under, underOdds, drawMoneyline, sport, fantasyTopic} = props.route.params;

    useEffect(() => {
            fetchData()
            analytics().logScreenView({ screen_name: 'game', screen_class: 'game', user_name: props.currentUser.name})

            
        
    }, [props.blocking, props.liked, props.faded, props.route.params.postId, props.users])

    useEffect(() => {
        setGolfGames(props.golfGames)
        setFutureGames(props.futureGames)
        setFormula1Races(props.formula1Races)
    }, [])

    const fetchData = () => {
        function matchUserToGamePost(gamePosts) {
            for (let i = 0; i < gamePosts.length; i++) {
                if (gamePosts[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === gamePosts[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(gamePosts[i].creator, false)
                } else {
                    gamePosts[i].user = user
                }

                if (props.blocking.indexOf(gamePosts[i].creator) > -1) {
                    gamePosts[i].blocked = true
                } else {
                    gamePosts[i].blocked = false
                }

                if (props.liked.indexOf(gamePosts[i].id) > -1) {
                    gamePosts[i].liked = true
                } else {
                    gamePosts[i].liked = false
                }

                if (props.faded.indexOf(gamePosts[i].id) > -1) {
                    gamePosts[i].faded = true
                } else {
                    gamePosts[i].faded = false
                }
                
            }
            setGamePosts(gamePosts)
            setLoading(false)
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
            .collectionGroup("userPosts")
            .where('gameId', '==', gameId)
            .orderBy('creation', 'desc')
            .get()
            .then((snapshot) => {

                let gamePosts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                    
                    matchUserToGamePost(gamePosts)

                })

        } else {
            matchUserToGamePost(gamePosts)
            setLoading(false)
        }
        
        setVoteCount()

    }

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

        const likedName = props.currentUser.name
        firebase.firestore()
            .collection("users")
            .doc(userId)
            .collection("notifications")
            .add({
                notificationType: "hammer",
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                otherUserId: firebase.auth().currentUser.uid,
                otherUsername: likedName,
                notificationText: 'hammered your post on the ' + awayTeam + "/" + homeTeam + " game",
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

        const likedName = props.currentUser.name
        firebase.firestore()
            .collection("users")
            .doc(userId)
            .collection("notifications")
            .add({
                notificationType: "fade",
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                otherUserId: firebase.auth().currentUser.uid,
                otherUsername: likedName,
                notificationText: 'faded your post on the ' + awayTeam + "/" + homeTeam + " game",
              })

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
        const message = {
            to: token,
            sound: 'default',
            body: notification ? notification : '',
            badge: 1,
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

    const testID = 'ca-app-pub-3940256099942544/2934735716';
    const productionID = 'ca-app-pub-8519029912093094/8554579884';
    // Is a real device and running in production.
    const adUnitID = Device.isDevice && !__DEV__ ? productionID : testID;

    const openAdLink = () => {

        analytics().logEvent('adClick', {user_name: props.currentUser.name, adPartner: 'Kutt'});
            
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

    
    
    const renderItem = ({item}) => {
        return (
            <View>
                { item.blocked == true || item.id == postId ?

                null
                    
                :

                item.user !== undefined ?
                <View style={styles.feedItem}>
                    <TouchableOpacity
                    onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}>
                    <Image 
                        style={styles.profilePhotoCommentContainer}
                        source={{uri: item.user ? item.user.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
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
                                <Image resizeMode={"cover"} source={{uri: item.downloadURL}} style={styles.postImage}/> 
                            </View>
                            : null}
                        {item.userTagList != null ? <Text style={{ color: '#0033cc', fontWeight: 'bold' }}>@{item.userTagList}</Text> : null}
                    </View>
                    <View style={styles.postFooterContainer}>
                        { item.liked == true ?
                        <View style={styles.likeContainer}>
                            <TouchableOpacity
                                onPress={() => {onDislikePress(item.user.uid, item.id); deleteLike(item.id)}} >
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
                                onPress={() => {onLikePress(item.user.uid, item.id); storeLike(item.id); sendNotificationForLike(item.user.uid, item.user.name)}}> 
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
                                onPress={() => {onUnfadePress(item.user.uid, item.id); deleteFade(item.id)}} >
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
                                onPress={() => {onFadePress(item.user.uid, item.id); storeFade(item.id), sendNotificationForFade(item.user.uid, item.user.name)}}> 
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
                            onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid, posterId: item.user.uid, posterName: item.user.name, postCreation: item.creation, postCaption: item.caption, posterImg: item.user.userImg, postImg: item.downloadURL, awayTeam: awayTeam, homeTeam: homeTeam })}>
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
        <View style={styles.container}>
            <View style={styles.gameContainer}>
            {sport == 'US Masters Tournament Lines - Winner' || 
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
                        style={styles.feed}
                        renderItem={renderListItem}
                    />
                    :
                    <FlatList 
                        data = {futureGames.sort((a, b) => parseFloat(a.playerOdds) - parseFloat(b.playerOdds)).filter(futureSport => futureSport.sport == sport)}
                        style={styles.feed}
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

                    sport == 'US Masters Tournament Lines - Winner' ?
                    listAllPlayers == false ?
                    <FlatList 
                        data = {golfGames.sort((a, b) => parseFloat(a.playerOdds) - parseFloat(b.playerOdds)).slice(0, 5)}
                        style={styles.feed}
                        renderItem={renderListItem}
                    />

                    :

                    
                    <FlatList 
                        data = {golfGames.sort((a, b) => parseFloat(a.playerOdds) - parseFloat(b.playerOdds))}
                        style={styles.feed}
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
                data = {gamePosts.sort(function (x, y) {return y.creation - x.creation})}
                ListEmptyComponent={EmptyListMessage}
                onRefresh={() => fetchData()}
                refreshing={loading}
                renderItem={renderItem}
            />
                : 

                
            <FlatList
                data = {gamePosts.sort((a, b) => parseFloat(b.likesCount) - parseFloat(a.likesCount))}
                ListEmptyComponent={EmptyListMessage}
                onRefresh={() => fetchData()}
                refreshing={loading}
                renderItem={renderItem}
            />
            }

            
            <View  style={styles.adView}>
                <TouchableOpacity
                    style={{ width: "95%", height: 40, alignItems: 'center', backgroundColor: 'black' }}
                    onPress={() => { Linking.openURL('https://apps.apple.com/us/app/kutt/id1578386177'); openAdLink()}} >
                    <Image 
                        source={require('../../assets/kuttBanner.png')}
                        style={{  height: 40, resizeMode: 'contain'  }}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => props.navigation.navigate('NewPost', { gameId: gameId, homeTeam: homeTeam, awayTeam: awayTeam, gameDate: gameDate, sport: sport})}
            >
                <MaterialCommunityIcons name={"plus"} size={30} color="white" />
            </TouchableOpacity>
            
        </View>
            
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 6,
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
        backgroundColor: "#ffffff",

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
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 2,
    },
    teamNameItem: {
        width: "90%",
        backgroundColor: "#ffffff",
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
    contestStatus: store.userState.contestStatus,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps,  mapDispatchProps)(game);
