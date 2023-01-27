import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, Share } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useNavigation } from '@react-navigation/native';

import * as Device from 'expo-device';

import moment from 'moment';

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'


function Merch(props) {
    const [loading, setLoading] = useState(true);
    

     useEffect(() => {
        fetchData()

    }, [])

    const fetchData = () => {
        


    }
    
    const testID = 'ca-app-pub-3940256099942544/2934735716';
    const productionID = 'ca-app-pub-8519029912093094/5453808592';
    // Is a real device and running in production.
    const adUnitID = Device.isDevice && !__DEV__ ? productionID : testID;

    
    const EmptyListMessage = () => {
        return (
          // Flat List Item
          <Text
            style={styles.emptyListStyle}
            >
            Stay tuned for the next merch drop!
          </Text>
        );
      };

    const navigation = useNavigation();

    return (
        <View style={styles.containerGallery}>
            <Text>hello world</Text>
            


            <View style={styles.adView}>
               
            </View>
        </View>
            

    )
}

const styles = StyleSheet.create({
    containerGallery: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 10,
        flex: 1,
    },
    adView: {
        alignItems: 'center',
        justifyContent: 'center',
    },

})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,

})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Merch);

