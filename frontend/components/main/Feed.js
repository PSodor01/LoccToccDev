import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Linking, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert, Share, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'

import { useNavigation } from '@react-navigation/native';
import email from 'react-native-email';
import { captureRef } from 'react-native-view-shot';

import moment from 'moment';

import * as Notifications from 'expo-notifications';

import firebase from 'firebase'
require("firebase/firestore")

import analytics from "@react-native-firebase/analytics";
import { BannerAdSize, TestIds, BannerAd } from 'react-native-google-mobile-ads';

import { connect } from 'react-redux'


function Feed(props) {
    const [loading, setLoading] = useState(true);
    const [followCriteria, setFollowCriteria] = useState(true)
    const [currentUserFollowingCount, setCurrentUserFollowingCount] = useState('')
    const [combinedData, setCombinedData] = useState([]);
    const [limit, setLimit] = useState(40);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8519029912093094/8258310490'

     useEffect(() => {
        
        fetchData()
        setCurrentUserFollowingCount(props.currentUser.followingCount)

        analytics().logScreenView({ screen_name: 'Feed', screen_class: 'Feed',  user_name: props.currentUser.name})

    }, [props.blocking, props.faded, props.liked, props.following, props.currentUser.followingCount])

    const fetchCombinedData = async () => {
        const [users, gamePosts] = await Promise.all([
            firebase.firestore().collection("users").get(),
            firebase.firestore().collectionGroup("userPosts").orderBy('creation', 'desc').limit(limit).get()
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
    
            if (props.following.indexOf(combinedData[i].creator) > -1) {
                combinedData[i].following = true
            } else {
                combinedData[i].following = false
            }
        }
    
        return combinedData;
    };

    const fetchData = async () => {
        const data = await fetchCombinedData(limit);
        setCombinedData(data);
        setLoading(false);
    };

    const handleEndReached = async () => {
        setLoadingMore(true); // show loading icon
        setLimit(limit + 40); // increase the limit to fetch more posts
        await fetchData(); // fetch the next batch of posts
        setLoadingMore(false); // hide loading icon
        analytics().logEvent('loadMore', {user_name: props.currentUser.name});
    };

    const flatListRef = useRef(null);

    const handleImagePress = () => {
        setFullscreen(!fullscreen);
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
        const users = await 
        firebase.firestore()
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
        const users = await 
        firebase.firestore()
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

        analytics().logEvent('adClick', {user_name: props.currentUser.name, adPartner: 'Kutt'});
            
    }

    const handleReportPostEmail = () => {

        analytics().logEvent('reportPost', {user_name: props.currentUser.name});

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
            analytics().logEvent('filterPostsFriends', {user_name: props.currentUser.name});
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
                            onPress={() => props.navigation.navigate("Profile", {uid: item.user.id})}>
                            <Image 
                                style={styles.profilePhotoPostContainer}
                                source={{uri: item.user != null ? item.user.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
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
                                        <TouchableOpacity onPress={handleImagePress}>
                                            <Image
                                            resizeMode="cover"
                                            source={{ uri: item.downloadURL }}
                                            style={styles.postImage}
                                            />
                                        </TouchableOpacity>
                                        <Modal visible={fullscreen} transparent={true}>
                                            <TouchableOpacity style={styles.fullscreenContainer} onPress={handleImagePress}>
                                                <Image resizeMode="contain" source={{ uri: item.downloadURL }} style={styles.fullscreenImage} />
                                            </TouchableOpacity>
                                        </Modal>
                                    </View>
                                 : null}
                                {item.userTagList != null ? <Text style={{ color: '#0033cc', fontWeight: 'bold' }}>@{item.userTagList}</Text> : null}
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
                            onPress={() => {onFadePress(item.user.id, item.id); storeFade(item.id); sendNotificationForFade(item.user.id, item.user.name)}}> 
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
                        onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.id, posterId: item.user.id, posterName: item.user.name, postCreation: item.creation, postCaption: item.caption, posterImg: item.user.userImg, postImg: item.downloadURL })}>
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
                            onPress={() => props.navigation.navigate("Profile", {uid: item.user.id})}>
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
                                        <TouchableOpacity onPress={handleImagePress}>
                                            <Image
                                            resizeMode="cover"
                                            source={{ uri: item.downloadURL }}
                                            style={styles.postImage}
                                            />
                                        </TouchableOpacity>
                                        <Modal visible={fullscreen} transparent={true}>
                                            <TouchableOpacity style={styles.fullscreenContainer} onPress={handleImagePress}>
                                                <Image resizeMode="contain" source={{ uri: item.downloadURL }} style={styles.fullscreenImage} />
                                            </TouchableOpacity>
                                        </Modal>
                                    </View>
                                 : null}
                                {item.userTagList != null ? <Text style={{ color: '#0033cc', fontWeight: 'bold' }}>@{item.userTagList}</Text> : null}
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
                            onPress={() => {onLikePress(item.user.id, item.id); storeLike(item.id)}}> 
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
                            onPress={() => {onFadePress(item.user.id, item.id); storeFade(item.id)}}> 
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
                        onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.id, posterId: item.user.id, posterName: item.user.name, postCreation: item.creation, postCaption: item.caption, posterImg: item.user.userImg, postImg: item.downloadURL })}>
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
                    ref={flatListRef}
                    style={styles.feed}
                    data={combinedData}
                    renderItem={renderFollowingItem}
                    keyExtractor={(item, index) => index.toString()}
                    onScroll={(event) => {
                        const offsetY = event.nativeEvent.contentOffset.y;
                        if (offsetY > 100) { // adjust the number as needed
                            setShowScrollButton(true);
                        } else {
                            setShowScrollButton(false);
                        }
                    }}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.1}
                    onRefresh={() => fetchData()}
                    refreshing={loading}
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="large" /> : null}
                />
            
            :
            <FlatList
                ref={flatListRef}
                style={styles.feed}
                data={combinedData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={(event) => {
                    const offsetY = event.nativeEvent.contentOffset.y;
                    if (offsetY > 100) { // adjust the number as needed
                        setShowScrollButton(true);
                    } else {
                        setShowScrollButton(false);
                    }
                }}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                onRefresh={() => fetchData()}
                refreshing={loading}
                ListFooterComponent={loadingMore ? <ActivityIndicator size="large" /> : null}
            /> }

            
            <View  style={styles.adView}>
                {showScrollButton && (
                    <TouchableOpacity
                        style={styles.scrollButton}
                        onPress={() => {
                        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
                        setShowScrollButton(false);
                        }}
                    >
                        <Ionicons name="arrow-up-circle" size={30} color="#009387" />
                    </TouchableOpacity>
                )}
                <BannerAd
                    unitId={adUnitId}
                    sizes={[BannerAdSize.FULL_BANNER]}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
                
            </View>
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
    scrollButton: {
        position: 'absolute',
        bottom: 50,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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


export default connect(mapStateToProps)(Feed);
