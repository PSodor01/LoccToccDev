import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'

import { useNavigation } from '@react-navigation/native';

import analytics from "@react-native-firebase/analytics";

import { Avatar } from 'react-native-elements';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function FadesList(props) {
    const [users, setUsers] = useState([])
    const [fadeList, setFadeList] = useState([])

    const { userId, postId } = props.route.params;

    useEffect(() => {
        analytics().logScreenView({ screen_name: 'FadesList', screen_class: 'FadesList'})
    }, [])
    
    useEffect(() => {

        function matchUserToFade(fadeList) {
            for (let i = 0; i < fadeList.length; i++) {
                if (fadeList[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === fadeList[i].id)
                if (user == undefined) {
                    props.fetchUsersData(fadeList[i].id, false)
                } else {
                    fadeList[i].user = user
                }
            }
            setFadeList(fadeList)
            

            
        }
        firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("fades")
            .get()
            .then((snapshot) => {
                let fadeList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                matchUserToFade(fadeList)
            })

        
    }, [props.users])

    const EmptyListMessage = () => {
        return (
          // Flat List Item
          <Text
            style={styles.emptyListStyle}
            >
            No fades yet, click the skull button on the post if you don't like the bet!
          </Text>
        );
      };

    const navigation = useNavigation();

    return (
        <View style={styles.textInputContainer}>
            <FlatList
                data={fadeList}
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

export default connect(mapStateToProps,  mapDispatchProps)(FadesList);




