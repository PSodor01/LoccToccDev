import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import {AdMobBanner} from 'expo-ads-admob'
import Constants from 'expo-constants'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllUsers, fetchUsersData } from '../../redux/actions/index'

function Search(props) {
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [browse, setBrowse] = useState(false)

    useEffect((uid) => {
        
        setAllUsers(props.allUsers)
        
    }, [props.allUsers])

    const ItemView = ({item}) => {
        return (
            <View>
            {item.id == 'L3PlC2PXHYMYHsrdUtaS6tr7Ij13' ?
                null :

                <View style={styles.feedItem}>
                    <TouchableOpacity style={styles.postLeftContainer}
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                        <Image 
                            style={styles.profilePhotoPostContainer}
                            source={{uri: item.name ? item.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                        />
                        <Text style={styles.searchResultsText}>{item.name}</Text>
                        <Text>{item.token}</Text>
                    </TouchableOpacity>
                </View> }
            </View>
            
        )
    }

    const searchFilter = (text) => {
        if (text) {
            const newData = allUsers.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();

                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1

                
            });
            setAllUsers(newData)
            setSearch(text)
        } else {
            setAllUsers(props.allUsers)
            setSearch(text)
        }
    }

    const browseFunction = () => {
        if (browse == true) {
            setBrowse(false)
        } else {
            setBrowse(true)
        }
    }

    const testID = 'ca-app-pub-3940256099942544/2934735716';
    const productionID = 'ca-app-pub-8519029912093094/1666835736';
    // Is a real device and running in production.
    const adUnitID = Constants.isDevice && !__DEV__ ? productionID : testID;

   
    
    return (
        <View style={styles.textInputContainer}>
            <View style={styles.appTextContainer}>
                <TouchableOpacity
                    onPress={() => {browseFunction()}}
                    style={styles.showAllButton}>
                    <FontAwesome5 name={"search-dollar"} size={20} color={"#009387"}/>
                </TouchableOpacity>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type to find friends..."
                    clearButtonMode={'while-editing'}
                    value={search}
                    onChangeText={(text) => searchFilter(text)}
                   />
                
            </View>
            

            {search == '' ?
                browse == true ?
                    <FlatList
                        data = {allUsers.sort((a, b) => a.name.localeCompare(b.name))}
                        style={styles.feed}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={ItemView}
                />  :
                <View style={styles.feed}>

                </View> :
            
            <FlatList
                data = {allUsers.sort((a, b) => a.name.localeCompare(b.name))}
                style={styles.feed}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}
            /> }

            <View style={styles.adView}>
                <AdMobBanner
                    bannerSize="banner"
                    adUnitID={adUnitID} // Real ID: 8519029912093094/1666835736, test ID: 3940256099942544/2934735716
                    servePersonalizedAds // true or false
                />
            </View>

            
        </View>
        
            
            
    )
};

const styles = StyleSheet.create({
    textInput: {
        height: 30,
        width: "75%",
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        borderWidth: .5,
        borderColor: "#CACFD2"

    },
    textInputContainer: {
        flex: 1,
        backgroundColor: "#ffffff",

    },
    appTextContainer: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: "2%",
        flexDirection: 'row',
        padding: 5,
    },
    searchResultsText: {
        fontSize: 16,
        padding: 5,
        alignSelf: 'center',
        marginLeft: "5%",
    },
    feed: {
        backgroundColor: "#ffffff",
        flex: 1,
    },
    profilePhotoPostContainer: {
        backgroundColor: "#e1e2e6",
        width: 50,
        height: 50,
        borderRadius: 40,
    },
    feedItem:{
        padding:6,
        marginVertical:2,
        marginHorizontal:5,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
        flexDirection: 'row',
    },
    postLeftContainer: {
        flexDirection: "row",
    },
    showAllButton: {
        marginRight: "2%",
    },
    adView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    
})

const mapStateToProps = (store) => ({
    users: store.usersState.users,
    allUsers: store.userState.allUsers,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps,  mapDispatchProps)(Search);


