import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image, Alert, Keyboard, KeyboardAvoidingView,} from 'react-native'

import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function NewCommentScreen(props, route) {
    const [comments, setComments] = useState([])
    const [text, setText] = useState("")
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState(null);

    const { posterName, postId, uid } = props.route.params;

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
        getUser();
    },[]);

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
                .orderBy("creation", "desc")
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

    const onCommentSend = (downloadURL) => {
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
                downloadURL
            })
            .then(() => {
                console.log('Comment Added!');
                Alert.alert(
                  'Comment published!',
                  'Your comment has been published successfully!',
                );
                setComments(null);
              }).then((function () {
                navigation.goBack()
            }))
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

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result.uri);
        }
      };

      const uploadImage = async () => {
        if( image == null ) {
          return null;
        }  
        
        const uri = image;
          const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
          console.log(childPath)
  
          const response = await fetch(uri);
          const blob = await response.blob();
  
          const task = firebase
              .storage()
              .ref()
              .child(childPath)
              .put(blob);
  
          const taskProgress = snapshot => {
              console.log(`transferred: ${snapshot.bytesTransferred}`)
          }
  
          const taskCompleted = () => {
              task.snapshot.ref.getDownloadURL().then((snapshot) => {
                  onCommentSend(snapshot);
                  console.log(snapshot)
              })
          }
  
          const taskError = snapshot => {
              console.log(snapshot)
          }
  
          task.on("state_changed", taskProgress, taskError, taskCompleted);
        }

        const navigation = useNavigation();

        const DismissKeyboard = ({ children }) => (
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              {children}
          </TouchableWithoutFeedback>
          )
      
        return (
            <DismissKeyboard>
              <KeyboardAvoidingView style={styles.container}>
                <Text style={styles.gameText}>Replying to @{posterName}</Text>
                <View style={styles.typePostContainer}>
                  <Image 
                        style={styles.profilePhotoCommentContainer}
                        source={{uri: userData ? userData.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}/>
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
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.shareText}>GIF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {pickImage()}}>
                        <Text style={styles.shareText}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {uploadImage(); onCommentCount();}}>
                        <Text style={styles.shareText}>Post</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.InputWrapper}>
                  {image != null ? <Image source={{uri: image}} style={styles.AddImage}/> : null}
      
                  
                  {uploading ? (
                    <View style={styles.StatusWrapper}>
                      <Text>{transferred} % Completed!</Text>
                      <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                  ) : (
                    <View></View>
                    
                  )}
                </View>
                
              </KeyboardAvoidingView>
            </DismissKeyboard>
            
          
        );
      };

      const mapStateToProps = (store) => ({
        users: store.usersState.users
    })
    const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);


export default connect(mapStateToProps, mapDispatchProps)(NewCommentScreen);

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    typePostContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: "2%",
    },
    InputWrapper: {
      flex: 1,
      alignItems: 'center',
      width: "100%",
    },
  AddImage: {
      width: "80%",
      height: "70%",
      marginTop: "5%",
  },
  StatusWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoCommentContainer: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: "#e1e2e6"
  },
  shareText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  gameText: { 
    fontWeight: 'bold',
    marginLeft: "2%",
    color: "grey"
  },
  addCommentButton: {
    flexDirection: 'row',
    borderBottomColor: "#CACFD2",
    borderBottomWidth: 1,
    borderTopColor: "#CACFD2",
    borderTopWidth: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    backgroundColor: "#CACFD2",
  },
  galleryContainer: {
    flexDirection: 'row',
    marginLeft: "5%",
    flex: 1,
    justifyContent: 'space-between',
    marginRight: "45%",
  },
  postButtonContainer: {
    paddingRight: "10%",
  },
  placeholderText: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    width: "90%",
},
textInput: {
        height: 40,
        marginRight: "15%",
        marginLeft: "15%",
        marginBottom: "5%",
        paddingHorizontal: 30,
        borderColor: "#009387",
        borderWidth: 1,
        borderRadius: 20,

    },
  
  });
