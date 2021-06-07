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

import { DrawerContent } from './components/Drawer'

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'
import NewPostScreen from './components/main/NewPost'
import EditProfileScreen from './components/main/EditProfile'
import MessagesScreen from './components/main/Messages'
import Feed from './components/main/Feed'
import Search from './components/main/Search'
import NotificationsScreen from './components/main/Notifications'
import Profile from './components/main/Profile'
import ChatScreen from './components/main/Chat'
import AboutUsScreen from './components/main/AboutUs'
import PartyRulesScreen from './components/main/PartyRules'
import Odds from './components/main/Odds'

import MessagesButton from './components/MessagesButton'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const MainStack = createStackNavigator();

const MainStackScreen = ({navigation, props}) => (
  <MainStack.Navigator 
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#009387",
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
      >
    <MainStack.Screen name="Main" component={MainScreen} 
      options={{
        headerTitle: () => (
          <Text style={styles.headerName}>locctocc</Text>
        ),
        headerLeft: () => (
          <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.openDrawer()}
            >
            <FontAwesome5 name="bars" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <MessagesButton /> 
        )
      }}
        />

      <MainStack.Screen name="Feed" component={Feed} />
      <MainStack.Screen name="Search" component={Search}/>
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
      <MainStack.Screen name="Profile" component={Profile} />
      <MainStack.Screen name="Add" component={AddScreen} />
      <MainStack.Screen name="Save" component={SaveScreen} />
      <MainStack.Screen name="Comment" component={CommentScreen} />
      <MainStack.Screen name="NewPost" component={NewPostScreen} />
      <MainStack.Screen name="EditProfile" component={EditProfileScreen} 
        options={{headerTitle: "Edit Profile"}} />
      <MainStack.Screen name="Messages" component={MessagesScreen} />
      <MainStack.Screen name="Chat" component={ChatScreen} />
      <MainStack.Screen name="PartyRules" component={PartyRulesScreen}
        options={{headerTitle: "Party Rules"}} />
      <MainStack.Screen name="AboutUs" component={AboutUsScreen}
        options={{headerTitle: "About Us"}} />
      <MainStack.Screen name="Odds" component={Odds} />
    
    
    
  </MainStack.Navigator>
)


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
        <NavigationContainer >
          <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="Main" component={MainStackScreen} />
          </Drawer.Navigator>
          {/*<Stack.Navigator 
              initialRouteName="Main"
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#009387",
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold'
                }
              }}
              >
            <Stack.Screen name="Main" component={MainScreen} 
              options={{
                headerTitle: () => (
                  <Text style={styles.headerName}>LOCC TOCC</Text>
                ),
                headerLeft: () => (
                  <TouchableOpacity 
                    style={{ alignItems: "flex-end", marginLeft:16 }}
                    onPress={onDrawerPress}>
                    <FontAwesome5 name="bars" size={24} color="#fff" />
                  </TouchableOpacity>
                ),
                headerRight: () => (
                  <MessagesButton /> 
                )
              }}
               />
            
            <Stack.Screen name="Feed" component={Feed} navigation={this.props.navigation}/>
            <Stack.Screen name="Search" component={Search} navigation={this.props.navigation}/>
            <Stack.Screen name="Notifications" component={NotificationsScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Profile" component={Profile} navigation={this.props.navigation}/>
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="NewPost" component={NewPostScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="EditProfile" component={EditProfileScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Messages" component={MessagesScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Chat" component={ChatScreen} navigation={this.props.navigation}/>
            
          </Stack.Navigator>*/}
          
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
    fontStyle: 'italic'

}, 
  
  
})

