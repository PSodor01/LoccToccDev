import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity, Platform, ImageBackground } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import * as Permissions from "expo-permissions";
import * as ImagePicker from 'expo-image-picker';

import PostButton from '../PostButton'
;import moment from 'moment';

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState();

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
                .orderBy("creation", "desc")
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

    const onLogout = () => {
        firebase.auth().signOut();
    }

    if (user === null) {
        return <View />
    }

    const getPermission = async () => { 
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            return status;
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            })

            if (!result.cancelled) {
                setProfilePhoto(result.uri)
            }
        } catch (error) {
            console.log("Error @pickImage: ", error);
        }
    }
    const addProfilePhoto = async () => {
        const status = await getPermission();

        if (status !== "granted") {
            alert("We need permission to access your camera roll.");

            return;
        }

        pickImage()
    };    

    

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.profilePhotoContainer} onPress={addProfilePhoto}>
                {profilePhoto ? (
                    <Image source={{uri: profilePhoto}} style={styles.profilePhoto} />
                ): (
                    <View style={styles.defaultProfilePhoto}>
                        <AntDesign name ="plus" size={24} color="#ffffff"  />
                    </View>
                )}
                
            </TouchableOpacity>
            <View style={styles.profileNameContainer}>
                <Text style={styles.profileNameText}>{user.name}</Text>
            </View>
            {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <TouchableOpacity
                                onPress={() => onUnfollow()}
                                title="Following"
                                style={styles.logoutButtonContainer}>
                                    <Text style={styles.appButtonText}> Following </Text>
                            </TouchableOpacity>
                        ) :
                            (
                                <TouchableOpacity
                                    onPress={() => onFollow()}
                                    title="Follow"
                                    style={styles.logoutButtonContainer}>
                                        <Text style={styles.appButtonText}> Follow </Text>
                                </TouchableOpacity>
                            )}
                    </View>
                ) :
                    <TouchableOpacity
                        onPress={() => onLogout()}
                        title="Logout"
                        style={styles.logoutButtonContainer}>
                            <Text style={styles.appButtonText}> Logout </Text>
                    </TouchableOpacity>}

            <View style={styles.followContainer}>
                <View style={styles.followBox}>
                    <Text style={styles.followNumber}>{user.followers && user.followers.length || 0}</Text>
                    <Text style={styles.followText}>Followers</Text>
                </View>
                <View style={styles.followBox}>
                    <Text style={styles.followNumber}>{user.following && user.following.length || 0}</Text>
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
                                <Image source={require('../../assets/profilePhoto.png')} style={styles.profilePhotoPostContainer} />
                            </View>
                            <View style={styles.postRightContainer}>
                                <View style={styles.postHeaderContainer}>
                                    <Text style={styles.profileNameFeedText}>{user.name}</Text>
                                    <Text style={styles.postTimeContainer}>{moment(item.creation.toDate()).fromNow()}</Text>
                                </View>
                                <View style={styles.postContentContainer}>
                                    <Text style={styles.captionText}>{item.caption}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                />
                
            </View>
            <PostButton />

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    profileNameContainer: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    profileNameText: {
        fontWeight: "bold",
        fontSize: 24,
    },
    containerGallery: {
        flex: 1
    },
    
    postContentContainer: {
        flex: 1,
    },
    postHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "80%",
        paddingBottom: 4,
    },
    profilePhotoPostContainer: {
        width: 50,
        height: 50,
        borderRadius: 40,
    },
    postFooterContainer: {
        flexDirection: 'row',
        paddingTop: 4,
        justifyContent: 'space-between',
        width: "20%",

    },
    postRightContainer: {
        width: "100%",
    },
    profilePhotoContainer: {
        backgroundColor: "#e1e2e6",
        width: 100,
        height: 100,
        borderRadius: 40,
        alignSelf: 'center',
        marginTop: 16,
        overflow: 'hidden',
        marginBottom: 10,

    },
    defaultProfilePhoto: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    profilePhoto: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    profilePhotoPostContainer: {
        width: 50,
        height: 50,
        borderRadius: 40,

    },
    logoutButtonContainer: {
        borderColor: "#e1e2e6",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: "30%",
        alignSelf: "center",
    },
    appButtonText: {
        color: "#666",
        fontSize: 18,
        alignSelf: "center",
    },
    feed: {
        backgroundColor: "#ffffff",
        flex: 1,
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
        marginHorizontal: 2.5,
    },
    captionText: {
        marginHorizontal: 5,
        paddingLeft: 5,
        alignSelf: 'center',

    },
    topPostContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        marginBottom: 8,
    },
    postTimeContainer: {
        fontSize: 10,
    },
    postContentContainer: {
        flexDirection: 'row',
        flex: 1,
        width: "90%",
    },
    followContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginLeft: 50,
        marginRight: 50,
    },
    followBox: {
        borderColor: "#e1e2e6",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        marginHorizontal: 8,
        alignItems: "center",
        marginBottom: '2%',
        padding: 5,
    },
    followText: {
        color: "#666",
        paddingHorizontal: 20,
    },
    followNumber: {
        fontWeight: "bold",
    },
   
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})
export default connect(mapStateToProps, null)(Profile);
