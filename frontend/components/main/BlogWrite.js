import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Modal, TextInput, Button,  Alert } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import analytics from "@react-native-firebase/analytics";


import * as ImagePicker from 'expo-image-picker';


import { connect } from 'react-redux'


const BlogWrite = (props) => {
  const [content, setContent] = useState('');
  const editorRef = useRef(); // Create a ref to store the editor reference
  const [images, setImages] = useState([]); // State to store image URLs
  const [blogTitle, setBlogTitle] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [isCoverPhotoSelected, setIsCoverPhotoSelected] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(null)
  const [isCoverPhotoConfirmationVisible, setIsCoverPhotoConfirmationVisible] = useState(false);


  useEffect(() => {
    analytics().logScreenView({
      screen_name: 'BlogWrite',
      user_name: props.currentUser.name,
    });
  }, []);


  useEffect(() => {
    if (isCoverPhotoSelected && coverPhoto) {
      // If cover photo is selected and provided, show the confirmation prompt
      setIsCoverPhotoConfirmationVisible(true);
    }
  }, [isCoverPhotoSelected, coverPhoto]);


  const handlePublish = async () => {
    try {
      // Ensure there's content to save
      if (!content.trim()) {
        console.warn('Cannot publish an empty blog.');
        return;
      }


      // Show the modal to get the blog title and cover photo selection from the user
      setModalVisible(true);
    } catch (error) {
      console.error('Error publishing blog:', error);
    }
  };


  const handleOkPress = async () => {
    try {
      // Close the modal after handling the OK press
      setModalVisible(false);
 
      // If the user canceled, don't proceed with publishing
      if (!blogTitle) {
        console.log('User canceled publishing.');
        return;
      }
 
      if (isCoverPhotoSelected && !coverPhoto) {
        // If cover photo is selected but not provided, show an alert
        Alert.alert('Cover Photo Required', 'Please select a cover photo.');
        return;
      }
 
      // Log coverPhoto and isCoverPhotoSelected values
      console.log('Cover Photo:', coverPhoto);
      console.log('Is Cover Photo Selected:', isCoverPhotoSelected);
 
      // If a cover photo is selected, proceed with publishing
      if (isCoverPhotoSelected) {
        // If cover photo is selected and provided, save it to Firebase
        let coverPhotoUrl;
        if (coverPhoto) {
          try {
            const response = await fetch(coverPhoto.uri);
            const blob = await response.blob();
            const storageRef = storage().ref(`blogCovers/${auth().currentUser.uid}/${Date.now()}`);
            await storageRef.put(blob);
            coverPhotoUrl = await storageRef.getDownloadURL();
          } catch (error) {
            console.error('Error handling cover photo:', error);
            return; // Return early if there's an error with the cover photo
          }
        }
 
        // Create a new document in the 'blogs' collection with the user's UID as the document ID
        const blogRef = firestore()
          .collection('blog')
          .doc(auth().currentUser.uid)
          .collection('userBlogs')
          .doc(); // Automatically generates a unique ID
 
        // Log the generated blogRef ID
        console.log('Generated BlogRef ID:', blogRef.id);
 
        // Save the blog content along with additional details
        const blogData = {
          content,
          images: images,
          authorId: auth().currentUser.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
          blogTitle,
          blogViews: 0,
          blogCoverPhoto: coverPhotoUrl, // Use the processed cover photo URL
        };
 
        await blogRef.set(blogData);
 
        // Show an alert to indicate successful blog publication
        Alert.alert('Blog Published Successfully');
        props.navigation.goBack();
 
        console.log('Blog published successfully!');
      }
    } catch (error) {
      console.error('Error publishing blog:', error);
    }
  };


  const handleAddImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });


      if (!result.canceled) {
        const imageUrl = result.uri;


        // Insert the image into the editor at the current cursor position
        editorRef.current?.insertImage(imageUrl, 'Image', {
          width: '100%',
          height: 'auto',
        });


        // Add the image URL to the images array for saving in Firestore
        setImages((prevImages) => [...prevImages, imageUrl]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };


  const handleCoverPhotoSelection = () => {
    // Show an alert to confirm the cover photo selection
    Alert.alert(
      'Cover Photo',
      'Add a cover photo to your blog',
      [
       
        {
          text: 'Ok',
          onPress: () => {
            setIsCoverPhotoSelected(true);
            setModalVisible(false);
            handleSelectCoverPhoto(); // Allow the user to select a cover photo
          },
        },
      ],
      { cancelable: false }
    );
  };


  const handleSelectCoverPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });


      if (!result.canceled) {
        // Set the cover photo
        setCoverPhoto(result);


        // Don't proceed with publishing immediately; show a confirmation prompt
        setIsCoverPhotoConfirmationVisible(true);
      }
    } catch (error) {
      console.error('Error picking cover photo:', error);
    }
  };


  const handleCoverPhotoConfirmation = (proceed) => {
    if (proceed) {
      // If the user chooses to proceed, invoke handleOkPress
      handleOkPress();
    } else {
      // If the user cancels, reset cover photo and confirmation visibility
      setCoverPhoto(null);
      setIsCoverPhotoConfirmationVisible(false);
    }
  };


  const AlertConfirmation = ({ message, onConfirm }) => {
    return (
      <Modal transparent={true} animationType="slide" visible={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{message}</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => onConfirm(false)} />
              <Button title="Proceed" onPress={() => onConfirm(true)} />
            </View>
          </View>
        </View>
      </Modal>
    );
  };




  const handleInsertLink = () => {
    // Show the modal for entering link details
    setIsLinkModalVisible(true);
  };


  const handleOkLinkPress = () => {
    // Check if the linkUrl has a valid scheme, if not, add a default one (e.g., http://)
    const isValidUrl =
      linkUrl.startsWith('http://') || linkUrl.startsWith('https://');


    const fullUrl = isValidUrl ? linkUrl : `http://${linkUrl}`;


    // Insert the link with the specified text and formatted URL
    const linkHtml = `<a href="${fullUrl}">${linkText}</a>`;
    editorRef.current?.insertHTML(linkHtml);


    // Close the modal
    setIsLinkModalVisible(false);
  };


  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <RichEditor
          ref={editorRef}
          style={styles.editor}
          initialContentHTML="<p>Delete this text and start blogging!</p>"
          onChange={(text) => setContent(text)}
          autoCorrect={true}
        />
        <RichToolbar
          style={styles.toolbar}
          editor={editorRef}
          actions={[
            actions.keyboard,
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.setStrikethrough,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertImage,
            actions.insertLink,
            actions.undo,
          ]}
          onPressAddImage={handleAddImage}
          selectedIconTint={'#2095F2'}
          disabledIconTint={'#bfbfbf'}
          onInsertLink={handleInsertLink}
        />
        <TouchableOpacity
          style={[styles.publishButton, { marginBottom: 500 }]}
          onPress={handlePublish}
        >
          <Text style={styles.publishButtonText}>Publish</Text>
        </TouchableOpacity>
      </ScrollView>
      {isModalVisible && (
        <Modal transparent={true} animationType="slide" visible={isModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Please enter your blog title below:</Text>
              <TextInput
                placeholder="Blog Title"
                onChangeText={(text) => setBlogTitle(text)}
              />
              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                />
                <Button title="OK" onPress={handleCoverPhotoSelection} />
              </View>
            </View>
          </View>
        </Modal>
      )}
      {isCoverPhotoConfirmationVisible && (
        <AlertConfirmation
          message="Are you sure you want to proceed? Once published, you cannot edit or delete the blog."
          onConfirm={(proceed) => handleCoverPhotoConfirmation(proceed)}
        />
      )}
      {isLinkModalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isLinkModalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Link Text:</Text>
              <TextInput
                placeholder="Type Text Here"
                onChangeText={(text) => setLinkText(text)}
              />
              <Text> </Text>
              <Text>Link URL:</Text>
              <TextInput
                placeholder="Type URL in www.mylink.com format"
                onChangeText={(text) => setLinkUrl(text)}
                autoCapitalize="none"
              />
              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setIsLinkModalVisible(false)}
                />
                <Button title="OK" onPress={handleOkLinkPress} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editor: {
    backgroundColor: 'white',
    minHeight: 100,
  },
  toolbar: {
    backgroundColor: 'aliceblue',
    height: 50,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
  publishButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: "10%"
  },
  publishButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
 




const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
})


export default connect(mapStateToProps)(BlogWrite);