import React, { useState, useEffect } from 'react';
import { View, Text, Platform, StyleSheet, Alert, ActivityIndicator, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard,} from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const AddPostScreen = ({ route }) => {

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
        })
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
      <View style={styles.container}>
        <Image 
              style={styles.profilePhotoPostContainer}
              source={{uri: userData ? userData.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
        />
        <TextInput
            placeholder="Think you know your stuff? Share your lock"
            style={styles.InputField}
            multiline
            numberOfLines={4}
            value={post}
            onChangeText={(content) => setPost(content)}
        />
        <View>
            <TouchableOpacity onPress={() => { uploadImage() }} style={styles.SubmitBtn}>
            
              <Text style={styles.SubmitBtnText}>Post 2</Text>
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
        <View>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.shareButton}>
            <Text>Pick Image</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  InputWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  InputField: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    textAlign: 'center',
    width: '90%',
    marginBottom: 15
},
AddImage: {
    width: '100%',
    height: 250,
    marginBottom: 15,
},

StatusWrapper: {
  justifyContent: 'center',
  alignItems: 'center',
},

SubmitBtn: {
  flexDirection: 'row',
  justifyContent: 'center',
  backgroundColor: '#2e64e515',
  borderRadius: 5,
  padding: 10,
},

SubmitBtnText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#2e64e5',
},
profilePhotoPostContainer: {
  backgroundColor: "#e1e2e6",
  width: 50,
  height: 50,
  borderRadius: 40,
},
topPostContainer: {
  flexDirection: 'row',
  width: "90%",
  justifyContent: "space-between",
  marginTop: "5%",
},
middlePostContainer: {
  flexDirection: 'row',
  width: "90%",
  paddingTop: 10,
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
  width: "90%",
}

});