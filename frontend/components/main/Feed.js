import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'

import { useNavigation } from '@react-navigation/native';
import email from 'react-native-email'

import moment from 'moment';

import ShareButton from '../buttons/ShareButton'
    
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

import {AdMobBanner} from 'expo-ads-admob'

function Feed(props) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        fetchData()

    }, [props.blocking, props.faded, props.usersFollowingLoaded, props.feed])

    const fetchData = () => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return y.creation - x.creation;
            })
            setPosts(props.feed);
        }
        console.log(posts)

        

        for (let i = 0; i < props.feed.length; i++) {

            if (props.blocking.indexOf(props.feed[i].creator) > -1) {
                props.feed[i].blocked = true
            } else {
                props.feed[i].blocked = false
            }

            if (props.faded.indexOf(props.feed[i].id) > -1) {
                props.feed[i].faded = true
            } else {
                props.feed[i].faded = false
            }

        }

        setLoading(false)
        
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

    const storeLike = (postId) => {
        firebase.firestore()
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .collection("userLikes")
            .doc(postId)
            .set({})
            .then(
            )
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

    const deleteLike = (postId) => {
        firebase.firestore()
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .collection("userLikes")
            .doc(postId)
            .delete({})
    }

    const onFadePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("fades")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }

    const storeFade = (postId) => {
        firebase.firestore()
            .collection("fades")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFades")
            .doc(postId)
            .set({})
            
    }

    const onUnfadePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("fades")
            .doc(firebase.auth().currentUser.uid)
            .delete({})
    }

    const deleteFade = (postId) => {
        firebase.firestore()
            .collection("fades")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFades")
            .doc(postId)
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

    const reportPostHandler = () => {
        Alert.alert(
            'Report Post',
            'Please report this post if you feel it obtains objectionable content. Our team will investigate within 24 hours and may remove the content or content creator based on our findings.',

            [
                { text: 'Report', onPress: () => handleReportPostEmail()},
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
            Follow others to see their posts here!
          </Text>
        );
      };

      /*<AdMobBanner
                    bannerSize="banner"
                    adUnitID="ca-app-pub-3940256099942544/2934735716" // Real ID: 8519029912093094/6377243182, test ID: 3940256099942544/2934735716
                    servePersonalizedAds // true or false
                /> */

    const navigation = useNavigation();

    return (
        <View style={styles.containerGallery}>
            <View style={styles.bannerAdContainer}>
                
            </View>
            <FlatList
                style={styles.feed}
                data={posts}
                ListEmptyComponent={EmptyListMessage}
                onRefresh={() => fetchData()}
                refreshing={loading}
                renderItem={({ item }) => (
                    <View>
                        <View >
                        { item.blocked == true ?

                            null
                                
                            : 
                            <View style={styles.feedItem}>
                                <TouchableOpacity
                                    onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}>
                                    <Image 
                                        style={styles.profilePhotoPostContainer}
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
                                        { item.currentUserLike ?
                                            (
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
                                            )
                                            :
                                            (
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
                                            )
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
                                            onPress={reportPostHandler}>
                                            <Icon name={"ios-flag"} size={20} color={"grey"} marginRight={10} />
                                        </TouchableOpacity>
                                    </View>
                                </View> 
                            </View>
                            }
                        
                             
                        </View>  
                    </View>
                    
                )}

            />
        </View>
            

    )
}

const styles = StyleSheet.create({
    containerGallery: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 10,
        flex: 1,
        marginTop: -10,
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
    bannerAdContainer: {
        marginTop: "5%",
        alignItems: 'center',
    },
    emptyListStyle: {
        padding: 10,
        fontSize: 18,
        textAlign: 'center',
      },
    
   
    
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
    blocking: store.userState.blocking,
    faded: store.userState.faded,


})
export default connect(mapStateToProps, null)(Feed);

