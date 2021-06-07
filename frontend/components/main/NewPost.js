import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const AddPostScreen = () => {

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
  const [userData, setUserData] = useState(null);



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

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);

    firebase.firestore()
    .collection('posts')
    .doc(firebase.auth().currentUser.uid)
    .collection("userPosts")
    .add({
      caption: post,
      postImg: imageUrl,
      creation: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      comments: 0,
    })
    .then(() => {
      console.log('Post Added!');
      Alert.alert(
        'Post published!',
        'Your post has been published Successfully!',
      );
      setPost(null);
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }

  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };

  const navigation =useNavigation();

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
    )

  return (
      <View style={styles.container}>
        <View style={styles.topPostContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={30} color="#2e64e5"/>
          </TouchableOpacity>
          
          {uploading ? (
            <View>
              <Text>{transferred} % Completed!</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <TouchableOpacity onPress={submitPost} style={styles.shareButton}>
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.middlePostContainer}>
          <Image 
              style={styles.profilePhotoPostContainer}
              source={{uri: userData ? userData.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
          />
          <TextInput
            placeholder="Think you know your stuff? Share your lock"
            style={styles.placeholderText}
            multiline
            numberOfLines={4}
            value={post}
            onChangeText={(content) => setPost(content)}
          />
        </View>
        <View>
          <ActionButton buttonColor="#2e64e5">
            <ActionButton.Item
              buttonColor="#9b59b6"
              title="Take Photo"
              onPress={takePhotoFromCamera}>
              <Icon name="camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#3498db"
              title="Choose Photo"
              onPress={choosePhotoFromLibrary}>
              <Icon name="camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </View>
        
      </View>
    
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  InputWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    backgroundColor: "#2e64e515",
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