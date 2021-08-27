import React, {useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Caption, Drawer, Text, TouchableRipple, Switch } from 'react-native-paper'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'


import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export function DrawerContent(props) {

    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    const [userData, setUserData] = useState(null);
    
    const getUser = async() => {
        const currentUser = await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((documentSnapshot) => {
        if( documentSnapshot.exists ) {
            setUserData(documentSnapshot.data());
        }
        })
    }

    useEffect(() => {
        getUser();
    },[]);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }

    return(
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                            <Avatar.Image
                                source={{uri: userData ? userData.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                                size={50}
                            />
                            <View style={{marginLeft: 15, flexDirection: 'column'}}>
                                <Title style={styles.title}>{userData ? userData.name : ''}</Title>
                                <Caption style={styles.caption}>{userData ? userData.email : ''}</Caption>
                            </View>
                        </View>
                             
                    </View>
                    
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline"
                                color={color}
                                size={size}/>
                            )}
                            label="Home"
                            onPress={() => {props.navigation.navigate('Feed')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline"
                                color={color}
                                size={size}/>
                            )}
                            label="Edit Profile"
                            onPress={() => {props.navigation.navigate('EditProfile')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <AntDesign
                                name="smileo"
                                color={color}
                                size={size}/>
                            )}
                            label="About Us"
                            onPress={() => {props.navigation.navigate('AboutUs')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <AntDesign 
                                name="notification"
                                color={color}
                                size={size}/>
                            )}
                            label="Community Guidelines"
                            onPress={() => {props.navigation.navigate('HouseGuidelines')}}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="phone-lock-outline"
                                color={color}
                                size={size}/>
                            )}
                            label="Contact Us"
                            onPress={() => {props.navigation.navigate('ContactUs')}}
                        />
                    
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app"
                        color={color}
                        size={size}/>
                    )}
                    label="Sign Out"
                    onPress={() => onLogout()}
                />
            </Drawer.Section>

        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
        borderBottomColor: "#f4f4f4",
        borderBottomWidth: 1,

    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        marginBottom: "10%",

    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    }
})