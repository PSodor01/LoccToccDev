import React, { useState, useEffect } from 'react'
import { StyleSheet, Switch, TouchableOpacity, View, Text, Alert } from 'react-native'

import AntDesign from 'react-native-vector-icons/AntDesign';

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device';

import analytics from "@react-native-firebase/analytics";

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { connect } from 'react-redux'

const SettingsScreen = (props) => {

    const [isEnabled, setIsEnabled] = useState();
    const [notificationValue, setNotificationValue] = useState();

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const snapshot = await firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .get();
    
            if (snapshot.exists) {
              let userData = snapshot.data();
              if (userData && userData.token) {
                setNotificationValue(true);
                setIsEnabled(true);
              } else {
                setNotificationValue(false);
                setIsEnabled(false);
              }
            } else {
              setNotificationValue(false);
              setIsEnabled(false);
            }
          } catch (error) {
            // Handle errors, such as permissions issues or network problems.
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUserData();
    
        // Log screen view using analytics
        analytics().logScreenView({
          screen_name: 'Settings',
          screen_class: 'Settings',
          user_name: props.currentUser.name,
        });
      }, [props.currentUser.name]);

    const notificationFunction = async () => {
        if (notificationValue == true) {

            setNotificationValue(false)

            firestore()
            .collection("users")
            .doc(auth().currentUser.uid)
            .update({
                token: null
            })

        } else {

            setNotificationValue(true);

            let token;
            if (Device.isDevice) {
              const { status: existingStatus } = await Notifications.getPermissionsAsync();
              let finalStatus = existingStatus;
              if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync({
                  ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowAnnouncements: true,
                  },
                });
                finalStatus = status;
              }
              if (finalStatus !== 'granted') {
                //alert('Failed to get push token for push notification!');
                return;
              }
              token = (await Notifications.getExpoPushTokenAsync()).data;
            } else {
              alert('Must use physical device for Push Notifications');
             
            }
          
            if (token) {
              const res = await 
                firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .set({ token }, { merge: true });
          
              Alert.alert('Success!', 'You will now receive push notifications from locctocc!');
              setNotificationValue(true)
            }
          
            if (Platform.OS === 'android') {
              Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
              });
            }
          
            return token;
        }
          };



    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        notificationFunction();
        analytics().logEvent('userTurnOnNotifications', {user_name: props.currentUser.name});
    }
       

    const deleteAccount = () => {
        auth().currentUser?.delete();

        analytics().logEvent('deleteAccount', {user_name: props.currentUser.name});
            
    }

    const deleteAccountHandler = () => {
        Alert.alert(
            'Delete Account?',
            'This action is permanent, all of your posts and account information will be deleted.',

            [
                { text: 'Delete', onPress: () => deleteAccount()},
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
            ],
            { cancelable: true }

        )
    }


    return (
        <View style={styles.container}>
            <View style={styles.documentRow}>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={deleteAccountHandler}>
                    <AntDesign name={"deleteuser"} size={16} color={"black"}/>
                    <Text>    Delete Account</Text>
                </TouchableOpacity>
                
            </View>
            <View style={styles.rowContainer}>
                <View style={styles.buttonContainer}>
                    <AntDesign name={"bells"} size={16} color={"black"}/>
                    <Text>    Notifications</Text>
                </View>
                <View >
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                
                
            </View>
            
        </View>
        
    )
    
}
 
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    documentRow: {
        flexDirection: 'row',
        padding: 10,
        marginRight: "5%",
        borderBottomColor: "#e1e2e6",
        borderBottomWidth: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginRight: "5%",
        borderBottomColor: "#e1e2e6",
        borderBottomWidth: 1,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    comingSoonText: {
        alignSelf: 'center',
        color: 'red',
    },
    headerName: {
        alignSelf: 'center',
        color: "#009387",
        fontWeight: "bold",
        fontSize: 20,
        fontStyle: 'italic'
    }, 
    toggleButtonOn: {
        borderColor: '#228B22',
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: "center",
    },
    buttonTextOn: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#228B22'
    },
    toggleButtonOff: {
        borderColor: '#BB1E10',
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: "center",
    },
    buttonTextOff: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#BB1E10'
    }
    
    
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,

})

export default connect(mapStateToProps)(SettingsScreen);