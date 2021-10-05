import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native'

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import { Picker } from '@react-native-community/picker';

import firebase from 'firebase'
require('firebase/firestore')

export default class NotificationsScreen extends React.Component {

    
    render() {
        return (
            <View style={styles.genderPicker} >
                
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

