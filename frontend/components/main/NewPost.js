import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Platform, Alert, FlatList, StyleSheet, Dimensions, ActivityIndicator, TextInput, TouchableOpacity, Image } from 'react-native';

import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import BottomSheet, { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Avatar } from 'react-native-elements';

import * as Notifications from 'expo-notifications';

import * as Device from 'expo-device';
import analytics from "@react-native-firebase/analytics";

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import { connect } from 'react-redux'

function AddPostScreen(props) {

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
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
  const [isOpen, setIsOpen] = useState(false);

  const { gameId, homeTeam, awayTeam, gameDate, sport} = props.route.params;

  const getFieldName = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so we add 1
    return `alltimeLeaders_${currentYear}_${currentMonth}`;
  };

  const bottomSheetModalRef = useRef(null)

    const snapPoints = ["70%", "95%"]

    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
        setIsOpen(true);
    }

  const getUser = async() => {
    const currentUser = await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then((documentSnapshot) => {
        if( documentSnapshot.exists ) {
            setUserData(documentSnapshot.data());
        }
      })
    }  

    useEffect(() => {
      getUser();
      analytics().logScreenView({ screen_name: 'NewPost', screen_class: 'NewPost',  user_name: props.currentUser.name})
    },[]);

    useEffect(() => {
        
      setAllUsers(props.allUsers)
      
  }, [props.allUsers])

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const pickImage = async () => {

    analytics().logEvent('addPictureToPost', {user_name: props.currentUser.name});

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const pickGif = (url) => {

    analytics().logEvent('addGifToPost', {user_name: props.currentUser.name});

    bottomSheetModalRef.current.dismiss();

    let result =  (url);
    console.log(result);


    if (!result.canceled) {
      setImage(result);
    }
  };

  const removeImage = () => {
    analytics().logEvent('removeImageFromPost', {user_name: props.currentUser.name});

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
        ? `(${userTagList.join(', ')}): ${taggerName} tagged you in a post on the ${awayTeam}/${homeTeam} game`
        : `(${userTagList.join(', ')}): ${taggerName} tagged you in a post`;
  
      userTokenList.forEach(token => {
        sendNotification(notificationText, token);
      });
    }
  };

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

  const savePostData = (downloadURL) => {

    analytics().logEvent('newPost', {user_name: props.currentUser.name});

    const fieldName = getFieldName();

    firestore()
        .collection('posts')
        .doc(auth().currentUser.uid)
        .collection("userPosts")
        .add({
          caption: post,
          gameId: gameId,
          creation: firestore.FieldValue.serverTimestamp(),
          creator: auth().currentUser.uid,
          likesCount: 0,
          fadesCount: 0,
          comments: 0,
          downloadURL,
          userTagList: userTagList
        }).then(() => {
          console.log('Post Added!');
          Alert.alert(
            "Let's go!" ,
            'Your post has been published successfully!',
          );
          setPost(null);
          setLoading(false)
          props.navigation.goBack();

          const updateObject = {};
          updateObject[fieldName] = firestore.FieldValue.increment(10);

          firestore()
            .collection("users")
            .doc(auth().currentUser.uid)
            .update(updateObject);

          firestore()
            .collection("users")
            .doc(auth().currentUser.uid)
            .update({
                postsCount: firestore.FieldValue.increment(1),
          })

        }).catch((error) => {
        console.log(error)
        
    })

    }

    const increasePostsCount = () => {

      if (sport == 'Fantasy') {
        null
      } else {

      firestore()
          .collection("votes")
          .doc(gameId)
          .collection("gameVotes")
          .doc("info")
          .get()
          .then((snapshot) => {
              if (snapshot.exists) {
                firestore()
                .collection("votes")
                .doc(gameId)
                .collection("gameVotes")
                .doc('info')
                .update({
                    gamePostsCount: firestore.FieldValue.increment(1)
                })

              }
            
              else {
                  
                  const gameVotes = 
                      firestore()
                      .collection("votes")
                      .doc(gameId)
                      .collection("gameVotes")
                      .doc('info')

                  gameVotes
                      .set({
                        gameDate: gameDate,
                        awayCount: 0,
                        homeCount: 0,
                        drawCount:0,
                        gamePostsCount: 1,
                       
                    }, { merge:true });
                  
              }
          })
        }
  }

  const storeNotificationForTag = async () => {
    userTagIdList.forEach(id => {
      if (awayTeam) {
        const likedName = props.currentUser.name;
        firestore().collection('users').doc(id).collection('notifications').add({
          notificationType: 'tag',
          creation: firestore.FieldValue.serverTimestamp(),
          otherUserId: auth().currentUser.uid,
          otherUsername: likedName,
          notificationText: `tagged you in a post on the ${awayTeam}/${homeTeam} game`,
        });
      } else {
        const likedName = props.currentUser.name;
        firestore().collection('users').doc(id).collection('notifications').add({
          notificationType: 'tag',
          creation: firestore.FieldValue.serverTimestamp(),
          otherUserId: auth().currentUser.uid,
          otherUsername: likedName,
          notificationText: 'tagged you in a post',
        });
      }
    });
  };

  const uploadImage = async () => {
    if (image == null) {
      const downloadURL = 'blank';
      savePostData(downloadURL);
    } else {
      setLoading(true);
  
      try {
        const uri = image;
        const childPath = `post/${auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath);
  
        const response = await fetch(uri);
        const blob = await response.blob();
  
        const reference = storage().ref().child(childPath);
        const task = reference.put(blob);
  
        const taskProgress = snapshot => {
          console.log(`transferred: ${snapshot.bytesTransferred}`);
        };
  
        const taskCompleted = async () => {
          try {
            const downloadURL = await reference.getDownloadURL();
            savePostData(downloadURL);
            console.log(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
          }
        };
  
        const taskError = snapshot => {
          console.log(snapshot);
        };
  
        task.on('state_changed', taskProgress, taskError, taskCompleted);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

    const testID = 'ca-app-pub-3940256099942544/2934735716';
    const productionID = 'ca-app-pub-8519029912093094/5346208751';
    // Is a real device and running in production.
    const adUnitID = Device.isDevice && !__DEV__ ? productionID : testID;

  const navigation = useNavigation();

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

    const searchItemView = ({item}) => {
      return (
        <View>
        {item.id == 'L3PlC2PXHYMYHsrdUtaS6tr7Ij13' || item.id == '74hAr9c5tYcERhqgyVbcwrPEr083' ?
            null :

            <View style={styles.feedItem}>
                <TouchableOpacity style={styles.postLeftContainer}
                    onPress={() => {tagUsersFunction(item.name, item.token, item.id); }}>
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


  return (
    <BottomSheetModalProvider>
        <View style={[styles.container,{ flex: 1, backgroundColor: isOpen ? "#e1e2e6" : "white" }]}>
        {gifMode == true ? 
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 50,}}
            onDismiss={() => setIsOpen(false)}
        >
          <View style={styles.header}>
            <View>
              <View />
              <View style={styles.searchSection}>
                  <FontAwesome5 name="search-dollar" color="grey" size={20} paddingRight={5} />
                  <TextInput
                      placeholder="Search GIPHY"
                      style={styles.textInput}
                      clearButtonMode={'while-editing'}
                      onChangeText={(text) => onEdit(text)}
                  />
              </View>
            </View>
          </View>
          <View style={styles.panel}>
              <FlatList
                  data={gifs}
                  renderItem={({item}) => ( 
                      <View>
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
          </View>
        </BottomSheetModal>
        :
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 50}}
            onDismiss={() => setIsOpen(false)}
        >
          <View style={styles.header}>
            <View>
              <View/>
                <View style={{ alignItems: 'center', marginBottom: "5%"}}>
                  <Text>Choose a friend below to tag in your post!</Text>
                </View>
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
          <View style={styles.panel}>
            {search ? (
              <FlatList
                data = {allUsers.sort((a, b) => a.name.localeCompare(b.name))}
                keyExtractor={(item, index) => index.toString()}
                renderItem={searchItemView}
            />
          ) : (
            <View>
              {/* Render any content you want when there is no search value */}
            </View>
          )}
          </View>
        </BottomSheetModal>
        }
          
          
            {awayTeam ? <Text style={styles.gameText}>{awayTeam} vs {homeTeam}</Text> : null}
            <View>
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
                    placeholder="Know your stuff? Share your lock..."
                    placeholderTextColor= "navy"
                    style={styles.postTextInput}
                    numberOfLines={4}
                    multiline={true}
                    maxLength={1000}
                    value={post}
                    onChangeText={(content) => setPost(content)}
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
              

            </View>
            <View style={styles.addCommentButton}>
                <View style={styles.galleryContainer}>
                  <TouchableOpacity onPress={() => {handlePresentModal(); setGifFunction()}}>
                      <MaterialIcons name="gif" size={28} justifyContent='center' alignItems='center' color="#86898B"/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {pickImage()}}>
                      <MaterialCommunityIcons name="camera" size={24} justifyContent='center' alignItems='center'  color="#86898B"/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {handlePresentModal(); setTagFunction()}}>
                      <FontAwesome5 name="user-tag" size={24} justifyContent='center' alignItems='center'  color="#86898B"/>
                  </TouchableOpacity>
                </View>
                <View style={styles.postButtonContainer}>
                {image == null && post == null ? 
                  <View style={styles.postButtonGreyed}>
                      <Text style={styles.shareText}>POST</Text>
                  </View>
                  
                  :
                 
                  <TouchableOpacity onPress={() => {uploadImage(); increasePostsCount(); sendNotificationForTag(); storeNotificationForTag()}} style={styles.postButton}>
                      <Text style={styles.shareText}>POST</Text>
                  </TouchableOpacity>
                }
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
        </View>
      </BottomSheetModalProvider>
    
  );
};

const styles = StyleSheet.create({
  
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
postTextInput: {
  width: Dimensions.get('window').width * .80,
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
postButtonGreyed: {
  alignSelf: 'center',
  backgroundColor: '#CACFD2',
  borderRadius: 6,
  alignSelf: 'center',
  paddingVertical: 3,
  paddingHorizontal: 8,
},
textInput: {
  height: 30,
  width: "75%",
  paddingHorizontal: 20,
  backgroundColor: "#ffffff",
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#e5e7e9"
},
panel: {
  padding: 20,
  backgroundColor: '#FFFFFF',
  width: '100%',
  alignItems: 'center',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},
header: {
  backgroundColor: '#FFFFFF',
  paddingTop: 20,
  paddingBottom: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
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
},
xButton: {
  alignItems: 'flex-end',
  paddingTop: 2,
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
tagListContainer: {
  flexDirection: "row",
},
searchResultsText: {
  padding: 5,
  alignSelf: 'center',
  marginLeft: "5%",
},
adView: {
  alignItems: 'center',
  justifyContent: 'center',
},

})

const mapStateToProps = (store) => ({
  allUsers: store.userState.allUsers,
  currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(AddPostScreen);