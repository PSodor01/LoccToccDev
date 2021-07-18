import React, { useState, useEffect } from 'react';
import { View, Text, Platform, StyleSheet, Alert, ActivityIndicator, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Animated} from 'react-native';

import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const AddPostScreen = ({ route, props }) => {

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
  const [userData, setUserData] = useState(null);

  const { gameId, homeTeam, awayTeam, homeMoneyline, awayMoneyline, homeSpread, awaySpread } = route.params;

  const getUser = async() => {
    const currentUser = await firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((documentSnapshot) => {
    if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
    }
    })
    }  

    useEffect(() => {
      getUser();
    },[]);
    

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

  

  const savePostData = (downloadURL) => {

    firebase.firestore()
        .collection('posts')
        .doc(firebase.auth().currentUser.uid)
        .collection("userPosts")
        .add({
          caption: post,
          creation: firebase.firestore.FieldValue.serverTimestamp(),
          likes: 0,
          comments: 0,
          gameId: gameId,
          downloadURL
        }).then(() => {
          console.log('Post Added!');
          setPost(null);
        }).then((function () {
          navigation.goBack()
      }))
    }

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
                savePostData(snapshot);
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
          <Text style={styles.gameText}>{awayTeam} vs {homeTeam}</Text>
          <View style={styles.typePostContainer}>
            <Image 
                  style={styles.profilePhotoPostContainer}
                  source={{uri: userData ? userData.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
            />
            <TextInput
                placeholder="Know your stuff? Share your lock..."
                numberOfLines={4}
                value={post}
                onChangeText={(content) => setPost(content)}
                autoFocus={true}
            />

          </View>
          <View style={styles.addCommentButton}>
              <View style={styles.galleryContainer}>
                <TouchableOpacity onPress={() => {}}>
                  <MaterialCommunityIcons name="gif" size={24} justifyContent='center'/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {pickImage()}}>
                    <AntDesign name="camera" size={24} justifyContent='center'/>
                </TouchableOpacity>
              </View>
              <View style={styles.postButtonContainer}>
                <TouchableOpacity onPress={() => {uploadImage()}}>
                    <Text style={styles.shareText}>Post</Text>
                </TouchableOpacity>
              </View>
                
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

export default AddPostScreen;

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
profilePhotoPostContainer: {
  backgroundColor: "#e1e2e6",
  width: 50,
  height: 50,
  borderRadius: 40,
  marginRight: "2%",
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

});