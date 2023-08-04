import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { useNavigation } from '@react-navigation/native';

import { Avatar } from 'react-native-elements';

import analytics from "@react-native-firebase/analytics";

import firebase from 'firebase'
require("firebase/firestore")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function LikesList(props) {
    const [users, setUsers] = useState([])
    const [likeList, setLikeList] = useState([])

    const { userId, postId } = props.route.params;

    useEffect(() => {
        analytics().logScreenView({ screen_name: 'LikesList', screen_class: 'LikesList'})
    }, [])

    
    useEffect(() => {

        function matchUserToLike(likeList) {
            for (let i = 0; i < likeList.length; i++) {
                if (likeList[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === likeList[i].id)
                if (user == undefined) {
                    props.fetchUsersData(likeList[i].id, false)
                } else {
                    likeList[i].user = user
                }
            }
            setLikeList(likeList)
            

            
        }
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .get()
            .then((snapshot) => {
                let likeList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                matchUserToLike(likeList)
            })

        
    }, [props.users])

    const EmptyListMessage = () => {
        return (
          // Flat List Item
          <Text
            style={styles.emptyListStyle}
            >
            No hammers yet, smash the hammer button on the post if you like the bet!
          </Text>
        );
      };

    const navigation = useNavigation();

    return (
        <View style={styles.textInputContainer}>
            <FlatList
                data = {likeList}
                ListEmptyComponent={EmptyListMessage}
                style={styles.feed}
                renderItem={({ item }) => (
                    <View style={styles.feedItem}>
                        <TouchableOpacity style={styles.postLeftContainer}
                            onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
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
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps,  mapDispatchProps)(LikesList);



