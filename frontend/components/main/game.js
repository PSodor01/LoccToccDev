import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'

import moment from 'moment'

import { useNavigation } from '@react-navigation/native';

import ShareButton from '../buttons/ShareButton'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function game(props, route) {

    const [posts, setPosts] = useState([]);

    const {gameId, gameDate, homeTeam, awayTeam, homeMoneyline, awayMoneyline, homeSpread, awaySpread, homeSpreadOdds, awaySpreadOdds, over, overOdds, under, underOdds} = props.route.params;

    const fetchGamePosts = async () => {
        try {
            const list = [];
            
            await firebase.firestore()
                .collection('games')
                .doc(gameId)
                .collection("userPosts")
                .orderBy('creation', 'desc')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const {
                            caption,
                            creation,
                            comments,
                            downloadURL,
                            likes,
                        } = doc.data();
                        list.push({
                            caption,
                            creation,
                            comments,
                            downloadURL,
                            likes,
                        });
                    })
                })

                setPosts(list);
                
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchGamePosts();
    })
    

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
            <TouchableOpacity
                onPress={() => props.navigation.navigate('NewPost', { gameId: gameId, homeTeam: homeTeam, awayTeam: awayTeam })}
                style={styles.postButton}>
                <Text style={styles.shareText}>Create Post</Text>
            </TouchableOpacity>
            <FlatList
                style={styles.feed}
                numColumns={1}
                horizontal={false}
                data={posts}
                renderItem={({ item }) => (
                    <View style={styles.feedItem}>
                        <Text>{item.caption}</Text>
                    </View>
                )}

            />
        </View>
            
        )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(game);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 6,
        backgroundColor: "#e1e2e6",
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
        alignSelf: 'center',
        backgroundColor: '#33A8FF',
        borderRadius: 6,
        alignSelf: 'center',
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    shareText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        alignSelf: 'center',
    },
    feed: {
        backgroundColor: "#ffffff",
        flex: 1,
        marginTop: 14,
    },
    feedItem:{
        padding:6,
        marginVertical:5,
        marginHorizontal:5,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
        flexDirection: 'row',
    },
    profileNameFeedText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postTimeContainer: {
        fontSize: 10,
        marginRight: "5%",
    },
    postContentContainer: {
        flex: 1,
        width: "85%",
        marginLeft: "2%",
    },
    postImage: {
        width: "100%",
        height: 250,
    },
    captionText: {
        paddingBottom: 5,
    },
    postHeaderContainer: {
        flexDirection: 'row',
        flex: 1,
        width: "85%",
        paddingBottom: 4,
        marginLeft: "2%",
        justifyContent: 'space-between'
    },
    profilePhotoPostContainer: {
        backgroundColor: "#e1e2e6",
        width: 50,
        height: 50,
        borderRadius: 40,
    },
    postFooterContainer: {
        flexDirection: 'row',
        paddingTop: 4,
        justifyContent: 'space-between',
        width: "80%",
        paddingTop: 8,
        marginLeft: "5%",

    },
    postRightContainer: {
        width: "100%",
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
    flagText: {
        marginLeft: 5,
        marginTop: 5,
        color: "grey",
        fontSize: 10,
    },

    
})

