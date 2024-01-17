import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign';

import analytics from "@react-native-firebase/analytics";
import { BannerAdSize, TestIds, BannerAd } from 'react-native-google-mobile-ads';

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device';

import moment from 'moment';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { connect } from 'react-redux'

function NotificationsScreen({ route, ...props }) {
    const [notifications, setNotifications] = useState([]);
    const [notificationValue, setNotificationValue] = useState();
    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8519029912093094/8258310490';
  
  
    useEffect(() => {
      // Rest of the code
  
      // Reset badge count when leaving the Notifications screen
      return () => {
        Notifications.setBadgeCountAsync(0);
      };
    }, []);

    useEffect(() => {

        
        firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .get()
        .then((snapshot) => {
        if (snapshot.exists) {
            let userData = snapshot.data();
            if (userData.hasOwnProperty("token")) {
                setNotificationValue(true);
            } else {
                setNotificationValue(false);
            }
        } else {
                setNotificationValue(false);
        }
        });

        analytics().logScreenView({ screen_name: 'Settings', screen_class: 'Settings',  user_name: props.currentUser.name})
        
    }, [])

    const notificationFunction = async () => {
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
      };

    const toggleSwitch = () => {
        notificationFunction();
        analytics().logEvent('userTurnOnNotifications', {user_name: props.currentUser.name});
    }
    

    useEffect(() => {

        analytics().logScreenView({ screen_name: 'Notifications', screen_class: 'Notifications',  user_name: props.currentUser.name})

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

   

    const openAdLink = () => {

        analytics().logEvent('adClick', {user_name: props.currentUser.name, adPartner: 'Kutt'});
            
    }
    
    return (
        <View style={styles.textInputContainer}>
            <View >
            {notificationValue == true ? null :
                <TouchableOpacity
                    onPress={() => {toggleSwitch()}}
                    style={{
                        backgroundColor: '#1DA1F2', 
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        marginTop: 10,
                        alignSelf: 'center', 
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Turn On Notifications</Text>
                </TouchableOpacity>
            }
                
            </View>
            <FlatList
                data = {notifications}
                ListEmptyComponent={EmptyListMessage}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}
            />  
            <View style={styles.adView}>
                <BannerAd
                    unitId={adUnitId}
                    sizes={[BannerAdSize.FULL_BANNER]}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
                
            </View>
           
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
        alignItems: "center",
        justifyContent: "center",
    },
    
})

const mapStateToProps = (store) => ({
    userNotifications: store.userState.userNotifications,
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(NotificationsScreen);


