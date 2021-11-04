import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllUsers, fetchUsersData } from '../../redux/actions/index'

function Search(props) {
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        
        setAllUsers(props.allUsers)
        
    }, [props.allUsers])

    const ItemView = ({item}) => {
        return (
            <View style={styles.feedItem}>
                <TouchableOpacity style={styles.postLeftContainer}
                    onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                    <Image 
                        style={styles.profilePhotoPostContainer}
                        source={{uri: item.name ? item.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                    />
                    <Text style={styles.searchResultsText}>{item.name}</Text>
                </TouchableOpacity>
                
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

   
    
    return (
        <View style={styles.textInputContainer}>
            <View style={styles.appTextContainer}>
                <FontAwesome5 name="search-dollar" color="grey" size={20} paddingRight={5} />
                <TextInput
                    style={styles.textInput}
                    placeholder="Type to find friends..."
                    clearButtonMode={'while-editing'}
                    value={search}
                    onChangeText={(text) => searchFilter(text)}
                   />
            </View>

            {search == '' ?
            null :
            
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
        paddingBottom: 5,
        marginTop: "5%",
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
        marginVertical:5,
        marginHorizontal:5,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
        flexDirection: 'row',
    },
    postLeftContainer: {
        flexDirection: "row",
    },
    
})

const mapStateToProps = (store) => ({
    users: store.usersState.users,
    allUsers: store.userState.allUsers,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps,  mapDispatchProps)(Search);


