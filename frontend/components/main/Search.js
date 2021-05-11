import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'
import Icon from '@expo/vector-icons';

import firebase from 'firebase';
require('firebase/firestore');

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
                            <Image source={require('../../assets/profilePhoto.png')} style={styles.profilePhotoPostContainer} />
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
        marginBottom: "5%",
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        borderWidth: .5,
        borderColor: "#e5e7e9"

    },
    textInputContainer: {
        flex: 1,
        backgroundColor: "#ffffff",

    },
    appTextContainer: {
        alignItems: "center",
        paddingBottom: 5,
        marginTop: "5%",
        backgroundColor: "#ffffff"
    },
    searchResultsContainer: {
        flexDirection: 'row',
        flex: 1,
        width: "90%",
    },
    searchContainer: {
        padding:6,
        marginVertical:5,
        marginHorizontal:5,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
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
        width: 40,
        height: 40,
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


