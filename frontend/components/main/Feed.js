import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import ShareButton from '../buttons/ShareButton'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }
        

    }, [props.usersFollowingLoaded, props.feed])
    
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

    const onReportPostPress = () => {
        console.warn( 'Report Post' );
        Alert.alert(
            'This will be the Report Post button',
          );
    }
    

    const navigation = useNavigation();

    return (
        <View style={styles.containerGallery}>
            <FlatList
                style={styles.feed}
                numColumns={1}
                horizontal={false}
                data={posts}
                renderItem={({ item }) => (
                    <View style={styles.feedItem}>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate("Profile", {})}>
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
                                    onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid, posterId: item.user.uid, posterName: item.user.name, postCreation: item.creation, postCaption: item.caption, posterImg: item.user.userImg })}>
                                    <Ionicons name={"chatbubble-outline"} size={20} color={"grey"} marginRight={10} />
                                    <Text style={styles.likeNumber}>{item.comments}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.flagContainer}
                                    onPress={onReportPostPress}>
                                    <Icon name={"ios-flag"} size={20} color={"grey"} marginRight={10} />
                                </TouchableOpacity>
                                <ShareButton />
                            </View>
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
   
    
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);

