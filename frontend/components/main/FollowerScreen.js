import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'

import { useNavigation } from '@react-navigation/native';

import analytics from "@react-native-firebase/analytics";

import { Avatar } from 'react-native-elements';

import firebase from 'firebase'
require("firebase/firestore")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function FollowerScreen(props) {
    const [following, setFollowing] = useState([])

    const { userId } = props.route.params;

    useEffect(() => {
        console.log(userId)
        analytics().logScreenView({ screen_name: 'FollowerScreen', screen_class: 'FollowerScreen'})
    }, [])
    
    useEffect(() => {

        function matchUserToFollower(following) {
            for (let i = 0; i < following.length; i++) {
                if (following[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === following[i].follower)
                if (user == undefined) {
                    props.fetchUsersData(following[i].follower, false)
                } else {
                    following[i].user = user
                }
            }
            
            setFollowing(following)
            console.log(following)

        }
            firebase.firestore()
            .collectionGroup("userFollowing")
            .where('id', '==', userId)
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
            No followers yet, click 'Follow' on the user's profile to be the first!
          </Text>
        );
      };

    

    const navigation = useNavigation();

    return (
        <View style={styles.textInputContainer}>
            <FlatList
                data = {following}
                ListEmptyComponent={EmptyListMessage}
                style={styles.feed}
                renderItem={({ item }) => (
                    <View style={styles.feedItem}>
                        <TouchableOpacity style={styles.postLeftContainer}
                        onPress={() => props.navigation.navigate("Profile", {uid: item.follower})}>
                            <Avatar
                                source={{ uri: item.user ? item.user.userImg : null }}
                                icon={{ name: 'person', type: 'ionicons', color: 'white' }}
                                overlayContainerStyle={{ backgroundColor: '#95B9C7' }}
                                style={{ width: 50, height: 50 }}
                                rounded
                                size="medium"
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
    textInputContainer: {
        flex: 1,
        backgroundColor: "#ffffff",

    },
    searchResultsText: {
        fontSize: 16,
        padding: 5,
        alignSelf: 'center',
        marginLeft: "5%",
    },
    feedItem:{
        padding:4,
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

export default connect(mapStateToProps,  mapDispatchProps)(FollowerScreen);



