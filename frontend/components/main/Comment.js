import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native'

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

import moment from 'moment';

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {

        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === comments[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }


        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])


    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                likes: 0,
            })
            .then(() => {
                console.log('Comment Added!');
                Alert.alert(
                  'Comment published!',
                  'Your comment has been published successfully!',
                );
                setComments(null);
              })
              .catch((error) => {
                console.log('Something went wrong with adding comment to firestore.', error);
              });
    }

    const navigation =useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.topPostContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="close" size={30} color="#2e64e5"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onCommentSend()} style={styles.shareButton}>
                    <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.middlePostContainer}>
                <Image source={require('../../assets/profilePhoto.png')} style={styles.profilePhotoPostContainer} />
                <TextInput
                placeholder="Share your commment..."
                style={styles.placeholderText}
                multiline
                numberOfLines={4}
                onChangeText={(text) => setText(text)}
                />
            </View>
            
            <FlatList
                style={styles.feed}
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        {item.user !== undefined ?
                            <View style={styles.feedItem}>
                                <TouchableOpacity
                                    onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                                    <Image source={require('../../assets/profilePhoto.png')} style={styles.profilePhotoPostContainer} />
                                </TouchableOpacity>
                                <View style={styles.postRightContainer}>
                                    <View style={styles.postHeaderContainer}>
                                        <Text style={styles.profileNameFeedText}>{item.user.name}</Text>
                                    </View>
                                    <View style={styles.postContentContainer}>
                                        <Text style={styles.captionText}>{item.text}</Text>
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


const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      flex: 1,
    },
  profilePhotoPostContainer: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  topPostContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: "5%",
    paddingHorizontal: 5,
  },
  middlePostContainer: {
    flexDirection: 'row',
    width: "90%",
    paddingTop: 5,
    paddingBottom: 5,
  },
  shareText: {
    color: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: "#2e64e5",
    borderRadius: 30,
  },
  placeholderText: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
feedItem:{
    padding:6,
    marginVertical:2,
    marginHorizontal:2,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e2e6",
    flexDirection: 'row',
    flex: 1,
},
profileNameFeedText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 2.5,
},
captionText: {
    marginHorizontal: 10,

},
postTimeContainer: {
    fontSize: 10,
},
postContentContainer: {
    flex: 1,
    width: "90%",
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
    width: "60%",
    paddingTop: 5,
    marginLeft: "5%",

},
postRightContainer: {
    width: "100%",
},
feed: {
    backgroundColor: "#ffffff",
    flex: 1,
    marginTop: 14,
},

  
  });
