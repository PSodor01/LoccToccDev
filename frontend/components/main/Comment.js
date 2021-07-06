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

function Comment(props, route) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    const { posterName, postCreation, postCaption } = props.route.params;

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

    const commentCount = comments + 1;

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

    const onCommentCount = () => {
        firebase.firestore()
        .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
        .update({
            comments: firebase.firestore.FieldValue.increment(1)
        })
      }


    

    

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.originalPostContainer}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("Profile", {})}>
                    <Image 
                        style={styles.profilePhotoPostContainer}
                        source={{ uri: posterName ? props.route.params.posterImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                    />
                </TouchableOpacity>
                <View style={styles.postRightContainer}>
                    <View style={styles.postHeaderContainer}>
                        <Text style={styles.profileNameFeedText}>{posterName}</Text>
                        <Text style={styles.postTimeContainer}>{moment(postCreation.toDate()).fromNow()}</Text>
                    </View>
                    <View style={styles.postContentContainer}>
                        <Text style={styles.captionText}>{postCaption}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.addCommentContainer}>
                <View style={styles.addCommentRightContainer}>
                    <Image style={styles.profilePhotoCommentContainer}
                        source={{ uri: posterName ?  'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7' : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}/>
                        <TextInput
                        placeholder="Type your comment here..."
                        style={styles.placeholderText}
                        multiline={true}
                        numberOfLines={4}
                        maxLength={1000}
                        onChangeText={(text) => setText(text)}
                        />
                </View>
                <View style={styles.addCommentButton}>
                    <TouchableOpacity onPress={() => {onCommentSend(); onCommentCount();}}>
                        <Text style={styles.shareText}>Post</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
            
            <FlatList
                style={styles.feed}
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View>
                        {item.length !== undefined ?
                            <View style={styles.feedItem}>
                                <TouchableOpacity
                                    onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                                    <Image 
                                        source={{uri: item.user ? item.user.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                                        style={styles.profilePhotoCommentContainer}
                                         />
                                </TouchableOpacity>
                                <View style={styles.postRightContainer}>
                                    <View style={styles.postHeaderContainer}>
                                        <Text style={styles.profileNameFeedText}>{item.user.name}</Text>
                                        <Text style={styles.postTimeContainer}>{moment(item.creation.toDate()).fromNow()}</Text>
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
      flex: 1,
      backgroundColor: "#fff",
    },
  profilePhotoPostContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#e1e2e6",
  },
  profilePhotoCommentContainer: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: "#e1e2e6"
  },
  originalPostContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e1e2e6",
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 4,
    
  },
  topPostContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom: "5%",
    paddingHorizontal: 5,
  },
  shareText: {
    color: "#e1e2e6",
    fontSize: 12,
  },
  placeholderText: {
      marginLeft: "2%",
      alignSelf: 'center',
      paddingHorizontal: 10,
      width: "90%",
  },
feedItem:{
    marginVertical:2,
    marginHorizontal:2,
    flexDirection: 'row',
    flex: 1,
    paddingTop: 10,
},
profileNameFeedText: {
    fontSize: 16,
    fontWeight: 'bold',
},
postTimeContainer: {
    fontSize: 10,
},
postContentContainer: {
    width: "95%",
    marginLeft: "3%",
},
postHeaderContainer: {
    flexDirection: 'row',
    width: "95%",
    justifyContent: 'space-between',
    paddingBottom: 4,
    marginLeft: "3%",
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
    flex: 1,
},
feed: {
    backgroundColor: "#ffffff",
    flex: 1,
    marginTop: 14,
},
addCommentContainer: {
    padding: 4,
    justifyContent: 'space-between'
},
addCommentProfilePhoto: {
    borderRadius: 40,
    height: 50,
    width: 50,
    backgroundColor: "#e1e2e6",
},
addCommentRightContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',

},
addCommentButton: {
    marginRight: "2%",
    justifyContent: 'center',
    alignItems: 'center',

},

  
  });
