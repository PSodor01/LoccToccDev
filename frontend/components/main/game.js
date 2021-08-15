import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'

import moment from 'moment'

import { useNavigation } from '@react-navigation/native';

import ShareButton from '../buttons/ShareButton'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function game(props) {

    const [gamePosts, setGamePosts] = useState([]);
    const [postId, setPostId] = useState("")
    const [userData, setUserData] = useState(null);

    const {gameId, gameDate, homeTeam, awayTeam, homeMoneyline, awayMoneyline, homeSpread, awaySpread, homeSpreadOdds, awaySpreadOdds, over, overOdds, under, underOdds} = props.route.params;


    useEffect(() => {

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
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToGamePost(gamePosts)
        }
    }, [props.route.params.postId, props.users])
    
    const listTab = [
        {
            sport: 'americanfootball_nfl'
        },
        {
            sport: 'MLB'
        },
        {
            sport: 'americanfootball_ncaaf'
        }
    ]

    const onLikePress = (userId, postId) => {
        const userPosts = firebase.firestore()
            .collection("games")
            .doc(userId)
            .collection("userPosts")
            .doc(postId);
        
        userPosts.collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
            .then(() => {
                userPosts.update({
                    likesCount: firebase.firestore.FieldValue.increment(1)
                });
            })
    }
    const onDislikePress = (userId, postId) => {
        const userPosts = firebase.firestore()
            .collection("games")
            .doc(userId)
            .collection("userPosts")
            .doc(postId);

        userPosts.collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
            .then(() => {
                userPosts.update({
                    likesCount: firebase.firestore.FieldValue.increment(-1)
                });
            })
    }

    const handleReportPostEmail = () => {
        const to = ['ReportPost@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'LoccTocc Report Post',
            body: ''
        }).catch(console.error)
    }

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
            <View style={styles.postButtonContainer}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('NewPost', { gameId: gameId, homeTeam: homeTeam, awayTeam: awayTeam })}
                    style={styles.postButton}>
                    <Text style={styles.shareText}>Share Your Lock</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                numColumns={1}
                data={gamePosts}
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
                                    <Text style={styles.postTimeContainer}>{moment(item.creation.toDate()).fromNow()}</Text>
                                </View>
                                <View style={styles.postContentContainer}>
                                    {item.caption != null ? <Text style={styles.captionText}>{item.caption}</Text> : null}
                                    {item.downloadURL != null ? <Image source={{uri: item.downloadURL}} style={styles.postImage}/> : null}
                                </View>
                                <View style={styles.postFooterContainer}>
                                    { item.currentUserLike ?
                                        (
                                            <TouchableOpacity
                                                style={styles.likeContainer}
                                                onPress={() => onDislikePress(item.user.uid, item.id)} >
                                                <Ionicons name={"heart"} size={20} color={"red"} />
                                                <Text style={styles.likeNumber}>{item.likesCount}</Text>
                                            </TouchableOpacity>
                                        )
                                        :
                                        (
                                            <TouchableOpacity
                                                style={styles.likeContainer}
                                                onPress={() => onLikePress(item.user.uid, item.id)}> 
                                                <Ionicons name={"heart-outline"}  size={20} color={"pink"}/>
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
    teamText: {
    },
    listTab: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 20,
    },
    btnTab: {
        width: Dimensions.get('window').width /4,
        flexDirection: 'row',
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 6,
        justifyContent: 'center',
        marginRight: 10,
    },
    textTab: {
        fontSize: 16
    },
    btnTabActive: {
        backgroundColor: 'grey'
    },
    textTabActive: {
        color: '#fff',

    },
    postButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#33A8FF',
        borderRadius: 6,
        paddingVertical: 3,
        paddingHorizontal: 8,
        marginRight: "5%",
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
    
    

    
})

const mapStateToProps = (store) => ({
    users: store.usersState.users,
    currentUser: store.userState.currentUser,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(game);
