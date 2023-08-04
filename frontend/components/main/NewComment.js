import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, FlatList, TouchableWithoutFeedback, StyleSheet, TextInput, Image, Alert, Keyboard, KeyboardAvoidingView,} from 'react-native'

import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Avatar } from 'react-native-elements';

import * as Notifications from 'expo-notifications';

import analytics from "@react-native-firebase/analytics";

import firebase from 'firebase'
require("firebase/firestore")

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
    const [userTagList, setUserTagList] = useState([]);
    const [userTagIdList, setUserTagIdList] = useState([]);
    const [userTokenList, setUserTokenList] = useState([]);
    const [isUserTagged, setIsUserTagged] = useState(false);
    const [gifMode, setGifMode] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');

    const { posterName, postId, uid, awayTeam, homeTeam} = props.route.params;

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
      analytics().logScreenView({ screen_name: 'NewComment', screen_class: 'NewComment',  user_name: props.currentUser.name})
  }, [])
    
    useEffect(() => {
        getUser();
    },[]);

    useEffect(() => {
        
      setAllUsers(props.allUsers)
      
    }, [props.allUsers])

    const onCommentSend = (downloadURL) => {

      analytics().logEvent('newComment', {user_name: props.currentUser.name});

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
                downloadURL,
                userTagList: userTagList
            })
            .then(() => {
                console.log('Comment Added!');
                Alert.alert(
                  'Nice!',
                  'Your comment has been published successfully!',
                );
                setComments(null);
                setLoading(false)
                props.navigation.goBack();
              })
          };

    const onCommentCount = () => {
        firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .update({
            comments: firebase.firestore.FieldValue.increment(1)
        })

        if (awayTeam  != undefined) {
          const likedName = props.currentUser.name
          console.log(props.route.params.uid, likedName)
          firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .collection("notifications")
            .add({
                notificationType: "comment",
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                otherUserId: firebase.auth().currentUser.uid,
                otherUsername: likedName,
                notificationText: 'commented on your post on the ' + awayTeam + "/" + homeTeam + " game"
                })
        } else {
          const likedName = props.currentUser.name
          console.log(props.route.params.uid, likedName)
          firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .collection("notifications")
            .add({
                notificationType: "comment",
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                otherUserId: firebase.auth().currentUser.uid,
                otherUsername: likedName,
                notificationText: 'commented on your post',
                })
        }
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
                        if (awayTeam  != undefined) {const notification = '(' + posterName + '): ' + commenterName + ' commented on your post on the ' + awayTeam + "/" + homeTeam + " game"
                            sendNotification(notification, token)}
                            else {const notification = '(' + posterName + '): ' + commenterName + ' commented on your post'
                            sendNotification(notification, token)}
                    } else {
                    }
                }
                else {
                }
            })
    };

    

      const pickImage = async () => {

        analytics().logEvent('addPictureToComment', {user_name: props.currentUser.name});

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

        analytics().logEvent('addGifToComment', {user_name: props.currentUser.name});


        let result =  (url);
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result);
          this.bs.current.snapTo(1);
        }
      };
    
      const removeImage = () => {

        analytics().logEvent('removeImageFromComment', {user_name: props.currentUser.name});

        setImage(null);
      }

      const removeTaggedUser = (index) => {
        analytics().logEvent('removeTaggedUserFromPost', {user_name: props.currentUser.name});
    
    
        setUserTagList(userTagList.filter((_, i) => i !== index));
        setUserTagIdList(userTagIdList.filter((_, i) => i !== index));
        setUserTokenList(userTokenList.filter((_, i) => i !== index));
      };

      const setGifFunction = () => {
        setGifMode(true)
      }
    
      const setTagFunction = () => {
        setGifMode(false)
      }

      const tagUsersFunction = (name, token, id) => {
        analytics().logEvent('addUsersToTagList', { user_name: props.currentUser.name });
      
        if (userTagList.length >= 5) {
          // Only allow up to 5 tagged users
          return;
        }
      
        setUserTagList([...userTagList, name]);
        setUserTagIdList([...userTagIdList, id]);
        setUserTokenList([...userTokenList, token]);
        setIsUserTagged(true);
      }
    
      const sendNotificationForTag = async () => {
        if (userTokenList) {
          const taggerName = props.currentUser.name;
          const notificationText = awayTeam
            ? `(${userTagList.join(', ')}): ${taggerName} tagged you in a comment on the ${awayTeam}/${homeTeam} game`
            : `(${userTagList.join(', ')}): ${taggerName} tagged you in a comment`;
      
          userTokenList.forEach(token => {
            sendNotification(notificationText, token);
          });
        }
      };

      const storeNotificationForTag = async () => {
        userTagIdList.forEach(id => {
          if (awayTeam) {
            const likedName = props.currentUser.name;
            firebase.firestore().collection('users').doc(id).collection('notifications').add({
              notificationType: 'tag',
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              otherUserId: firebase.auth().currentUser.uid,
              otherUsername: likedName,
              notificationText: `tagged you in a comment on the ${awayTeam}/${homeTeam} game`,
            });
          } else {
            const likedName = props.currentUser.name;
            firebase.firestore().collection('users').doc(id).collection('notifications').add({
              notificationType: 'tag',
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              otherUserId: firebase.auth().currentUser.uid,
              otherUsername: likedName,
              notificationText: 'tagged you in a comment',
            });
          }
        });
      };

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
      
          renderGifInner = () => (
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
          
            renderGifHeader = () => (
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

            renderTagInner = () => (
              <View style={styles.panel}>
                  <FlatList
                      data = {allUsers.sort((a, b) => a.name.localeCompare(b.name))}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={searchItemView}
                          
                  />
                <TouchableOpacity
                  style={styles.panelButton}
                  onPress={() => this.bs.current.snapTo(1)}>
                  <Text style={styles.panelButtonTitle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            );
          
            renderTagHeader = () => (
              <View style={styles.header}>
                <View style={styles.panelHeader}>
                  <View style={styles.panelHandle} />
                  <Text>Choose a friend below to tag in your post!</Text>
                  <Text> </Text>
                  <View style={styles.searchSection}>
                      <FontAwesome5 name="search-dollar" color="grey" size={20} paddingRight={5} />
                      <TextInput
                          style={styles.textInput}
                          placeholder="Type to find friends..."
                          clearButtonMode={'while-editing'}
                          value={search}
                          onChangeText={(text) => searchFilter(text)}
                      />
                  </View>
                </View>
              </View>
            );
      
            const searchItemView = ({item}) => {
              return (
                <View>
                {item.id == 'L3PlC2PXHYMYHsrdUtaS6tr7Ij13' || item.id == '74hAr9c5tYcERhqgyVbcwrPEr083' ?
                    null :
      
                    <View style={styles.feedItem}>
                        <TouchableOpacity style={styles.postLeftContainer}
                            onPress={() => {tagUsersFunction(item.name, item.token, item.id); this.bs.current.snapTo(1)}}>
                            <Avatar
                              source={{ uri: item.userImg }}
                              icon={{ name: 'person', type: 'ionicons', color: 'white' }}
                              overlayContainerStyle={{ backgroundColor: '#95B9C7' }}
                              style={{ marginRight: "2%", width: 50, height: 50 }}
                              rounded
                              size="medium"
                          />
                            <Text style={styles.searchResultsText}>{item.name}</Text>
                        </TouchableOpacity>
                    </View> }
                </View>
                
            )
          }

          const searchFilter = (text) => {
            if (text) {
                const newData = allUsers.filter((item) => {
                    const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
    
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1
    
                    
                });
                setAllUsers(newData)
                setSearch(text)
            } else {
                setAllUsers(props.allUsers)
                setSearch(text)
            }
        }
      
          bs = React.createRef();
          fall = new Animated.Value(1);
      
        return (
              <KeyboardAvoidingView style={styles.container}>
              {gifMode == true ? 
                <BottomSheet 
                    ref={this.bs}
                    snapPoints={[550, -5]}
                    renderContent={this.renderGifInner}
                    renderHeader={this.renderGifHeader}
                    initialSnap={1}
                    callbackNode={this.fall}
                    enabledGestureInteraction={true}       
                />
              :
                <BottomSheet 
                    ref={this.bs}
                    snapPoints={[550, -5]}
                    renderContent={this.renderTagInner}
                    renderHeader={this.renderTagHeader}
                    initialSnap={1}
                    callbackNode={this.fall}
                    enabledGestureInteraction={true}       
                />
              }
                <Animated.View style={{margin: 15, 
                opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
                }}>
                  <Text style={styles.gameText}>Replying to @{posterName}</Text>
                  <View style={styles.typePostContainer}>
                    <Avatar
                      source={{ uri: userData ? userData.userImg : null }}
                      icon={{ name: 'person', type: 'ionicons', color: 'white' }}
                      overlayContainerStyle={{ backgroundColor: '#95B9C7' }}
                      style={{ marginRight: "2%", width: 50, height: 50 }}
                      rounded
                      size="medium"
                    />  
                    <TextInput
                      placeholder="Type your comment here..."
                      placeholderTextColor= "navy"
                      style={styles.postTextInput}
                      numberOfLines={4}
                      multiline={true}
                      maxLength={1000}
                      onChangeText={(text) => setText(text)}
                    />
        
                  </View>
                  {isUserTagged && (
                    <View>
                      <Text style={{ fontWeight: 'bold' }}>Tagged friends: </Text>
                      {userTagList.map((name, index) => (
                        <View style={styles.tagListContainer}>
                          <Text key={userTagIdList[index]} style={{ color: '#0033cc', fontWeight: 'bold' }}>@{name} </Text>
                          <TouchableOpacity onPress={() => removeTaggedUser(index)}>
                            <Feather name="x-circle" size={16} color="red" />
                          </TouchableOpacity>
                        </View>
                        
                      ))}
                    </View>
                  )}
                  <View style={styles.addCommentButton}>
                      <View style={styles.galleryContainer}>
                          <TouchableOpacity onPress={() => {this.bs.current.snapTo(0); setGifFunction()}}>
                            <MaterialIcons name="gif" size={28} justifyContent='center' alignItems='center' color="#86898B"/>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {pickImage()}}>
                              <MaterialCommunityIcons name="camera" size={24} justifyContent='center' alignItems='center'  color="#86898B"/>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {this.bs.current.snapTo(0); setTagFunction()}}>
                              <FontAwesome5 name="user-tag" size={24} justifyContent='center' alignItems='center'  color="#86898B"/>
                          </TouchableOpacity>
                      </View>
                      <View style={styles.postButtonContainer}>
                          <TouchableOpacity onPress={() => {uploadImage(); onCommentCount(); sendNotificationForComment(); sendNotificationForTag(), storeNotificationForTag()}} style={styles.postButton}>
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
        users: store.usersState.users,
        currentUser: store.userState.currentUser,
        allUsers: store.userState.allUsers,
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
  marginRight: "25%",
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
},
tagListContainer: {
  flexDirection: "row",
},
searchResultsText: {
  padding: 5,
  alignSelf: 'center',
  marginLeft: "5%",
},
feedItem:{
  padding:6,
  marginVertical:2,
  marginHorizontal:5,
  borderBottomWidth: 1,
  borderBottomColor: "#e1e2e6",
  flexDirection: 'row',
},
postLeftContainer: {
  flexDirection: "row",
},
  
  })


