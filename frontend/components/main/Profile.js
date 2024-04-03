import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, Linking } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useNavigation } from '@react-navigation/native';
import email from 'react-native-email'
import { Avatar } from 'react-native-elements';

import moment from 'moment';

import * as Notifications from 'expo-notifications';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import analytics from "@react-native-firebase/analytics";

import DrawerModal from '../buttons/DrawerModal'

import { connect } from 'react-redux'

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);


    const getFieldName = () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so we add 1
        return `alltimeLeaders_${currentYear}_${currentMonth}`;
      };

    const showModal = () => {
        setModalVisible(true);
        analytics().logEvent('openCustomDrawer', {user_name: props.currentUser.name});
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const isCurrentUserProfile = props.route.params.uid === auth().currentUser.uid;
    
    
    useEffect(() => {

        fetchData()

        analytics().logScreenView({ screen_name: 'Profile', screen_class: 'Profile',  user_name: props.currentUser.name})

    }, [props.route.params.uid, props.following, props.blocking, props.faded, props.liked])

    const fetchData = () => {
        const { currentUser, posts } = props;

        function matchLikesToPosts(posts) {
            for (let i = 0; i < posts.length; i++) {

                if (props.faded.indexOf(posts[i].id) > -1) {
                    posts[i].faded = true
                } else {
                    posts[i].faded = false
                }

                if (props.liked.indexOf(posts[i].id) > -1) {
                    posts[i].liked = true
                } else {
                    posts[i].liked = false
                }
                
            }
            setUserPosts(posts)
            setLoading(false)
            

        }   
    
        if (props.route.params.uid === auth().currentUser.uid) {
            setUser(currentUser);
            firestore()
                .collection("posts")
                .doc(auth().currentUser.uid)
                .collection("userPosts")
                .orderBy("creation", "desc")
                .limit(20)
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchLikesToPosts(posts)
                    posts.sort(function (x, y) {
                        return y.creation - x.creation;
                    })
                    setUserPosts(posts)
                    setLoading(false);
                    
                })
            setUserPosts(posts)
            setLoading(false);
        }
        else {
            firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data())

                    }
                    else {
                        console.log('does not exist')
                    }
                })
            firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "desc")
                .limit(20)
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    posts.sort(function (x, y) {
                        return y.creation - x.creation;
                    })
                    matchLikesToPosts(posts)
                    setUserPosts(posts)
                    setLoading(false);
                    
                })
        }

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }

        if (props.blocking.indexOf(props.route.params.uid) > -1) {
            setBlocking(true);
        } else {
            setBlocking(false);
        }
    }

    const onFollow = () => {
        const userFollowing =  firestore()
            .collection("following")
            .doc(auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({
                id: props.route.params.uid,
                follower: auth().currentUser.uid,
            })

        analytics().logEvent('followUser', {user_name: props.currentUser.name});

        const followName = props.currentUser.name
        firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .collection("notifications")
            .add({
                notificationType: "follow",
                creation: firestore.FieldValue.serverTimestamp(),
                otherUserId: auth().currentUser.uid,
                otherUsername: followName,
                notificationText: 'started following you',
              })
    }

    const onUnfollow = () => {
        firestore()
            .collection("following")
            .doc(auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()

        analytics().logEvent('unfollowUser', {user_name: props.currentUser.name});
    }

    const increaseFollowerCount = () => {
        const fieldName = getFieldName();

        const updateObject = {};
        updateObject[fieldName] = firestore.FieldValue.increment(20);

        firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .update({
                followerCount: firestore.FieldValue.increment(1),
                [fieldName]: firestore.FieldValue.increment(20)
            })

    }

    const increaseFollowingCount = () => {
        const fieldName = getFieldName();

        const updateObject = {};
        updateObject[fieldName] = firestore.FieldValue.increment(20);

        firestore()
            .collection("users")
            .doc(auth().currentUser.uid)
            .update({
                followingCount: firestore.FieldValue.increment(1),
                [fieldName]: firestore.FieldValue.increment(20)
            })

    }

    const decreaseFollowerCount = () => {
        const fieldName = getFieldName();

        const updateObject = {};
        updateObject[fieldName] = firestore.FieldValue.increment(-20);

        firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .update({
                followerCount: firestore.FieldValue.increment(-1),
                [fieldName]: firestore.FieldValue.increment(-20)
            })

    }

    const decreaseFollowingCount = () => {
        const fieldName = getFieldName();

        const updateObject = {};
        updateObject[fieldName] = firestore.FieldValue.increment(-20);

        firestore()
            .collection("users")
            .doc(auth().currentUser.uid)
            .update({
                followingCount: firestore.FieldValue.increment(-1),
                [fieldName]: firestore.FieldValue.increment(-20)
            })

    }

    const blockUser = () => {
        const userBlocking =  firestore()
            .collection("blocking")
            .doc(auth().currentUser.uid)
            .collection("userBlocking")
            .doc(props.route.params.uid)
            .set({})
            .then(() => {
                Alert.alert(
                  "User succesfully blocked" 
                );
              })

        analytics().logEvent('blockUser', {user_name: props.currentUser.name});
    }

    const unBlockUser = () => {
        firestore()
            .collection("blocking")
            .doc(auth().currentUser.uid)
            .collection("userBlocking")
            .doc(props.route.params.uid)
            .delete()

        analytics().logEvent('unblockUser', {user_name: props.currentUser.name});
    }

    const blockAndUnfollowHandler = () => {
        Alert.alert(
            'Block?',
            'If you block this user you will no longer see their posts on any of your activity feeds.',

            [
                { text: 'Block', onPress: () => blockAndUnfollow()},
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
            ],
            { cancelable: true }

        )
    }

    const blockAndUnfollow = () => {
        onUnfollow(); 
        decreaseFollowerCount(); 
        decreaseFollowingCount();
        blockUser();
    }

    const unBlockUserHandler = () => {
        Alert.alert(
            'Unblock?',
            'Are you sure you want to unblock this user?',

            [
                { text: 'Unblock', onPress: () => unBlockUser()},
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
            ],
            { cancelable: true }

        )
    }

    const sendNotification = async (notification, token) => {

        const currentBadgeNumber = await Notifications.getBadgeCountAsync();
        const nextBadgeNumber = currentBadgeNumber + 1;

        const message = {
            to: token,
            sound: 'default',
            body: notification ? notification : '',
            badge: nextBadgeNumber,
            priority: 'high', 
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
    
    const sendNotificationForFollow = async () => {
        const users = await  firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let data = snapshot.data();

                    const token = data.token

                    if (token != undefined) {
                        const followName = props.currentUser.name
                        const notification = '(' + user.name + '): ' + followName + ' started following you'
                        sendNotification(notification, token)
                    } else {
                    }
                }
                else {
                }
            })
    };

    const sendNotificationForLike = async () => {
        const users = await  firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let data = snapshot.data();

                    const token = data.token
                    
 
                    if (token != undefined) {
                        const likedName = props.currentUser.name
                        const notification = '(' + user.name + '): ' +  likedName + ' hammered your post'
                        sendNotification(notification, token)
                    } else {
                    }
                }
                else {
                }
            })
    };

    const sendNotificationForFade = async () => {
        const users = await  firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let data = snapshot.data();

                    const token = data.token

                    if (token != undefined) {
                        const likedName = props.currentUser.name
                        const notification = '(' + user.name + '): ' + likedName + ' faded your post'
                        sendNotification(notification, token)
                    } else {
                    }
                }
                else {
                }
            })
    };

    const storeLike = (postId) => {
        firestore()
            .collection("likes")
            .doc(auth().currentUser.uid)
            .collection("userLikes")
            .doc(postId)
            .set({})

        analytics().logEvent('hammerPost', {user_name: props.currentUser.name});
    }

    const deleteLike = (postId) => {
        firestore()
            .collection("likes")
            .doc(auth().currentUser.uid)
            .collection("userLikes")
            .doc(postId)
            .delete({})
        
    }

    const storeFade = (postId) => {
        firestore()
            .collection("fades")
            .doc(auth().currentUser.uid)
            .collection("userFades")
            .doc(postId)
            .set({})

        analytics().logEvent('fadePost', {user_name: props.currentUser.name});
    }

    const deleteFade = (postId) => {
        firestore()
            .collection("fades")
            .doc(auth().currentUser.uid)
            .collection("userFades")
            .doc(postId)
            .delete({})

    }

    const onLikePress = (postId) => {

        firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(auth().currentUser.uid)
            .set({})

            firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(postId)
            .update({
                likesCount: firestore.FieldValue.increment(1)
            })

        const likedName = props.currentUser.name
        firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .collection("notifications")
            .add({
                notificationType: "hammer",
                creation: firestore.FieldValue.serverTimestamp(),
                otherUserId: auth().currentUser.uid,
                otherUsername: likedName,
                notificationText: 'hammered your post',
              })
    }

    const onDislikePress = (postId) => {
        firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(postId)
            .update({
                likesCount: firestore.FieldValue.increment(-1)
            })

            firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(auth().currentUser.uid)
            .delete()

        const likedName = props.currentUser.name
        firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .collection("notifications")
            .add({
                notificationType: "fade",
                creation: firestore.FieldValue.serverTimestamp(),
                otherUserId: auth().currentUser.uid,
                otherUsername: likedName,
                notificationText: 'faded your post',
                })

    }

    const onFadePress = (postId) => {
        firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(postId)
            .update({
                fadesCount: firestore.FieldValue.increment(1)
            })

            firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(postId)
            .collection("fades")
            .doc(auth().currentUser.uid)
            .set({})
    }

    const onUnfadePress = (postId) => {
        firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(postId)
            .update({
                fadesCount: firestore.FieldValue.increment(-1)
            })

            firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(postId)
            .collection("fades")
            .doc(auth().currentUser.uid)
            .delete()
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
            'Please report this post if you feel it contains objectionable content. Our team will investigate within 24 hours and may remove the content or content creator based on our findings.',

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

    const deletePost = (id) => {
        firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(id)
            .delete({})
            .then(() => {
                console.log('Post Deleted!');
                Alert.alert(
                  'Your post has been deleted!',
                );

            firestore()
            .collection("users")
            .doc(auth().currentUser.uid)
            .update({
                postsCount: firestore.FieldValue.increment(-1)
            })

        analytics().logEvent('deletePost', {user_name: props.currentUser.name});
        fetchData()
    })
    }

    const deletePostHandler = (id) => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',

            [
                { text: 'Yes', onPress: () => deletePost(id)},
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
            ],
            { cancelable: true }

        )
    }

    const navigation = useNavigation();

    if (user === null) {
        return <View />
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={[styles.avatarContainer, { backgroundColor: '#95B9C7' }]}>
                {user.userImg ? (
                    <Image source={{ uri: user.userImg }} style={styles.avatarImage} />
                ) : (
                    <Ionicons name="person" size={50} color="white" />
                )}
                </View>
                <View>
                    <Text style={styles.profileNameText}>{user.name}</Text>
                    {isCurrentUserProfile && (
                            <TouchableOpacity
                            onPress={() => {
                            showModal();
                            }}
                            style={styles.followButton}
                        >
                            <Text style={styles.follow}> My Stuff </Text>
                        </TouchableOpacity>
                        )}
                        <DrawerModal isVisible={isModalVisible} onClose={hideModal} navigation={props.navigation} />
                    
                    {props.route.params.uid !== auth().currentUser.uid ? (
                    <View style={styles.followBlockContainer}>
                        {following ? (
                        <TouchableOpacity
                            onPress={() => {
                            onUnfollow();
                            decreaseFollowerCount();
                            decreaseFollowingCount();
                            }}
                            title="Following"
                            style={styles.followingButton}
                        >
                            <Text style={styles.following}> Following </Text>
                        </TouchableOpacity>
                        ) : blocking ? null : (
                        <TouchableOpacity
                            onPress={() => {
                            onFollow();
                            increaseFollowerCount();
                            increaseFollowingCount();
                            sendNotificationForFollow();
                            }}
                            title="Follow"
                            style={styles.followButton}
                        >
                            <Text style={styles.follow}> Follow </Text>
                        </TouchableOpacity>
                        )}

                        {following && blocking !== true ? (
                        <TouchableOpacity
                            style={styles.blockUserButton}
                            onPress={() => {
                            blockAndUnfollowHandler();
                            }}
                        >
                            <Text style={{ color: 'red' }}>Block</Text>
                        </TouchableOpacity>
                        ) : blocking ? (
                        <TouchableOpacity
                            style={styles.unBlockUserButton}
                            onPress={() => {
                            unBlockUserHandler();
                            }}
                        >
                            <Text style={{ color: 'green' }}>Unblock</Text>
                        </TouchableOpacity>
                        ) : (
                        <TouchableOpacity
                            style={styles.blockUserButton}
                            onPress={() => {
                            blockUser();
                            }}
                        >
                            <Text style={{ color: 'red' }}>Block</Text>
                        </TouchableOpacity>
                        )}
                    </View>
                    ) : (
                    <View style={styles.middleButtonContainer}></View>
                    )}
                        
                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5,  width: '95%'}}>
                        {user.instagramLink && (
                        <TouchableOpacity
                            style={{ marginHorizontal: '5%'}}
                            onPress={() => {
                            if (user.instagramLink.startsWith('https://')) {
                                // If the URL starts with 'https://', open it as is
                                Linking.openURL(user.instagramLink);
                            } else {
                                // If the URL doesn't start with 'https://', prepend 'https://' and then open it
                                Linking.openURL(`https://${user.instagramLink}`);
                            }
                            }}
                        >
                            <FontAwesome5 name="instagram" size={24} color="#E1306C" />
                        </TouchableOpacity>
                        )}
                        {user.twitterLink && (
                        <TouchableOpacity
                            style={{ marginHorizontal: '5%' }}
                            onPress={() => {
                            if (user.twitterLink.startsWith('https://')) {
                                // If the URL starts with 'https://', open it as is
                                Linking.openURL(user.twitterLink);
                            } else {
                                // If the URL doesn't start with 'https://', prepend 'https://' and then open it
                                Linking.openURL(`https://${user.twitterLink}`);
                            }
                            }}
                        >
                            <FontAwesome5 name="twitter" size={24} color="#1DA1F2" />
                        </TouchableOpacity>
                        )}
                        {user.discordLink && (
                        <TouchableOpacity
                            style={{ marginHorizontal: '5%'}}
                            onPress={() => {
                            if (user.discordLink.startsWith('https://')) {
                                // If the URL starts with 'https://', open it as is
                                Linking.openURL(user.discordLink);
                            } else {
                                // If the URL doesn't start with 'https://', prepend 'https://' and then open it
                                Linking.openURL(`https://${user.discordLink}`);
                            }
                            }}
                        >
                            <MaterialCommunityIcons name="discord" size={24} color="#7289d9" />
                        </TouchableOpacity>
                        )}
                        {user.telegramLink && (
                        <TouchableOpacity
                            style={{ marginHorizontal: '5%'}}
                            onPress={() => {
                            if (user.telegramLink.startsWith('https://')) {
                                // If the URL starts with 'https://', open it as is
                                Linking.openURL(user.telegramLink);
                            } else {
                                // If the URL doesn't start with 'https://', prepend 'https://' and then open it
                                Linking.openURL(`https://${user.telegramLink}`);
                            }
                            }}
                        >
                            <FontAwesome name="telegram" size={24} color="#7289d9" />
                        </TouchableOpacity>
                        )}
                        {user.websiteLink && (
                        <TouchableOpacity
                            style={{ marginHorizontal: '5%'}}
                            onPress={() => {
                            if (user.websiteLink.startsWith('https://')) {
                                // If the URL starts with 'https://', open it as is
                                Linking.openURL(user.websiteLink);
                            } else {
                                // If the URL doesn't start with 'https://', prepend 'https://' and then open it
                                Linking.openURL(`https://${user.websiteLink}`);
                            }
                            }}
                        >
                            <MaterialCommunityIcons name="web" size={24} color="black" />
                        </TouchableOpacity>
                        )}
                    </View>
                </View>
                
            </View>

            
            
            <View style={{ marginLeft: "5%" }}>
                <View style={{ flexDirection: 'row', paddingTop: 5}}>
                    <Text style={{ color: "grey" }}>Member since </Text>
                    <Text style={{ color: "grey" }}>{user.createdAt?.toDate() ? moment(user.createdAt.toDate()).format("MMM Do YYYY") : null}</Text>
                </View>
                {user.aboutMe && (
                <View style={{ flexDirection: 'row', paddingTop: 5, width: '95%'}}>
                    <Text style={{ fontWeight: 'bold' }}>About me: </Text>
                    <Text style={{ flex: 1 }}>{user.aboutMe}</Text>
                </View>
                )}
                {user.location && (
                <View style={{ flexDirection: 'row', paddingTop: 5, width: '95%'}}>
                    <Text style={{ fontWeight: 'bold'}}>Location: </Text>
                    <Text style={{ flex: 1 }}>{user.location}</Text>
                </View>
                )}
                
            </View>
            
            <View style={styles.profileStatsContainer}>
                <View style={styles.profileStatsBox}>
                    <Text style={styles.followNumber}>{user ? user.postsCount : 0}</Text>
                    <Text style={styles.followText}>Posts</Text>
                </View>
                <View style={styles.profileStatsBox}>
                    <TouchableOpacity 
                        style={styles.profileStatsBox}
                        onPress={() => props.navigation.navigate('Follower', {userId: props.route.params.uid})}>
                        <Text style={styles.followNumber}>{user.followerCount < 1 ? 0 : user.followerCount}</Text>
                        <Text style={styles.followText}>Followers</Text>
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.profileStatsBox}>
                    <TouchableOpacity 
                        style={styles.profileStatsBox}
                        onPress={() => props.navigation.navigate('Following', {userId: props.route.params.uid})}>
                        <Text style={styles.followNumber}>{user.followingCount < 1 ? 0 : user.followingCount}</Text>
                        <Text style={styles.followText}>Following</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    style={styles.feed}
                    numColumns={1}
                    horizontal={false}
                    data={userPosts}
                    onRefresh={() => fetchData()}
                    refreshing={loading}
                    renderItem={({ item }) => (
                        <View style={styles.feedItem}>
                            <View style={styles.postLeftContainer}>
                                <View style={[styles.avatarListContainer, { backgroundColor: '#95B9C7' }]}>
                                    {user.userImg ? (
                                        <Image source={{ uri: user.userImg }} style={styles.avatarListImage} />
                                    ) : (
                                        <Ionicons name="person" size={24} color="white" />
                                    )}
                                    </View>
                            </View>
                            <View style={styles.postRightContainer}>
                                <View style={styles.postHeaderContainer}>
                                    <Text style={styles.profileNameFeedText}>{user.name}</Text>
                                    <Text style={styles.postTimeContainer}>{moment(item.creation.toDate()).fromNow()}</Text>
                                </View>
                                <View style={styles.postContentContainer}>
                                    {item.caption != null ? <Text style={styles.captionText}>{item.caption}</Text> : null}
                                    {item.downloadURL != "blank" ? <Image source={{uri: item.downloadURL}} style={styles.postImage}/> : null}
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
                                            onPress={() => {onDislikePress(item.id); deleteLike(item.id)}} >
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
                                            onPress={() => {onLikePress(item.id); storeLike(item.id); sendNotificationForLike()}}> 
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
                                            onPress={() => {onUnfadePress(item.id); deleteFade(item.id)}} >
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
                                            onPress={() => {onFadePress(item.id); storeFade(item.id); sendNotificationForFade()}}> 
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
                                        onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.creator, posterId: item.creator, posterName: user.name, postCreation: item.creation, postCaption: item.caption, posterImg: user.userImg, postImg: item.downloadURL })}>
                                        <Icon name={"chatbubble-outline"} size={20} color={"grey"} marginRight={10} />
                                        <Text style={styles.likeNumber}>{item.comments}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.flagContainer}
                                        onPress={reportPostHandler}>
                                        <Icon name={"flag"} size={20} color={"grey"} marginRight={10} />
                                    </TouchableOpacity>
                                        {props.route.params.uid !== auth().currentUser.uid ? 
                                        null
                                        : <TouchableOpacity
                                            style={styles.flagContainer}
                                            onPress={() => deletePostHandler(item.id)}>
                                            <Icon name={"trash"} size={20} color={"grey"} marginRight={10} />
                                        </TouchableOpacity>
                                        }
                                </View>
                            </View>
                        </View>
                        
                    )}
                />
            </View>
        </View>
                
        
        

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    profileNameContainer: {
        paddingBottom: 10,
    },
    profileNameText: {
        fontWeight: "bold",
        fontSize: 22,
    },
    containerGallery: {
        flex: 1
    },
    followingButton: {
        borderColor: "#e1e2e6",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: "center",
        marginBottom: "1%",
        marginRight: '2%'
    },
    followButton: {
        borderColor: "#0033cc",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: "center",
        marginBottom: "1%",
        marginRight: '2%'
    },
    blockUserButton: {
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'center',
        alignItems: "center",
        marginBottom: "1%",
        marginLeft: "1%",
    },
    unBlockUserButton: {
        borderColor: "green",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: "30%",
        alignSelf: 'center',
        alignItems: "center",
        marginBottom: "1%",
        marginLeft: "1%",
    },
    following: {
        color: "#666",
        fontSize: 14,
        alignSelf: "center",
    },
    follow: {
        color: "#0033cc",
        fontSize: 14,
        fontWeight: "bold",
        alignSelf: "center",
    },
    profileStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        borderTopColor: "#e1e2e6",
        borderTopWidth: 1,
        borderBottomColor:"#e1e2e6",
        borderBottomWidth: 1,
    },
    profileStatsBox: {
        marginHorizontal: 4,
        alignItems: "center",
        padding: 5,
    },
    followText: {
        color: "#666",
        paddingHorizontal: 20,
    },
    followNumber: {
        fontWeight: "bold",
    },
    middleButtonContainer: {
        flexDirection: 'row',
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
        paddingBottom: 5,
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
    postHeaderContainer: {
        flexDirection: 'row',
        flex: 1,
        width: "85%",
        paddingBottom: 4,
        marginLeft: "2%",
        justifyContent: 'space-between'
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
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '5%',
      },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 40,
    },
    avatarListContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
      },
    avatarListImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    profileHeader: {
        flexDirection: 'row',
        paddingTop: '2%',
        marginLeft: '5%',
      },
    followBlockContainer: {
        flexDirection: 'row',
        marginTop: '5%'
    },
    
   
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    blocking: store.userState.blocking,
    liked: store.userState.liked,
    faded: store.userState.faded,
})
export default connect(mapStateToProps, null)(Profile);
