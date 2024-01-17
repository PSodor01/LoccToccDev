import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Modal, TextInput, Button,  Alert } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 
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
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false)

  useEffect(() => {
    analytics().logScreenView({ screen_name: 'BlogWrite', user_name: props.currentUser.name });

  }, []);

  const handlePublish = async () => {
    try {
      // Ensure there's content to save
      if (!content.trim()) {
        console.warn('Cannot publish an empty blog.');
        return;
      }

      // Show the modal to get the blog title from the user
      setModalVisible(true);
    } catch (error) {
      console.error('Error publishing blog:', error);
    }
  };
  
  // Handle the "OK" button press separately
  const handleOkPress = async () => {
    try {
      // Close the modal after handling the OK press
      setModalVisible(false);
  
      // If the user canceled, don't proceed with publishing
      if (!blogTitle) {
        console.log('User canceled publishing.');
        return;
      }
  
      // Confirm with the user before publishing
      Alert.alert(
        'Confirmation',
        'Are you sure you want to publish this blog? It can not be edited or deleted once posted.',
        [
          {
            text: 'Cancel',
            onPress: () => {
              console.log('User canceled publishing.');
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              // Create a new document in the 'blogs' collection with the user's UID as the document ID
              const blogRef = firestore()
                .collection('blog')
                .doc(auth().currentUser.uid)
                .collection('userBlogs')
                .doc(); // Automatically generates a unique ID
  
              // Save the blog content along with additional details
              await blogRef.set({
                content,
                images: images,
                authorId: auth().currentUser.uid,
                createdAt: firestore.FieldValue.serverTimestamp(),
                blogTitle,
                blogViews: 0,
              });
  
              // Show an alert to indicate successful blog publication
              Alert.alert('Blog Published Successfully');
              props.navigation.goBack();
  
              console.log('Blog published successfully!');
            },
          },
        ],
        { cancelable: false }
      );
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
            base64: true, // Add this option
          });
          
          if (!result.canceled) {
            const imageUrl = `data:image/jpeg;base64,${result.base64}`;
          
            // Insert the image into the editor at the current cursor position
            editorRef.current?.insertImage(imageUrl, 'Image', { width: '100%', height: 'auto' });
          
            // Add the image URL to the images array for saving in Firestore
            setImages(prevImages => [...prevImages, imageUrl]);
          }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleInsertLink = () => {
    // Show the modal for entering link details
    setIsLinkModalVisible(true);
  };

  const handleOkLinkPress = () => {
    // Check if the linkUrl has a valid scheme, if not, add a default one (e.g., http://)
    const isValidUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
  
    const fullUrl = isValidUrl ? linkUrl : `http://${linkUrl}`;
  
    // Insert the link with the specified text and formatted URL
    const linkHtml = `<a href="${fullUrl}">${linkText}</a>`;
    editorRef.current?.insertHTML(linkHtml);
  
    // Close the modal
    setIsLinkModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <RichEditor
          ref={editorRef}
          style={styles.editor}
          initialContentHTML="<p>Delete this text and start blogging!</p>"
          onChange={text => setContent(text)}
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
        <TouchableOpacity style={[styles.publishButton, { marginBottom: 500 }]} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publish</Text>
        </TouchableOpacity>
      </ScrollView>
      {isModalVisible && (
        <Modal
            transparent={true}
            animationType="slide"
            visible={isModalVisible}
        >
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text>Please enter your blog title below:</Text>
                <TextInput
                placeholder="Blog Title"
                onChangeText={(text) => setBlogTitle(text)}
                />
                <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                <Button title="OK" onPress={handleOkPress} />
                </View>
            </View>
            </View>
        </Modal>
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
                  onChangeText={text => setLinkText(text)}
                />
                <Text> </Text>
                <Text>Link URL:</Text>
                <TextInput
                  placeholder="Type URL in www.mylink.com format"
                  onChangeText={text => setLinkUrl(text)}
                  autoCapitalize="none"
                />
                <View style={styles.modalButtons}>
                  <Button title="Cancel" onPress={() => setIsLinkModalVisible(false)} />
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


