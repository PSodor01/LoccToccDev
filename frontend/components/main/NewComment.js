import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, FlatList, TouchableWithoutFeedback, StyleSheet, TextInput, Image, Alert, Keyboard, KeyboardAvoidingView,} from 'react-native'

import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import * as Analytics from 'expo-firebase-analytics';

import firebase from 'firebase'
require('firebase/firestore')
require("firebase/firebase-storage")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function NewCommentScreen(props, route) {
    const [comments, setComments] = useState([])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const [gifs, setGifs] = useState([]);
    const [term, updateTerm] = useState('');

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
      Analytics.logEvent('screen_view', { screen_name: 'NewComment' })
  }, [])
    
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

      Analytics.logEvent('newComment', {});

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
                  'Nice!',
                  'Your comment has been published successfully!',
                );
                setComments(null);
                setLoading(false)
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

      const sendNotification = async (notification, token) => {
        const message = {
          to: token,
          sound: 'default',
          body: notification ? notification : 'Empty Notification',
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

    const sendNotificationForComment = async () => {
        const users = await firebase
            .firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let data = snapshot.data();

                    const token = data.token

                    if (token != undefined) {
                        const commenterName = userData.name
                        const notification = commenterName + ' commented on your post'
                        sendNotification(notification, token)
                    } else {
                    }
                }
                else {
                }
            })
    };

      const pickImage = async () => {

        Analytics.logEvent('addPictureToComment', {});

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

      const pickGif = (url) => {

        Analytics.logEvent('addGifToComment', {});


        let result =  (url);
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result);
          this.bs.current.snapTo(1);
        }
      };
    
      const removeImage = () => {

        Analytics.logEvent('removeImageFromComment', {});

        setImage(null);
      }

      const uploadImage = async () => {
        if( image == null ) {
          const downloadURL = "blank"
          onCommentSend(downloadURL);
        }  else { 
        
        setLoading(true) 
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
        }}

        const navigation = useNavigation();

        const DismissKeyboard = ({ children }) => (
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              {children}
          </TouchableWithoutFeedback>
          )

        async function fetchGifs() {

          try {
              const API_KEY = '17HE4ZOjp4kGtW49q3cnlJzkvDNZBJzh';
              const BASE_URL = 'http://api.giphy.com/v1/gifs/search';
              const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
              const res = await resJson.json();
              setGifs(res.data);
              } catch (error) {
                  console.warn(error);
              }
          } /// add facebook fresco
          
          function onEdit(newTerm) {
              updateTerm(newTerm);
              fetchGifs();
          }
      
          renderInner = () => (
              <View style={styles.panel}>
                  <FlatList
                      data={gifs}
                      renderItem={({item}) => ( 
                          <View style={styles.containerImage}>
                              <TouchableOpacity onPress={()=>{pickGif(item.images.original.url)}}>
                                  <Image
                                  style={styles.image}
                                  source={{uri: item.images.original.url}}
                                  numColumns={1}
                                  />
                              </TouchableOpacity>
                          </View>
                            
                      )}
                  />
                <TouchableOpacity
                  style={styles.panelButton}
                  onPress={() => this.bs.current.snapTo(1)}>
                  <Text style={styles.panelButtonTitle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            );
          
            renderHeader = () => (
              <View style={styles.header}>
                <View style={styles.panelHeader}>
                  <View style={styles.panelHandle} />
                  <View style={styles.searchSection}>
                      <FontAwesome5 name="search-dollar" color="grey" size={20} alignItems='center' />
                      <TextInput
                          placeholder="Search GIPHY"
                          style={styles.textInput}
                          onChangeText={(text) => onEdit(text)}
                      />
                  </View>
                </View>
              </View>
            );
      
          bs = React.createRef();
          fall = new Animated.Value(1);
      
        return (
              <KeyboardAvoidingView style={styles.container}>
                <BottomSheet 
                  ref={this.bs}
                  snapPoints={[450, -5]}
                  renderContent={this.renderInner}
                  renderHeader={this.renderHeader}
                  initialSnap={1}
                  callbackNode={this.fall}
                  enabledGestureInteraction={true}       
                />
                <Animated.View style={{margin: 15, 
                opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
                }}>
                  <Text style={styles.gameText}>Replying to @{posterName}</Text>
                  <View style={styles.typePostContainer}>
                    <Image 
                      style={styles.profilePhotoPostContainer}
                      source={{uri: userData ? userData.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                    />  
                    <TextInput
                    placeholder="Type your comment here..."
                    style={styles.postTextInput}
                    numberOfLines={4}
                    multiline={true}
                    maxLength={1000}
                    onChangeText={(text) => setText(text)}
                    />
        
                  </View>
                  <View style={styles.addCommentButton}>
                      <View style={styles.galleryContainer}>
                          <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                              <MaterialCommunityIcons name="gif" size={24} justifyContent='center' alignItems='center' color="#86898B"/>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {pickImage()}}>
                              <MaterialCommunityIcons name="camera" size={24} justifyContent='center' alignItems='center'  color="#86898B"/>
                          </TouchableOpacity>
                      </View>
                      <View style={styles.postButtonContainer}>
                          <TouchableOpacity onPress={() => {uploadImage(); onCommentCount(); sendNotificationForComment()}} style={styles.postButton}>
                              <Text style={styles.shareText}>POST</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
                  {loading ? (
                    <View style={styles.StatusWrapper}>
                      <ActivityIndicator size="large"/>
                    </View>
                  ) : (
                    <View></View>
                    
                  )}
                  <View style={styles.xButton}>
                    {image != null ? 
                        <TouchableOpacity onPress={() => {removeImage()}}>
                          <Feather name="x-circle" size={24} color ="red" />
                        </TouchableOpacity> : null}
                  </View>
                  <View style={styles.InputWrapper}>
                    {image != null ? <Image source={{uri: image}} style={styles.AddImage}/> : null}
                  </View>
                </Animated.View>
              </KeyboardAvoidingView>
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
    backgroundColor: '#fff',
  },
  typePostContainer: {
    flexDirection: 'row',
    margin: "2%",
  },
  InputWrapper: {
    width: "100%",
    alignItems: 'center',
  },
AddImage: {
    width: "80%",
    height: "70%",
    marginTop: "5%",
    alignItems: 'center',
},
StatusWrapper: {
  justifyContent: 'center',
  alignItems: 'center',
},
profilePhotoPostContainer: {
  backgroundColor: "#e1e2e6",
  width: 50,
  height: 50,
  borderRadius: 40,
  marginRight: "2%",
},
shareText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#fff",
  alignSelf: 'center',
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
  paddingLeft: 40,
  paddingRight: 10,
  paddingVertical: 8,
},
galleryContainer: {
  flexDirection: 'row',
  marginLeft: "5%",
  flex: 1,
  justifyContent: 'space-between',
  marginRight: "35%",
},
postButtonContainer: {
  paddingRight: "10%",
  
},
postButton: {
  alignSelf: 'center',
  backgroundColor: '#33A8FF',
  borderRadius: 6,
  alignSelf: 'center',
  paddingVertical: 3,
  paddingHorizontal: 8,
},
container: {
  flex: 1,
  backgroundColor: '#fff',
},
textInput: {
  height: 30,
  width: "75%",
  marginBottom: "5%",
  paddingHorizontal: 20,
  backgroundColor: "#ffffff",
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#e5e7e9"

},
panel: {
  padding: 20,
  backgroundColor: '#FFFFFF',
  paddingTop: 20,
  width: '100%',
},
header: {
  backgroundColor: '#FFFFFF',
  shadowColor: '#333333',
  shadowOffset: {width: -1, height: -3},
  shadowRadius: 2,
  shadowOpacity: 0.4,
  paddingTop: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},
panelHeader: {
  alignItems: 'center',
},
panelHandle: {
  width: 40,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#00000040',
  marginBottom: 10,
},
panelTitle: {
  fontSize: 27,
  height: 35,
},
panelSubtitle: {
  fontSize: 14,
  color: 'gray',
  height: 30,
  marginBottom: 10,
},
panelButton: {
  padding: 13,
  borderRadius: 10,
  backgroundColor: '#2e64e5',
  alignItems: 'center',
  marginVertical: 7,
},
panelButtonTitle: {
  fontSize: 17,
  fontWeight: 'bold',
  color: 'white',
},
image: {
  width: 300,
  height: 150,
  marginBottom: 5,
  borderRadius: 10,
},
searchSection: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
},
xButton: {
  alignItems: 'flex-end',
  paddingTop: 2,
},
postTextInput: {
  width: Dimensions.get('window').width * .80,
}
  
  });
