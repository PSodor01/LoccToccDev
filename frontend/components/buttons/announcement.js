import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const AnnouncementModal = ({ showAnnouncement, onClose }) => {
  if (!showAnnouncement) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={showAnnouncement}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.headerText}>Introducing!</Text>
          <Text></Text>
          <Text style={styles.subHeaderText}>The Locctocc Leaderboard</Text>
          <Text></Text>
          <Text style={styles.paragraphText}>
            - Earn points by posting locks and engaging with the Locctocc community!
          </Text>
          <Text style={styles.paragraphText}>
            - Check out the Leaderboard to see where you stand!
          </Text>
          <Text style={styles.paragraphText}>
            - Look for the <MaterialCommunityIcons name="trophy" /> at the bottom of your screen!
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={30} color="white" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '75%',
    height: '40%',
    backgroundColor: '#2e64e5',
    padding: 20,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  paragraphText: {
    fontSize: 16,
    color: 'white',
    marginVertical: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default AnnouncementModal;
