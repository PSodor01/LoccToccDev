import React, { useState, useEffect } from 'react'
import { StyleSheet, Switch, TouchableOpacity, View, Text } from 'react-native'

import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const SettingsScreen = () => {

    const [switchValue, setSwitchValue] = useState(false);
    const [notificationValue, setNotificationValue] = useState();

    useEffect(() => {

        firebase.firestore()
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
        })
        
    }, [])



    const toggleSwitch = (value) => {
        setSwitchValue(value)
        
    };

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
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={styles.titleText}>Notifications</Text>
                {notificationValue == true ?
                    <TouchableOpacity 
                        style={styles.toggleButtonOn}
                        onPress={() => {notificationFunction()}}>
                        <Text style={styles.buttonTextOn}>ON</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity 
                        style={styles.toggleButtonOff}
                        onPress={() => {notificationFunction()}}>
                        <Text style={styles.buttonTextOff}>OFF</Text>
                    </TouchableOpacity>
                }
                
            </View>
            <View style={styles.container}>
                <Text style={styles.titleText}>Dark Mode</Text>
                <Text style={styles.comingSoonText}>Coming Soon!</Text>
                <Switch 
                    onValueChange={toggleSwitch}
                    value={switchValue}
                />
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
        backgroundColor: '#fff',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
        marginLeft: "2%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: '8%',
        paddingVertical: '4%'
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

export default SettingsScreen;