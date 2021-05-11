import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';

import { View, Image, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import { FontAwesome5 } from "@expo/vector-icons";

import * as firebase from 'firebase'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))



const firebaseConfig = {
  apiKey: "AIzaSyAmXTsXkPI-J6mineXVOY9wa0y-B7R_GDw",
  authDomain: "locctoccdev.firebaseapp.com",
  databaseURL: "https://locctoccdev-default-rtdb.firebaseio.com",
  projectId: "locctoccdev",
  storageBucket: "locctoccdev.appspot.com",
  messagingSenderId: "736365930098",
  appId: "1:736365930098:web:a626e007f31172af5684eb",
  measurementId: "G-4YXWQRXEF1"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'
import NewPostScreen from './components/main/NewPost'
import MessagesScreen from './components/main/Messages'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const onDrawerPress = () => {
  console.warn( 'Drawer' );
  Alert.alert(
      'Placeholder: this button will open the drawer navigator',
    );
}
const onMessagesPress = () => {
  console.warn( 'Messages' );
  Alert.alert(
      'Placeholder: this button will open the messages screen',
    );
}

export class App extends Component {
  constructor(props) {
    super()
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Image
                style={styles.logo}
                source={require("../frontend/assets/LoccToccLogo.png")}
          />
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Main">
            <Drawer.Screen name="Messages" component={MessagesScreen} />
          </Drawer.Navigator>
          
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App


const styles = StyleSheet.create({
  logo: {
      width: 200,
      height: 200,
      borderRadius: 40,
      alignSelf: 'center',
      marginTop: 16,
      overflow: 'hidden',
      marginBottom: 10,
  },
  headerName: {
    alignSelf: 'center',
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,

}, 
  
  
})

