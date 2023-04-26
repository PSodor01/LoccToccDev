import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { Avatar } from 'react-native-elements';

import analytics from "@react-native-firebase/analytics";

import moment from 'moment';

import { connect } from 'react-redux'

function Search(props) {
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [browse, setBrowse] = useState(false);
    

    useEffect(() => {
        
        setAllUsers(props.allUsers)
        analytics().logScreenView({ screen_name: 'Search', screen_class: 'Search',  user_name: props.currentUser.name})

    }, [props.allUsers])

    

    const ItemView = ({item}) => {
        return (
            <View>
            {item.id == 'L3PlC2PXHYMYHsrdUtaS6tr7Ij13' || item.id == '74hAr9c5tYcERhqgyVbcwrPEr083' || item.id == 'RMcwiYPubdMzYX9uNcjwvVlXmMx1'?
                null :

                <View style={styles.feedItem}>
                    <TouchableOpacity style={styles.postLeftContainer}
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                        <Avatar
                            source={{ uri: item.userImg }}
                            icon={{ name: 'person', type: 'ionicons', color: 'white' }}
                            overlayContainerStyle={{ backgroundColor: '#95B9C7' }}
                            style={{ width: 50, height: 50 }}
                            rounded
                            size="medium"
                        />
                        <Text style={styles.searchResultsText}>{item.name}</Text>
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
            analytics().logEvent('seeAllUsersSearch', {user_name: props.currentUser.name});
        }
    }

    

     
    
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
    allUsers: store.userState.allUsers,
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(Search);


