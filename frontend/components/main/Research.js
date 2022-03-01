import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, Share } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useNavigation } from '@react-navigation/native';

import moment from 'moment';

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

import {AdMobBanner} from 'expo-ads-admob'
import Constants from 'expo-constants'

function Research(props) {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    

     useEffect(() => {
        fetchData()

    }, [])

    const fetchData = () => {
        
        firebase.firestore()
        .collection("research")
        .orderBy("date", "desc")
        .get()
        .then((snapshot) => {
            let blogs = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            blogs.sort(function (x, y) {
                return y.date - x.date;
            })
            setBlogs(blogs)
            setLoading(false);
            
        })

    }
    
    const testID = 'ca-app-pub-3940256099942544/2934735716';
    const productionID = 'ca-app-pub-8519029912093094/5453808592';
    // Is a real device and running in production.
    const adUnitID = Constants.isDevice && !__DEV__ ? productionID : testID;

    
    const EmptyListMessage = () => {
        return (
          // Flat List Item
          <Text
            style={styles.emptyListStyle}
            >
            Follow others to see their posts here!
          </Text>
        );
      };


    
    
    const renderItem = ({item}) => {
        return (
            <View>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.blogText}>{item.blog}</Text>
                <Text style={styles.nameText}>{item.name}</Text>

                 <Image 
                    style={styles.profilePhotoPostContainer}
                    source={{uri: item.image ? item.image : 'https://on3static.com/uploads/dev/assets/cms/2022/02/15073045/kenpom-predicts-the-outcome-of-the-next-five-kentucky-games-sec-basketball.jpg'}}
                />
            </View>
    )}

    const navigation = useNavigation();

    return (
        <View style={styles.containerGallery}>
            <Text>hello world</Text>
            <FlatList
                style={styles.feed}
                data={blogs}
                onRefresh={() => fetchData()}
                refreshing={loading}
                renderItem={renderItem}
                />
            <View style={styles.adView}>
                <AdMobBanner
                    bannerSize="banner"
                    adUnitID={adUnitID} // Real ID: 8519029912093094/5453808592, test ID: 3940256099942544/2934735716
                    servePersonalizedAds // true or false
                />
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
    feed: {
        backgroundColor: "#ffffff",
        flex: 1,
        marginTop: 14,
    },
    nameText: {
        color: "grey"
    },
    titleText: {
        fontWeight: 'bold'
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,

})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Research);

