import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native'

import firebase from 'firebase'

const Messages = [
    {
      id: '1',
      userName: 'Jenny Doe',
      userImg: require('../../assets/profilePhoto.png'),
      messageTime: '4 mins ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
      id: '2',
      userName: 'John Doe',
      userImg: require('../../assets/profilePhoto.png'),
      messageTime: '2 hours ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
      id: '3',
      userName: 'Ken William',
      userImg: require('../../assets/profilePhoto.png'),
      messageTime: '1 hours ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
      id: '4',
      userName: 'Selina Paul',
      userImg: require('../../assets/profilePhoto.png'),
      messageTime: '1 day ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
    {
      id: '5',
      userName: 'Christy Alex',
      userImg: require('../../assets/profilePhoto.png'),
      messageTime: '2 days ago',
      messageText:
        'Hey there, this is my test for a post of my social app in React Native.',
    },
  ];

  state = {
      name: ''
  };

  


  const MessagesScreen = ({navigation}) => {
        return (
            <View style={styles.container}>
                <FlatList 
                    data={Messages}
                    keyExtractor={item=>item.id}
                    renderItem={({item})=>(
                        <TouchableOpacity 
                            style={styles.Card}
                            onPress={() => navigation.navigate('Chat', {uid: item.id})}
                        >
                            <View style={styles.UserInfo}>
                                <View style={styles.UserImgWrapper}>
                                    <Image style={styles.UserImg} source={item.userImg} />
                                </View>
                                <View style={styles.TextSection}>
                                    <View style={styles.UserInfoText}>
                                        <Text style={styles.UserName}>{item.userName}</Text>
                                        <Text style={styles.PostTime}>{item.messageTime}</Text>
                                    </View>
                                    <Text style={styles.messageText}>{item.messageText}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                />
            </View>
        )
    }

export default MessagesScreen;

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      flex: 1,
    },
    Card: {
        width: "100%",
    },
    UserInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    UserImgWrapper: {
        paddingTop: 15,
        paddingBottom: 15,
    },
    UserImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    TextSection: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding:15,
        paddingLeft: 0,
        marginLeft: 10,
        width: 300,
        borderBottomWidth: 1,
        borderBottomColor: "#cccccc",
    },
    UserInfoText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    UserName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    PostTime: {
        fontSize: 12,
        color: "#666",
    },
    MessageText: {
        fontSize: 14,
        color: "#333333",
    }
  
  });


