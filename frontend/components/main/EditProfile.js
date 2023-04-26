import React, {useEffect, useContext, useState} from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Image, Alert, ImageBackground } from 'react-native';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import * as ImagePicker from 'expo-image-picker';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import analytics from "@react-native-firebase/analytics";

import firebase from 'firebase'
require("firebase/firestore")

import { connect } from 'react-redux'

function EditProfileScreen(props) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    
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

    const handleUpdate = async() => {

      analytics().logEvent('submitEditProfile', { user_name: props.currentUser.name});

        let imgUrl = await uploadImage();

        if( imgUrl == null && userData.userImg ) {
            imgUrl = userData.userImg;
        }

        firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({
          name: userData.name,
          email: userData.email,
          aboutMe: userData.aboutMe,
          location: userData.location,
          userImg: imgUrl,
        })
        .then(() => {
        console.log('User Updated!');
        Alert.alert(
            'Profile Updated!',
            'Your profile has been updated successfully.'
        );
        })

        getUser()
    }

    const uploadImage = async () => {
        if( image == null ) {
          return null;
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    
        // Add timestamp to File Name
        const extension = filename.split('.').pop(); 
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;
    
        setLoading(true);
        setTransferred(0);

        const response = await fetch(uploadUri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

       
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
    
          const url = await task.snapshot.ref.getDownloadURL();
    
          setLoading(false);
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

    useEffect(() => {
      
        getUser();
        
    },[]);

    useEffect(() => {

        analytics().logScreenView({ screen_name: 'EditProfile', screen_class: 'EditProfile',  user_name: props.currentUser.name})

    },[]);

    useEffect(() => {
        (async () => {
    
          const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasGalleryPermission(galleryStatus.status === 'granted');
    
        })();

        
      }, []);
    
      const pickImage = async () => {

        analytics().logEvent('changeProfilePicture', { user_name: props.currentUser.name});

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result.uri);
          this.bs.current.snapTo(1);
        }
      };
    
    renderInner = () => (
        <View style={styles.panel}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.panelTitle}>Upload Photo</Text>
            <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
          </View>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={pickImage}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
          </TouchableOpacity>
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
          </View>
        </View>
      );

    bs = React.createRef();
    fall = new Animated.Value(1);

    return (
        <View style={styles.container}>
            <BottomSheet 
                ref={this.bs}
                snapPoints={[330, -5]}
                renderContent={this.renderInner}
                renderHeader={this.renderHeader}
                initialSnap={1}
                callbackNode={this.fall}
                enabledGestureInteraction={true}       
            />
            <Animated.View style={{margin: 20, 
            opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
            }}>
                <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                    <View
                    style={{
                        height: 100,
                        width: 100,
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <ImageBackground
                            source={{
                            uri: image
                                ? image
                                : userData
                                ? userData.userImg ||
                                'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'
                                : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7',
                            }}
                            style={styles.profilePhotoContainer}
                            imageStyle={{borderRadius: 15}}>
                            <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <MaterialCommunityIcons
                                name="camera"
                                size={35}
                                color="#fff"
                                style={{
                                    opacity: 0.7,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: '#fff',
                                    borderRadius: 10,
                                }}
                            />
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
                    <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>{userData ? userData.name : ''}</Text>
                </View>

                <View style={styles.action}>
                    <FontAwesome name="user-o" size={20} />
                    <TextInput 
                        placeholder="Name"
                        placeholderTextColor= "navy"
                        autoCorrect={false}
                        value={userData ? userData.name : ''}
                        onChangeText={(txt) => setUserData({...userData, name: txt})}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="envelope-o" size={20} />
                    <TextInput 
                        placeholder="Email"
                        placeholderTextColor= "navy"
                        keyboardType='email-address'
                        autoCorrect={false}
                        value={userData ? userData.email : ''}
                        onChangeText={(txt) => setUserData({...userData, email: txt})}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="user-o" size={20} />
                    <TextInput 
                        placeholder="About Me"
                        placeholderTextColor= "navy"
                        value={userData ? userData.aboutMe : ''}
                        onChangeText={(txt) => setUserData({...userData, aboutMe: txt})}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="globe" size={20} />
                    <TextInput 
                        placeholder="Location"
                        placeholderTextColor= "navy"
                        value={userData ? userData.location : ''}
                        onChangeText={(txt) => setUserData({...userData, location: txt})}
                        style={styles.textInput}
                    />
                </View>
                <TouchableOpacity style={styles.commandButton} onPress={handleUpdate}>
                    <Text style={styles.panelButtonTitle}>Submit</Text>
                </TouchableOpacity>
                {loading ? (
                  <View style={styles.StatusWrapper}>
                    <ActivityIndicator size="large"/>
                  </View>
                ) : (
                  <View></View>
                  
                )}
            </Animated.View>
        </View>
    )
}
    
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    commandButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
      backgroundColor: "#009387",
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
    action: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5,
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#333333',
    },
    profilePhotoContainer: {
        backgroundColor: "#e1e2e6",
        width: 100,
        height: 100,
        borderRadius: 40,
        alignSelf: 'center',
        marginTop: 16,
        overflow: 'hidden',
        marginBottom: 10,
    },
    StatusWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,


})

export default connect(mapStateToProps)(EditProfileScreen);
