import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useNavigation } from '@react-navigation/native';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function FollowingScreen(props) {
    const [users, setUsers] = useState([])
    const [following, setFollowing] = useState([])

    const { userId } = props.route.params;

    
    useEffect(() => {

        function matchUserToFollower(following) {
            for (let i = 0; i < following.length; i++) {
                if (following[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === following[i].id)
                if (user == undefined) {
                    props.fetchUsersData(following[i].id, false)
                } else {
                    following[i].user = user
                }
            }
            setFollowing(following)
            

            
        }
        firebase.firestore()
            .collection("following")
            .doc(userId)
            .collection("userFollowing")
            .get()
            .then((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                matchUserToFollower(following)
            })

        
    }, [props.users])

    const EmptyListMessage = () => {
        return (
          // Flat List Item
          <Text
            style={styles.emptyListStyle}
            >
            Not following anyone yet, what are you waiting for!?
          </Text>
        );
      };

    

    const navigation = useNavigation();

    return (
        <View style={styles.textInputContainer}>
            <FlatList
                data={following}
                ListEmptyComponent={EmptyListMessage}
                style={styles.feed}
                renderItem={({ item }) => (
                    <View style={styles.feedItem}>
                        <TouchableOpacity style={styles.postLeftContainer}>
                            <Image 
                                style={styles.profilePhotoPostContainer}
                                source={{uri: item.user ? item.user.userImg : 'https://images.app.goo.gl/7nJRbdq4wXyVLFKV7'}}
                            />
                            <Text style={styles.searchResultsText}>{item.user ? item.user.name : null}</Text>
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
    emptyListStyle: {
        padding: 10,
        fontSize: 18,
        textAlign: 'justify',
        marginHorizontal: "5%",
      },
    
   
    
})

const mapStateToProps = (store) => ({
    users: store.usersState.users,
    following: store.userState.following,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps,  mapDispatchProps)(FollowingScreen);


