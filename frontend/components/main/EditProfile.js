import React, {useEffect, useRef, useState} from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Image, Alert, ImageBackground } from 'react-native';

import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import * as ImagePicker from 'expo-image-picker';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import analytics from "@react-native-firebase/analytics";

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import { connect } from 'react-redux'

function EditProfileScreen(props) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [instagramCheck, setInstagramCheck] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    
    const getUser = async () => {
      try {
        const currentUser = await firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .get();
  
        if (currentUser.exists) {
          console.log('User Data', currentUser.data());
          setUserData(currentUser.data());
        }
      } catch (error) {
        // Handle errors, such as permissions issues or network problems.
        console.error('Error fetching user data:', error);
      }
    };

    const bottomSheetModalRef = useRef(null)

    const snapPoints = ["60%", "95%"]

    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
        setIsOpen(true);
    }

    const handleUpdate = async () => {
      analytics().logEvent('submitEditProfile', { user_name: props.currentUser.name });
    
      let imgUrl = await uploadImage();
    
      if (imgUrl === null && userData.userImg) {
        imgUrl = userData.userImg;
      }
    
      const userRef = firestore().collection('users').doc(auth().currentUser.uid);
    
      const updateData = {
        name: userData.name,
        email: userData.email,
        aboutMe: userData.aboutMe,
        location: userData.location,
        userImg: imgUrl,
      };
    
      if (userData.instagramLink) {
        updateData.instagramLink = userData.instagramLink;
      } else {
        updateData.instagramLink = firestore.FieldValue.delete();
      }
    
      if (userData.twitterLink) {
        updateData.twitterLink = userData.twitterLink;
      } else {
        updateData.twitterLink = firestore.FieldValue.delete();
      }
    
      if (userData.discordLink) {
        updateData.discordLink = userData.discordLink;
      } else {
        updateData.discordLink = firestore.FieldValue.delete();
      }

      if (userData.telegramLink) {
        updateData.telegramLink = userData.telegramLink;
      } else {
        updateData.telegramLink = firestore.FieldValue.delete();
      }
    
      if (userData.websiteLink) {
        updateData.websiteLink = userData.websiteLink;
      } else {
        updateData.websiteLink = firestore.FieldValue.delete();
      }
    
      userRef.update(updateData)
        .then(() => {
          console.log('User Updated!');
          Alert.alert(
            'Profile Updated!',
            'Your profile has been updated successfully.'
          );
        })
        .catch((error) => {
          console.error('Error updating user: ', error);
          Alert.alert('Update Failed', 'There was an issue updating your profile. Please try again later.');
        });
    
      getUser();
    };

    const uploadImage = async () => {
      if (image == null) {
        return null;
      }

      const uploadUri = image;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

      const childPath = `post/${auth().currentUser.uid}/${Math.random().toString(36)}`;

      // Add timestamp to File Name
      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extension;

      setLoading(true);
      setTransferred(0);

      const reference = storage().ref(childPath);
      const task = reference.putFile(uploadUri);

      // Set transferred state
      task.on('state_changed', (taskSnapshot) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );

        setTransferred(
          Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100),
        );
      });

      try {
        await task;

        const url = await reference.getDownloadURL();

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
    
        if (!result.canceled) {
          setImage(result.uri);
          
        }
      };

    const isInstagramURL = (input) => {
      // Regular expression to match Instagram URLs
      const instagramURLPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_\.]+\/?$/;
  
      return instagramURLPattern.test(input);
    };
  
    const handleInstagramLinkChange = (txt) => {
      if (isInstagramURL(txt)) {
        setInstagramCheck(true);
        setUserData({ ...userData, instagramLink: txt });
      } else {
        setInstagramCheck(false)
      }
    };
    
  

    return (
      <BottomSheetModalProvider>
            <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    backgroundStyle={{ borderRadius: 50, backgroundColor: "#E8E8E8"}}
                    onDismiss={() => setIsOpen(false)}
                >
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
                    </View>
            </BottomSheetModal>
        <View style={styles.container}>
                <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={() => {handlePresentModal()}}>
                    <View
                    style={{height: 100, width: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center',}}>
                        <ImageBackground
                            source={{
                            uri: image ? image : userData ? userData.userImg ||
                                'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'
                                : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7',}}
                            style={styles.profilePhotoContainer}
                            imageStyle={{borderRadius: 15}}>
                            <View
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                            <MaterialCommunityIcons
                                name="camera"
                                size={35}
                                color="#fff"
                                style={{opacity: 0.7, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff', borderRadius: 10,}}
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

                <View style={styles.action}>
                    <FontAwesome name="twitter" size={20} />
                    <TextInput
                      placeholder="X"
                      placeholderTextColor="navy"
                      value={userData ? userData.twitterLink : ''}
                      onChangeText={(txt) => setUserData({ ...userData, twitterLink: txt })}
                      style={styles.textInput}
                      autoCorrect={false}             // Disable autocorrect
                      autoCapitalize="none"          // Disable auto-capitalization
                    />
                </View>
                <View style={styles.action}>
                  <FontAwesome name="instagram" size={20} />
                  <TextInput 
                        placeholder="Instagram"
                        placeholderTextColor= "navy"
                        value={userData ? userData.instagramLink : ''}
                        onChangeText={(txt) => setUserData({...userData, instagramLink: txt})}
                        style={styles.textInput}
                        autoCorrect={false}             // Disable autocorrect
                        autoCapitalize="none"          // Disable auto-capitalization
                    />
                </View>
                <View style={styles.action}>
                    <MaterialCommunityIcons name="discord" size={20} />
                    <TextInput 
                        placeholder="Discord"
                        placeholderTextColor= "navy"
                        value={userData ? userData.discordLink : ''}
                        onChangeText={(txt) => setUserData({...userData, discordLink: txt})}
                        style={styles.textInput}
                        autoCorrect={false}             // Disable autocorrect
                        autoCapitalize="none"          // Disable auto-capitalization
                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome name="telegram" size={20} />
                    <TextInput 
                        placeholder="Telegram"
                        placeholderTextColor= "navy"
                        value={userData ? userData.telegramLink : ''}
                        onChangeText={(txt) => setUserData({...userData, telegramLink: txt})}
                        style={styles.textInput}
                        autoCorrect={false}             // Disable autocorrect
                        autoCapitalize="none"          // Disable auto-capitalization
                    />
                </View>
                <View style={styles.action}>
                    <MaterialCommunityIcons name="web" size={20} />
                    <TextInput 
                        placeholder="Website"
                        placeholderTextColor= "navy"
                        value={userData ? userData.websiteLink : ''}
                        onChangeText={(txt) => setUserData({...userData, websiteLink: txt})}
                        style={styles.textInput}
                        autoCorrect={false}             // Disable autocorrect
                        autoCapitalize="none"          // Disable auto-capitalization
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
        </View>
        </BottomSheetModalProvider>
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
