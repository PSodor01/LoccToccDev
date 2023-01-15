import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as Analytics from 'expo-firebase-analytics';

import moment from 'moment';

import * as Device from 'expo-device';

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Notifications(props) {
    const [notifications, setNotifications] = useState([]);
    

    useEffect(() => {
        
        Analytics.logEvent('screen_view', { screen_name: 'Notifications', user_name: props.currentUser.name })

        const hammerIcon = (<Ionicons name={"hammer"} size={28} color={"#AAA9AD"}/>);
        const fadeIcon = (<Ionicons name={"skull"} size={28} color={"black"}/>);
        const followIcon = (<Ionicons name={"people"} size={28} color={"#1D9BF0"}/>);
        const commentIcon = (<FontAwesome5 name={"comments-dollar"} size={28} color={"#009387"}/>);
        const tagIcon = (<FontAwesome5 name={"tags"} size={28} color={"#95B9C7"}/>);

        const tagIcons = [
            
            {
                notificationType: 'hammer',
                icon: hammerIcon,
            },
            {
                notificationType: 'fade',
                icon: fadeIcon,
            },
            {
                notificationType: 'follow',
                icon: followIcon,
            },
            {
                notificationType: 'comment',
                icon: commentIcon,
            },
            {
                notificationType: 'tag',
                icon: tagIcon,
            },
            
        ];

        const arr1 = props.userNotifications
        
        const mergeArrays = (arr1 = [], tagIcons = []) => {
            let res = [];
            res = arr1.map(obj => {
                const index = tagIcons.findIndex(el => el["notificationType"] == obj["notificationType"]);
                const { icon } = index !== -1 ? tagIcons[index] : {};
                return {
                    ...obj,
                    icon
                };
            });
            return res;
        }

        setNotifications(mergeArrays(arr1, tagIcons))

    }, [props.userNotifications])


    const ItemView = ({item}) => {
        return (
            <View>
                <View style={styles.feedItem}>
                    <View style={styles.iconContainer}>
                        <Text>{item.icon}</Text>
                    </View>
                    <View style={styles.mainContainer}>
                        <View style={styles.notificationContainer}>
                            <Text style={styles.notificationText}><Text style={styles.usernameText}>{item.otherUsername}</Text> {item.notificationText} </Text>
                        </View>
                        <View style={styles.notificationContainer}>
                            <Text style={styles.postTimeText}>{moment(item.creation.toDate()).fromNow()}</Text>
                        </View>
                    </View>
                    
                    
                </View>
            </View>
            
        )
    }

    const EmptyListMessage = () => {
        return (
          // Flat List Item
          <View>
            <Text style={styles.emptyListStyle}>No recent notifications - post some bets to get started!</Text>
          </View>
          
        );
      };

    const testID = 'ca-app-pub-3940256099942544/2934735716';
    const productionID = 'ca-app-pub-8519029912093094/1666835736';
    // Is a real device and running in production.
    const adUnitID = Device.isDevice && !__DEV__ ? productionID : testID;

    const openAdLink = () => {

        Analytics.logEvent('adClick', {user_name: props.currentUser.name, adPartner: 'BetUS'});
            
    }

    /* <View style={styles.adView}>
                <AdMobBanner
                    bannerSize="banner"
                    adUnitID={adUnitID} 
                    servePersonalizedAds // true or false
                />
            </View> */
   
    
    return (
        <View style={styles.textInputContainer}>
            <FlatList
                data = {notifications}
                style={styles.feed}
                ListEmptyComponent={EmptyListMessage}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}
            />  
            <TouchableOpacity style={styles.adView}
                onPress={() => { Linking.openURL('https://bit.ly/3uAOAIh'); openAdLink()}} >
                <Image 
                    style={{ width: "95%", height: 40, resizeMode: "contain" }}
                    source={require('../../assets/fantasyJocksBanner.jpg')}
                />
            </TouchableOpacity>
        </View>
        
            
            
    )
};

const styles = StyleSheet.create({
    textInputContainer: {
        flex: 1,
        backgroundColor: "#ffffff",

    },
    feedItem:{
        padding:10,
        marginVertical:2,
        marginHorizontal:5,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
        flexDirection: 'row',
        alignItems: 'center',
        width: "85%",
    },
    notificationContainer: {
        flexDirection: 'row',
    },
    mainContainer: {
    },
    iconContainer: {
        marginRight: "3%",
    },
    notificationText: {
        fontSize: 14,
    },
    usernameText: {
        fontWeight: 'bold',
    },
    postTimeText: {
        fontSize: 10,
        color: 'grey'
    },
    emptyListStyle: {
        padding: 10,
        fontSize: 18,
        textAlign: 'justify',
        marginHorizontal: "5%",
    },
    adView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    
})

const mapStateToProps = (store) => ({
    userNotifications: store.userState.userNotifications,
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(Notifications);


