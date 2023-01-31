import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Linking, Image, FlatList, TouchableOpacity, Alert, Share } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'

import { useNavigation } from '@react-navigation/native';
import email from 'react-native-email';
import { captureRef } from 'react-native-view-shot';

import moment from 'moment';

import analytics from "@react-native-firebase/analytics";

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'


function Feed(props) {
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState([]);
    const [followCriteria, setFollowCriteria] = useState(false)
    const [currentUserFollowingCount, setCurrentUserFollowingCount] = useState('')
    

     useEffect(() => {
        fetchData()
        setCurrentUserFollowingCount(props.currentUser.followingCount)

        analytics().logevent('screen_view', { screen_name: 'Feed', user_name: props.currentUser.name })

    }, [props.blocking, props.faded, props.liked, props.following, props.currentUser])

    const fetchData = () => {

        function matchUserToAllPosts(allPosts) {
            for (let i = 0; i < allPosts.length; i++) {
                if (allPosts[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === allPosts[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(allPosts[i].creator, false)
                } else {
                    allPosts[i].user = user
                }

                if (props.blocking.indexOf(allPosts[i].creator) > -1) {
                    allPosts[i].blocked = true
                } else {
                    allPosts[i].blocked = false
                }
    
                if (props.faded.indexOf(allPosts[i].id) > -1) {
                    allPosts[i].faded = true
                } else {
                    allPosts[i].faded = false
                }
    
                if (props.following.indexOf(allPosts[i].creator) > -1) {
                    allPosts[i].following = true
                } else {
                    allPosts[i].following = false
                }
    
                if (props.liked.indexOf(allPosts[i].id) > -1) {
                    allPosts[i].liked = true
                } else {
                    allPosts[i].liked = false
                }
            }
            setAllPosts(allPosts)
            setLoading(false)


        }

        var ourDate = new Date();
        var pastDate = ourDate.getDate() - 3;
        ourDate.setDate(pastDate);

        firebase.firestore()
        .collectionGroup("userPosts")
        .where("creation", ">=", ourDate)
        .orderBy('creation', 'desc')
        .get()
        .then((snapshot) => {

            let allPosts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
                
            matchUserToAllPosts(allPosts)


            })

    }
    
    const storeLike = (postId, userId) => {
        firebase.firestore()
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .collection("userLikes")
            .doc(postId)
            .set({})

        analytics().logevent('hammerPost', {user_name: props.currentUser.name});
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

        analytics().logevent('fadePost', {user_name: props.currentUser.name});
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
                notificationText: 'hammered your post',
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
                notificationText: 'faded your post',
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
                        const notification = '(' + name + '): ' +  likedName + ' hammered your post'
                        sendNotification(notification, token)
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
                        const notification = '(' + name + '): ' + likedName + ' faded your post'
                        sendNotification(notification, token)
                    } else {
                    }
                }
                else {
                }
            })
    };

    const openAdLink = () => {

        analytics().logevent('adClick', {user_name: props.currentUser.name, adPartner: 'Kutt'});
            
    }

    const handleReportPostEmail = () => {

        analytics().logevent('reportPost', {user_name: props.currentUser.name});

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

    const followingFunction = () => {
        if (followCriteria == true) {
            setFollowCriteria(false)
        } else {
            setFollowCriteria(true)
            analytics().logevent('filterPostsFriends', {user_name: props.currentUser.name});
        }
    }

    const viewRef = useRef({});
    const shareDummyImage = async (name, caption) => {
        try {
            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 0.7
            });
            await Share.share({ url:uri });
        } catch(err){
            console.error(err);
        }
    }

    
    
    const renderItem = ({item}) => {
        return (
            <View>
                <View >
                { item.blocked == true || item.creator == firebase.auth().currentUser.uid ?

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
                                {item.user ? <Text style={styles.profileNameFeedText}>{item.user.name}</Text> : null}
                                
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
                            onPress={() => {onFadePress(item.user.uid, item.id); storeFade(item.id); sendNotificationForFade(item.user.uid, item.user.name)}}> 
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
                    }
                </View>  
            </View>
    )}

    const renderFollowingItem = ({item}) => {
        return (
            <View>
                <View >
                { item.following != true ?

                    null
                        
                    : 
                    <View
                         style={styles.feedItem}>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}>
                            <Image 
                                style={styles.profilePhotoPostContainer}
                                source={{uri: item.user ? item.user.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                            />
                        </TouchableOpacity>
                        <View style={styles.postRightContainer}>
                            <View style={styles.postHeaderContainer}>
                                {item.user ? <Text style={styles.profileNameFeedText}>{item.user.name}</Text> : null}
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
                    }
                
                        
                </View>
                    
            </View>
        )}

      

    const navigation = useNavigation();

    /* <View style={styles.adView}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID={adUnitID} 
                servePersonalizedAds // true or false
            />
        </View>
        <TouchableOpacity style={styles.adView}
            onPress={() => { Linking.openURL('https://bit.ly/3uAOAIh'); openAdLink()}} >
            <Image 
                style={{ width: "95%", height: 40 }}
                source={require('../../assets/fantasyJocksBanner.jpg')}
            />
        </TouchableOpacity>*/

    return (
        <View style={styles.containerGallery}>
            <View style={styles.bannerAdContainer}>
            </View>
            {
                
            followCriteria == false ?
            
            <View style={styles.sortContainer}>
                <TouchableOpacity 
                    style={styles.sortButton}
                    onPress={() => {followingFunction()}}>
                    <Text style={styles.sortText}>See All: </Text>
                    <Ionicons name={"lock-open-outline"} size={12} color={"#33A8FF"} marginRight={10}/>
                </TouchableOpacity>
            </View> 
            :
            <View style={styles.sortContainer}>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => {followingFunction()}}>
                    <Text style={styles.sortText}>Friends Only: </Text>
                    <Ionicons name={"lock-closed-outline"} size={12} color={"#33A8FF"} marginRight={10}/>
                </TouchableOpacity>
            </View> }
            {currentUserFollowingCount == '0' && followCriteria == false ?
            <Text style={styles.noFollowingText}>Follow others to see their locks here</Text>
            :
            null
            }
            {followCriteria == false ? 
            <FlatList
                style={styles.feed}
                data = {allPosts.sort(function (x, y) {return y.creation - x.creation})}
                onRefresh={() => fetchData()}
                refreshing={loading}
                renderItem={renderFollowingItem}

            /> :
            <FlatList
                style={styles.feed}
                data = {allPosts.sort(function (x, y) {return y.creation - x.creation})}
                onRefresh={() => fetchData()}
                refreshing={loading}
                renderItem={renderItem}

            /> }

            
            <TouchableOpacity style={styles.adView}
                onPress={() => { Linking.openURL('https://apps.apple.com/us/app/kutt/id1578386177'); openAdLink()}} >
                <Image 
                    style={{ width: "95%", height: 40, resizeMode: "contain" }}
                    source={require('../../assets/kuttBanner.png')}
                />
            </TouchableOpacity>
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
        width: "95%",
        marginLeft: "3%",
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
    postHeaderContainer: {
        flexDirection: 'row',
        flex: 1,
        width: "95%",
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
        marginLeft: "3%",

    },
    postRightContainer: {
        flex: 1,
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
    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginHorizontal: "2%",
    },
    sortText: {
        color: '#33A8FF',
        fontSize: 12
    },
    sortButton: {
        flexDirection: 'row',
    },
    noFollowingText: {
        fontSize: 16,
        paddingTop: 10,
    },
    adView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    blocking: store.userState.blocking,
    liked: store.userState.liked,
    faded: store.userState.faded,
    users: store.usersState.users,
    contestStatus: store.userState.contestStatus,

})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Feed);