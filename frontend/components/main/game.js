import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';

import moment from 'moment'

import { useNavigation } from '@react-navigation/native';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const game = ({ route, props }) => {

        const {gameId, site, date, homeTeam, awayTeam, homeMoneyline, awayMoneyline, homeSpread, awaySpread} = route.params;

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
    
        const onReportPostPress = () => {
            console.warn( 'Report Post' );
            Alert.alert(
                'This will be the Report Post button',
              );
        }
        const onSharePostPress = () => {
            console.warn( 'Share Post' );
            Alert.alert(
                'This will be the Share Post button',
              );
        }

        const navigation = useNavigation();
        
        return (
            <View style={styles.gameContainer}>
                <Text style={styles.textStyle}>{site}</Text>
                <Text style={styles.textStyle}>{gameId}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.gameItem}>
                            <Text style={styles.textStyle}>{moment(date).format("MMM Do YYYY")}</Text>
                            <Text style={styles.gameHeaderText}>Team</Text>
                            <Text style={styles.textStyle}>{awayTeam}</Text>
                            <Text style={styles.textStyle}>{homeTeam}</Text>
                            
                        </View>
                        <View style={styles.gameItem}>
                            <Text style={styles.gameHeaderText}>Moneyline</Text>
                            <Text style={styles.textStyle}>{awayMoneyline}</Text>
                            <Text style={styles.textStyle}>{homeMoneyline}</Text>
                        </View>
                        <View style={styles.gameItem}>
                            <Text style={styles.gameHeaderText}>Spread</Text>
                            <Text style={styles.textStyle}>{awaySpread}</Text>
                            <Text style={styles.textStyle}>{homeSpread}</Text>
                        </View>
                        <View style={styles.gameItem}>
                            <Text style={styles.gameHeaderText}>Total</Text>
                            <Text style={styles.textStyle}>{}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('NewPost', { gameId: gameId, homeTeam: homeTeam, awayTeam: awayTeam, homeMoneyline: homeMoneyline, awayMoneyline: awayMoneyline, homeSpread: homeSpread, awaySpread: awaySpread })}>
                        <Text>Create Post</Text>
                    </TouchableOpacity>
                    
            </View>
        )
}

export default game;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: "#ffffff",
    },
    gameContainer: {
        padding:6,
        marginVertical:10,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: "#fff",
    },
    gameButton: {
        flexDirection: 'row',
    },
    gameItem:{
        padding:4,
        marginHorizontal:5,
    },
    gameHeaderText: {
        fontWeight: "bold",
    },
    gameFooter: {
        flexDirection: 'row',
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
    captionText: {
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

