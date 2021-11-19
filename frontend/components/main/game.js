import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Alert, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import moment from 'moment'

import { AdMobBanner } from 'expo-ads-admob'

import { useNavigation } from '@react-navigation/native';

import ShareButton from '../buttons/ShareButton'

import email from 'react-native-email'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function game(props) {

    const [gamePosts, setGamePosts] = useState([]);
    const [postId, setPostId] = useState("")
    const [loading, setLoading] = useState(true)
    const [sortCriteria, setSortCriteria] = useState(true)
    const [awayVote, setAwayVote] = useState("")
    const [homeVote, setHomeVote] = useState("")

    const {gameId, gameDate, homeTeam, awayTeam, homeMoneyline, awayMoneyline, homeSpread, awaySpread, homeSpreadOdds, awaySpreadOdds, over, overOdds, under, underOdds} = props.route.params;
    
    useEffect(() => {
            fetchData()
    }, [props.blocking, props.liked, props.faded, props.route.params.postId, props.users])

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
                    console.log(gamePosts)

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

    const gameVote = () => {

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

                const away = votes.awayCount ? parseFloat((votes.awayCount / (votes.awayCount + votes.homeCount))*100).toFixed(0)+"%" : null 
                const home = votes.homeCount ? parseFloat((votes.homeCount / (votes.awayCount + votes.homeCount))*100).toFixed(0)+"%" : null 

                setAwayVote(away)
                setHomeVote(home)

            }
            else {
            }
        })

    }


    const handleReportPostEmail = (name, caption) => {
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
        }
    }
    


    const renderItem = ({item}) => {
        return (
            <View>
                { item.blocked == true ?

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
                        {item.downloadURL != "blank" ? <Image source={{uri: item.downloadURL}} style={styles.postImage}/> : null}
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
                                onPress={() => {onLikePress(item.user.uid, item.id); storeLike(item.id)}}> 
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
                                onPress={() => {onFadePress(item.user.uid, item.id); storeFade(item.id)}}> 
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
                            onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid, posterId: item.user.uid, posterName: item.user.name, postCreation: item.creation, postCaption: item.caption, posterImg: item.user.userImg, postImg: item.downloadURL })}>
                            <Ionicons name={"chatbubble-outline"} size={20} color={"grey"} marginRight={10} />
                            <Text style={styles.likeNumber}>{item.comments}</Text>
                        </TouchableOpacity>
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
                <View>
                    <Text>{moment(gameDate).format("LT")}</Text> 
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
                            <Text style={styles.spreadText}>O {over}</Text>
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
                            <Text style={styles.spreadText}>U {under}</Text> 
                            {underOdds > 0 ?
                                <Text style={styles.oddsBottomRowText}>+{underOdds}</Text>
                                : <Text style={styles.oddsBottomRowText}>{underOdds}</Text>
                            }
                        </View>
                    </View>
                </View>                    
            </View> 
            <View style={styles.sortContainer}>
                <Text style={styles.sortText}>Sort: </Text>
                <TouchableOpacity 
                    onPress={() => {sortFunction()}}>
                    <Foundation name={"clock"} size={20} color={"#B3B6B7"} />
                </TouchableOpacity>
                <Text style={styles.sortText}> or </Text>
                <TouchableOpacity 
                    onPress={() => {sortFunction()}}>
                    <MaterialCommunityIcons name={"arrow-vertical-lock"} size={20} color={"#B3B6B7"} />
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
            <View style={styles.adView}>
                <AdMobBanner
                    bannerSize="banner"
                    adUnitID="ca-app-pub-3940256099942544/2934735716" // Real ID: 8519029912093094/5150749785, test ID: 3940256099942544/2934735716
                    servePersonalizedAds // true or false
                />
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => props.navigation.navigate('NewPost', { gameId: gameId, homeTeam: homeTeam, awayTeam: awayTeam, gameDate: gameDate })}
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
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: "#ffffff",

    },
    awayGameInfoContainer: { 
        flexDirection: 'row',
        borderBottomColor: "#e1e2e6",
        borderBottomWidth: 1,
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
        width: "50%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        justifyContent: 'center',
    },
    spreadItem: {
        width: "16.5%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    moneylineItem: {
        width: "16.5%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    totalItem: {
        width: "16.5%",
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    gameHeaderContainer: {
        flexDirection: 'row',
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
    postImage: {
        width: "100%",
        height: 250,
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
        marginLeft: "5%",
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
        color: '#B3B6B7' 
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

    }
    
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
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps,  mapDispatchProps)(game);
