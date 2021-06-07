import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { GiftedChat, Bubble, Send} from 'react-native-gifted-chat'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
  
    useLayoutEffect(() => {
       const unsubscribe =
        firebase.firestore()
        .collection("chats")
        .orderBy('createdAt', 'desc').onSnapshot(snapshot=>setMessages(snapshot.docs.map(doc=>({
            _id:doc.data()._id,
            createdAt:doc.data().createdAt.toDate(),
            text:doc.data().text,
            user:doc.data().user
        }))))
        return unsubscribe;
        
    },[])
  
    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user
        } = messages[0]
        firebase.firestore()
        .collection('chats')
        .add({
            _id,
            createdAt,
            text,
            user
        })
    }, []);
  
    const renderSend = (props) => {
      return (
        <Send {...props}>
          <View>
            <MaterialCommunityIcons
              name="send-circle"
              style={{marginBottom: 5, marginRight: 5}}
              size={32}
              color="#2e64e5"
            />
          </View>
        </Send>
      );
    };
  
    const renderBubble = (props) => {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#2e64e5',
            },
          }}
          textStyle={{
            right: {
              color: '#fff',
            },
          }}
        />
      );
    };
  
    const scrollToBottomComponent = () => {
      return(
        <FontAwesome name='angle-double-down' size={22} color='#333' />
      );
    }
  
    return (
      <GiftedChat
        messages={messages}
        showAvatarforEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: firebase.auth().currentUser.uid,
          name: firebase.auth().currentUser.uid,
          //avatar: auth?.currentUser?.photoURL,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    );
  };
  
  export default ChatScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });