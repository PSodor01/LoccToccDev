import React, { useState, useEffect } from 'react'
import { StyleSheet, Switch, TouchableOpacity, View, Text, Alert } from 'react-native'

import AntDesign from 'react-native-vector-icons/AntDesign';

import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'

import * as Analytics from 'expo-firebase-analytics';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

const SettingsScreen = (props) => {

    const [switchValue, setSwitchValue] = useState(false);
    const [notificationValue, setNotificationValue] = useState();

    useEffect(() => {

        /*firebase.firestore()
        .collection("users")
        .doc('3THx5eaT6BRJreb2JensMsjRv3O2')
        .get()
        .then((snapshot) => {
            if (snapshot.exists) {
                let userData = snapshot.data();
                let token = userData.token
                setNotificationValue(true)
            }
            else {
                setNotificationValue(false)
            }
        })*/

        Analytics.logEvent('screen_view', { screen_name: 'Settings', user_name: props.currentUser.name });
        
    }, [])



    const toggleSwitch = (value) => {
        setSwitchValue(value)
        
    };

    const deleteAccount = () => {
        firebase.auth().currentUser?.delete();

        Analytics.logEvent('deleteAccount', {user_name: props.currentUser.name});
            
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

    const notificationFunction = async () => {
        if (notificationValue == true) {

            setNotificationValue(false)

            firebase.firestore()
            .collection("users")
            .doc('3THx5eaT6BRJreb2JensMsjRv3O2')
            .update({
                token: null
            })

            
            
            
        } else {

            setNotificationValue(true);

            let token;
            if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
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
                const res = await firebase.firestore()
                    .collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({token}, { merge:true });
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
        padding: 10,
    },
    documentRow: {
        flexDirection: 'row',
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