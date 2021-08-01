import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import email from 'react-native-email'

import moment from 'moment';

import ShareButton from '../buttons/ShareButton'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        const { currentUser, posts } = props;

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        }
        else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })
        }

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
            
    }
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
            
    }

    const onLikePress = (userId, postId) => {
        const userPosts = firebase.firestore()
            .collection("posts")
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
            .collection("posts")
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

    if (user === null) {
        return <View />
    }

    return (
        <View>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{ alignItems: 'center' }}>
                        <Image 
                            style={styles.profilePhotoContainer}
                            source={{uri: user ? user.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                        />
                        <Text style={styles.profileNameText}>{user.name}</Text>
                    </View>
                    <View style={{ marginLeft: "5%" }}>
                        <View style={{ flexDirection: 'row', paddingTop: 5}}>
                            <Text style={{ color: "grey" }}>Member since </Text>
                            <Text style={{ color: "grey" }}>{moment(user.createdAt.toDate()).format("MMM Do YYYY")}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 5}}>
                            <Text style={{ fontWeight: 'bold'}}>About me: </Text>
                            <Text>{user.aboutMe}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 5}}>
                            <Text style={{ fontWeight: 'bold'}}>Location: </Text>
                            <Text>{user.location}</Text>
                        </View>
                    </View>
                    

                    <View style={{ paddingTop: "3%" }}>
                        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                            <View>
                                {following ? (
                                    <TouchableOpacity
                                        onPress={() => onUnfollow()}
                                        title="Following"
                                        style={styles.followingButton}>
                                            <Text style={styles.following}> Following </Text>
                                    </TouchableOpacity>
                                ) :
                                    (
                                        <TouchableOpacity
                                            onPress={() => onFollow()}
                                            title="Follow"
                                            style={styles.followButton}>
                                                <Text style={styles.follow}> Follow </Text>
                                        </TouchableOpacity>
                                    )}
                            </View>
                        ) :
                            <View style={styles.middleButtonContainer}>
                            
                            </View>
                            }
                    </View>
                    
                            
                    
                    <View style={styles.profileStatsContainer}>
                        <View style={styles.profileStatsBox}>
                            <Text style={styles.followNumber}>{user ? userPosts.length : 0}</Text>
                            <Text style={styles.followText}>Posts</Text>
                        </View>
                        <View style={styles.profileStatsBox}>
                            <Text style={styles.followNumber}>{user.followers && user.followers.length || 0}</Text>
                            <Text style={styles.followText}>Followers</Text>
                        </View>
                        <View style={styles.profileStatsBox}>
                            <Text style={styles.followNumber}>{user.following && userfollowing.length || 0}</Text>
                            <Text style={styles.followText}>Following</Text>
                        </View>
                    </View>

                    <View style={styles.containerGallery}>
                        <FlatList
                            style={styles.feed}
                            numColumns={1}
                            horizontal={false}
                            data={userPosts}
                            renderItem={({ item }) => (
                                <View style={styles.feedItem}>
                                    <View style={styles.postLeftContainer}>
                                    <Image 
                                        style={styles.profilePhotoPostContainer}
                                        source={{uri: user ? user.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                                    />
                                    </View>
                                    <View style={styles.postRightContainer}>
                                        <View style={styles.postHeaderContainer}>
                                            <Text style={styles.profileNameFeedText}>{user.name}</Text>
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
                                                        onPress={() => onDislikePress(item.currentUser, item.id)} >
                                                        <Icon name={"heart"} size={20} color={"red"} />
                                                        <Text style={styles.likeNumber}>{item.likesCount}</Text>
                                                    </TouchableOpacity>
                                                )
                                                :
                                                (
                                                    <TouchableOpacity
                                                        style={styles.likeContainer}
                                                        onPress={() => onLikePress(item.currentUser, item.id)}> 
                                                        <Icon name={"heart-outline"}  size={20} color={"pink"}/>
                                                        <Text style={styles.likeNumber}>{item.likesCount}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }
                                            <TouchableOpacity
                                                style={styles.commentsContainer}
                                                onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: user.id, posterId: user.id, posterName: user.name, postCreation: item.creation, postCaption: item.caption, posterImg: user.userImg, postImg: item.downloadURL })}>
                                                <Icon name={"chatbubble-outline"} size={20} color={"grey"} marginRight={10} />
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
                                
                            )}

                        />
                        
                    </View>
                    

                </View>
                
            </ScrollView>
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
    profilePhotoContainer: {
        backgroundColor: "#e1e2e6",
        width: 100,
        height: 100,
        borderRadius: 40,
        marginTop: 16,
        overflow: 'hidden',
        marginBottom: 10,

    },
    followingButton: {
        borderColor: "#e1e2e6",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: "30%",
        alignSelf: "center",
        marginBottom: "2%",
    },
    followButton: {
        borderColor: "#0033cc",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: "30%",
        alignSelf: "center",
        marginBottom: "2%",
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
        justifyContent: 'center',
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
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})
export default connect(mapStateToProps, null)(Profile);
