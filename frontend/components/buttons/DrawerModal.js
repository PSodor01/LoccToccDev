import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Share } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import auth from '@react-native-firebase/auth';

const DrawerModal = ({ isVisible, onClose, navigation }) => {
  

  const onShare = async (props) => {
    try {
      const result = await Share.share({
        message:
          'Check out locctocc! https://apps.apple.com/app/apple-store/id1585460244?pt=123488891&ct=IA&mt=8',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  const onLogout = async () => {
    try {
      // Sign out the user
      await auth().signOut();
    
      // Optionally navigate to a login screen or perform other logout-related actions.
    } catch (error) {
      // Handle sign-out errors.
      console.error('Error signing out:', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <TouchableOpacity style={styles.linkButton} onPress={() => { navigation.navigate('EditProfile'); onClose(); }}>
                <Feather name="edit-2" color="black" size={24} />
                <Text style={styles.linkText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => { navigation.navigate('Settings'); onClose(); }}>
                <Feather name="settings" color="black" size={24} />
                <Text style={styles.linkText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => { navigation.navigate('LegalDocs'); onClose(); }}>
                <Feather name="shield" color="black" size={24} />
                <Text style={styles.linkText}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => { navigation.navigate('ContactUs'); onClose(); }}>
                <Feather name="phone-call" color="black" size={24} />
                <Text style={styles.linkText}>Reach Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={onShare}>
                <Feather name="share" color="black" size={24} />
                <Text style={styles.linkText}>Share with your homies!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={onLogout}>
                <Feather name="log-out" color="black" size={24} />
                <Text style={styles.linkText}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
        </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  linkText: {
    marginLeft: 10,
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeText: {
    fontSize: 16,
  },
});

export default DrawerModal;
