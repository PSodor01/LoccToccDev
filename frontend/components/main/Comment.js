import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'

import { useNavigation } from '@react-navigation/native';
import email from 'react-native-email'

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'

import moment from 'moment';

import ShareButton from '../buttons/ShareButton'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function Comment(props, route) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { posterId, posterName, posterImg, postCreation, postCaption, postImg } = props.route.params;

    const getUser = async() => {
        const currentUser = await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((documentSnapshot) => {
        if( documentSnapshot.exists ) {
            setUserData(documentSnapshot.data());
        }
        })
        }  
    

    useEffect(() => {
        fetchData()
        getUser()
    }, [props.route.params.postId, props.users])

    const fetchData = () => {
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
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                    setLoading(false);
                })
            setPostId(props.route.params.postId)
            setLoading(false);
        } else {
            matchUserToComment(comments)
            setLoading(false);
        }
    }


    const handleReportPostEmail = () => {
        const to = ['ReportPost@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'LoccTocc Report Post',
            body: ''
        }).catch(console.error)
    }

    const EmptyListMessage = () => {
        return (
          // Flat List Item
          <Text
            style={styles.emptyListStyle}
            >
            No comments yet, click the Reply button to be the first!
          </Text>
        );
      };

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.originalPostContainer}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("Profile", {uid: posterId})}>
                    <Image 
                        style={styles.profilePhotoPostContainer}
                        source={{ uri: posterImg ? posterImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                    />
                </TouchableOpacity>
                <View style={styles.postRightContainer}>
                    <View style={styles.postHeaderContainer}>
                        <Text style={styles.profileNameFeedText}>{posterName}</Text>
                        <Text style={styles.postTimeContainer}>{moment(postCreation.toDate()).fromNow()}</Text>
                    </View>
                    <View style={styles.postContentContainer}>
                        {postCaption != null ? <Text style={styles.captionText}>{postCaption}</Text> : null}
                        {postImg != "blank" ? <Image source={{uri: postImg}} style={styles.postImage}/> : null}
                    </View>
                    <View style={styles.postButtonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("NewComment", { posterName: posterName, postId: postId, uid: props.route.params.uid })} style={styles.postButton}>
                            <Text style={styles.shareText}>Reply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
            <FlatList
                data={comments}
                ListEmptyComponent={EmptyListMessage}
                onRefresh={() => fetchData()}
                refreshing={loading}
                renderItem={({ item }) => (
                    <View>
                        {item.user !== undefined ?
                            <View style={styles.feedItem}>
                                <TouchableOpacity
                                onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}>
                                <Image 
                                    style={styles.profilePhotoCommentContainer}
                                    source={{uri: item.user ? item.user.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                                />
                            </TouchableOpacity>
                            <View style={styles.postRightContainer}>
                                <View style={styles.postHeaderContainer}>
                                    <Text style={styles.profileNameFeedText}>{item.user.name}</Text>
                                    <Text style={styles.postTimeContainer}>{moment(item.creation.toDate()).fromNow()}</Text>
                                </View>
                                <View style={styles.postContentContainer}>
                                    {item.text != null ? <Text style={styles.captionText}>{item.text}</Text> : null}
                                    {item.downloadURL != "blank" ? <Image source={{uri: item.downloadURL}} style={styles.postImage}/> : null}
                                </View>
                                <View style={styles.postFooterContainer}>
                                    <TouchableOpacity
                                        style={styles.flagContainer}
                                        onPress={handleReportPostEmail}>
                                        <Icon name={"ios-flag"} size={20} color={"grey"} marginRight={10} />
                                    </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: 'center',
  },
  placeholderText: {
      marginLeft: "2%",
      alignSelf: 'center',
      paddingHorizontal: 10,
      width: "90%",
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
    paddingTop: 5,
    marginLeft: "5%",
    paddingBottom: 2,
    justifyContent: 'flex-end',
    padding: 10,
},
postRightContainer: {
    flex: 1,
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
newCommentButton: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: "2%",
    backgroundColor: "#009387",
    color: "#fff",
    width: 150
},
likeContainer: {
    flexDirection: 'row',
},
commentsContainer: {
    flexDirection: 'row',
},
flagContainer: {
    flexDirection: 'row',
    paddingRight: 20,
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
postImage: {
    width: "100%",
    height: 250,
},
captionText: {
    paddingBottom: 5,
},
postButtonContainer: {
    paddingRight: "5%",
    paddingTop: 5,
},
postButton: {
    alignSelf: 'center',
    backgroundColor: '#33A8FF',
    borderRadius: 6,
    alignSelf: 'flex-end',
    paddingVertical: 3,
    paddingHorizontal: 8,
},
emptyListStyle: {
    padding: 10,
    fontSize: 18,
    textAlign: 'justify',
    marginHorizontal: "5%",
},

  
  });