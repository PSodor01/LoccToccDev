import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native'

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import { Picker } from '@react-native-community/picker';

import firebase from 'firebase'
require('firebase/firestore')

export default class NotificationsScreen extends React.Component {

    componentDidMount() {
        this.registerForPushNotifications();
    }

    registerForPushNotifications = async () => {

        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            }
            if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            });
        }
                                
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref("users").child(uid).update({
            expoPushToken: token
        })


    }

    state={
        gender:'male'
    }

    render() {
        return (
            <View style={styles.genderPicker} >
                <Text>Hello</Text>
                <Picker
                itemStyle={{ fontSize: 14, }}
                selectedValue={this.state.gender}
                onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}
                >
                    <Picker.Item
                        label='Female'
                        value='female'
                    />
                    <Picker.Item
                        label='Male'
                        value='male'
                    />
                </Picker>
        </View>
        )
    }



}

    


    

    

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    
   
})

