import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Alert, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import moment from 'moment'

import { AdMobBanner } from 'expo-ads-admob'

import { useNavigation } from '@react-navigation/native';

import ShareButton from '../buttons/ShareButton'

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

    const {gameId, gameDate, homeTeam, awayTeam, homeMoneyline, awayMoneyline, homeSpread, awaySpread, homeSpreadOdds, awaySpreadOdds, over, overOdds, under, underOdds, awayTeamVote, homeTeamVote} = props.route.params;
    
    useEffect(() => {

        navigation.addListener('focus', async () => {
            fetchData()
        })
    }, [props.route.params.postId, props.users, props.usersFollowingLoaded, props.feed])

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
            }
            setGamePosts(gamePosts)
            setLoading(false)
        }

        function setLikeStatus(gamePosts) {
            for (let i = 0; i < gamePosts.length; i++) {
                firebase.firestore()
                .collection('posts')
                .doc(gamePosts[i].creator)
                .collection('userPosts')
                .doc(gamePosts[i].id)
                .collection('likes')
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then(documentSnapshot => {
                        
                    if (documentSnapshot.exists) {
                        gamePosts[i].currentUserLike = true
                        console.log(gamePosts)
                        
                    } else{
                        gamePosts[i].currentUserLike = false
                        console.log(gamePosts)
                    }
                }) 
                .catch((err) => console.log(err.message));                  
            }
            setGamePosts(gamePosts)
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
            .collectionGroup("userPosts")
            .where('gameId', '==', gameId)
            .get()
            .then((snapshot) => {

                let gamePosts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                   
                    matchUserToGamePost(gamePosts)
                    setLikeStatus(gamePosts)
                })

        } else {
            matchUserToGamePost(gamePosts)
            setLoading(false)
        }
        
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
    }

    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete({})
    }

     

    const handleReportPostEmail = () => {
        const to = ['ReportPost@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'LoccTocc Report Post',
            body: ''
        }).catch(console.error)
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
    /*<View style={styles.postButtonContainer}>
        <Text>Who will cover the spread?</Text>
        <TouchableOpacity 
            onPress={awayVote}>
            <Text>{awayTeam}</Text>
        </TouchableOpacity>
        <Text>or</Text>
        <TouchableOpacity 
            onPress={homeVote}>
            <Text>{homeTeam}</Text>
        </TouchableOpacity>
            
    </View>  
    const homeVote = () => {
        firebase.firestore()
            .collection("games")
            .doc(gameId)
            .collection("votes")
            .doc("homeVote")
            .collection(firebase.auth().currentUser.uid)
            .add({
                creator: firebase.auth().currentUser.uid,
                })
    }

    const awayVote = () => {
        firebase.firestore()
            .collection("games")
            .doc(gameId)
            .collection("votes")
            .doc("awayVote")
            .collection(firebase.auth().currentUser.uid)
                creator: firebase.auth().currentUser.uid,
                })
    } */
    
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            
            <View style={styles.gameContainer}>
                <View>
                    <Text>{moment(gameDate).format("LT")}</Text> 
                    <View style={styles.awayGameInfoContainer}>
                        <View style={styles.teamItem}>
                            <Text style={styles.teamText}>{awayTeam}</Text>
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
                            <Text style={styles.teamText}>{homeTeam}</Text>
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
            <FlatList
                data={gamePosts}
                ListEmptyComponent={EmptyListMessage}
                onRefresh={() => fetchData()}
                refreshing={loading}
                renderItem={({ item }) => (
                    <View>
                        {item.user !== undefined ?
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
                                    <Text>{item.currentUserLike}</Text>
                                    <Text style={styles.postTimeContainer}>{moment(item.creation.toDate()).fromNow()}</Text>
                                </View>
                                <View style={styles.postContentContainer}>
                                    {item.caption != null ? <Text style={styles.captionText}>{item.caption}</Text> : null}
                                    {item.downloadURL != "blank" ? <Image source={{uri: item.downloadURL}} style={styles.postImage}/> : null}
                                </View>
                                <View style={styles.postFooterContainer}>
                                    { item.currentUserLike ?
                                        (
                                            <TouchableOpacity
                                                style={styles.likeContainer}
                                                onPress={() => onDislikePress(item.user.uid, item.id)} >
                                                <Ionicons name={"hammer"} size={20} color={"grey"} />
                                                <Text style={styles.likeNumber}>{item.likesCount}</Text>
                                            </TouchableOpacity>
                                        )
                                        :
                                        (
                                            <TouchableOpacity
                                                style={styles.likeContainer}
                                                onPress={() => onLikePress(item.user.uid, item.id)}> 
                                                <Ionicons name={"hammer-outline"}  size={20} color={"grey"}/>
                                                <Text style={styles.likeNumber}>{item.likesCount}</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                    <TouchableOpacity
                                        style={styles.commentsContainer}
                                        onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid, posterId: item.user.uid, posterName: item.user.name, postCreation: item.creation, postCaption: item.caption, posterImg: item.user.userImg, postImg: item.downloadURL })}>
                                        <Ionicons name={"chatbubble-outline"} size={20} color={"grey"} marginRight={10} />
                                        <Text style={styles.likeNumber}>{item.comments}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.flagContainer}
                                        onPress={handleReportPostEmail}>
                                        <Icon name={"ios-flag"} size={20} color={"grey"} marginRight={10} />
                                    </TouchableOpacity>
                                    <ShareButton />
                                </View>
                            </View>
                                

                            </View>
                            
                            : null}
                    </View>
                )}

            />
            <View style={styles.adView}>
                <AdMobBanner
                    bannerSize="banner"
                    adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                    servePersonalizedAds // true or false
                />
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => props.navigation.navigate('NewPost', { gameId: gameId, homeTeam: homeTeam, awayTeam: awayTeam })}
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
        width: 160,
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        justifyContent: 'center',
    },
    spreadItem: {
        width: 60,
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    moneylineItem: {
        width: 60,
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    totalItem: {
        width: 60,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    gameHeaderContainer: {
        flexDirection: 'row',
    },
    teamHeader: {
        width: 160,
    },
    spreadHeader: {
        width: 60,
        alignItems: 'center',
    },
    moneylineHeader: {
        width: 60,
        alignItems: 'center',
    },
    totalHeader: {
        width: 60,
        alignItems: 'center',
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
        bottom: 20,
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
        marginBottom: '1%',
    }
    
})

const mapStateToProps = (store) => ({
    users: store.usersState.users,
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps,  mapDispatchProps)(game);
