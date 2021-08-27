import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
            })
    }
    
    return (
        <View style={styles.textInputContainer}>
            <View style={styles.appTextContainer}>
                <FontAwesome5 name="search-dollar" color="grey" size={20} paddingRight={5} />
                <TextInput
                    style={styles.textInput}
                    placeholder="Find your lock..."
                    onChangeText={(search) => fetchUsers(search)} />
            </View>

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                style={styles.feed}
                renderItem={({ item }) => (
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
                    
            )}
            />
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


