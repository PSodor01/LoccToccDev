
import 'react-native-gesture-handler';

import * as firebase from 'firebase'

import React, { Component } from 'react';

import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native'

import { FontAwesome5 } from "@expo/vector-icons";

import 'expo-dev-client';


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
import ResetPasswordScreen from './components/auth/ResetPassword'
import MainScreen from './components/Main'
import CommentScreen from './components/main/Comment'
import SocialShare from './components/main/SocialShare'
import NewPostScreen from './components/main/NewPost'
import NewCommentScreen from './components/main/NewComment'
import EditProfileScreen from './components/main/EditProfile'
import Feed from './components/main/Feed'
import Notifications from './components/main/Notifications'
import Search from './components/main/Search'
import Profile from './components/main/Profile'
import AboutUsScreen from './components/main/AboutUs'
import LegalDocsScreen from './components/main/LegalDocs'
import HouseGuidelinesScreen from './components/main/HouseGuidelines'
import ContactUsScreen from './components/main/ContactUs'
import PartnersScreen from './components/main/Partners'
import SettingsScreen from './components/main/Settings'
import FollowingScreen from './components/main/FollowingScreen'
import FollowerScreen from './components/main/FollowerScreen'
import LikesList from './components/main/LikesList'
import FadesList from './components/main/FadesList'
import Odds from './components/main/Odds'
import game from './components/main/game'
import TeamDetails from './components/main/TeamDetails'
import Standings from './components/main/Standings'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const MainStack = createStackNavigator();

if (Text.defaultProps == null) Text.defaultProps ={};
Text.defaultProps.allowFontScaling=false;

const MainStackScreen = ({navigation, props}) => (
  <MainStack.Navigator 
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#009387",
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}
      >
    <MainStack.Screen name="Main" component={MainScreen} 
      options={{
        headerTitle: () => (
          <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={styles.headerName}>locctocc </Text>
              <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
          </View>
        ),
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.openDrawer()}
            >
            <FontAwesome5 name="bars" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity 
            style={{ alignItems: "flex-end", marginRight:16 }}
            onPress={() => navigation.navigate('Onboarding')}
            >
            <FontAwesome5 name="info-circle" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        
      }}
        />

      <MainStack.Screen 
        name="Feed" 
        component={Feed}
       
          />
      <MainStack.Screen name="Search" component={Search}/>
      <MainStack.Screen name="Notifications" component={Notifications}/>
      <MainStack.Screen name="Profile" component={Profile}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'space-between'}}>
                <Text style={styles.headerName}>locctocc </Text>
                <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.goBack()}
            >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          ),
          
        }} />
      <MainStack.Screen name="Comment" component={CommentScreen} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'space-between'}}>
                <Text style={styles.headerName}>locctocc </Text>
                <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.goBack()}
            >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          ),
          
        }}
      />
      <MainStack.Screen name="SocialShare" component={SocialShare} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'space-between'}}>
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.goBack()}
            >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          ),
          
        }}
      />
      <MainStack.Screen name="NewComment" component={NewCommentScreen} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'space-between'}}>
                <Text style={styles.headerName}>locctocc </Text>
                <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.goBack()}
            >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          ),
          
        }}
      />
      <MainStack.Screen name="NewPost" component={NewPostScreen} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'space-between'}}>
                <Text style={styles.headerName}>locctocc </Text>
                <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.goBack()}
            >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          ),
          
        }}
      />
      <MainStack.Screen name="EditProfile" component={EditProfileScreen} 
        options={{
          headerTitle: "Edit Profile",
          headerTitleAlign: "center",
          headerLeft: () => (
              <TouchableOpacity 
              style={{ alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            )
          }} />
      <MainStack.Screen name="HouseGuidelines" component={HouseGuidelinesScreen}
        options={{
            headerTitle: "Community Guidelines",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity 
              style={{ alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            )
          }} />
      <MainStack.Screen name="ContactUs" component={ContactUsScreen}
        options={{
            headerTitle: "Contact Us",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity 
              style={{ alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            )
          }} />
        <MainStack.Screen name="Settings" component={SettingsScreen}
        options={{
            headerTitle: "Settings",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity 
              style={{ alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            )
          }} />
      <MainStack.Screen name="Partners" component={PartnersScreen}
        options={{
            headerTitle: "Our Partners",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity 
              style={{ alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            )
          }} />
      <MainStack.Screen name="AboutUs" component={AboutUsScreen}
        options={{
          headerTitle: "About Us",
          headerTitleAlign: "center",
          headerLeft: () => (
              <TouchableOpacity 
              style={{ alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            ),
            }} 
            />
      <MainStack.Screen name="LegalDocs" component={LegalDocsScreen}
        options={{
          headerTitle: "Privacy",
          headerTitleAlign: "center",
          headerLeft: () => (
              <TouchableOpacity 
              style={{  alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            ),
            }} 
            />
      <MainStack.Screen name="Odds" component={Odds}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'space-between', justifyContent: 'center'}}>
                <Text style={styles.headerName}>locctocc </Text>
                <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
            </View>
            
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.goBack()}
            >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          ),
          
        }}
       />
      <MainStack.Screen name="game" component={game}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'space-between'}}>
                <Text style={styles.headerName}>locctocc </Text>
                <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.goBack()}
            >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          ),
          
        }}
          />
      <MainStack.Screen name="TeamDetails" component={TeamDetails}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'space-between', justifyContent: 'center'}}>
                <Text style={styles.headerName}>locctocc </Text>
                <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.goBack()}
            >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          ),
          
        }}
          />
      <MainStack.Screen name="Standings" component={Standings}
      options={{
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'space-between', justifyContent: 'center'}}>
              <Text style={styles.headerName}>locctocc </Text>
              <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
          </View>
        ),
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity 
          style={{ alignItems: "flex-end", marginLeft:16 }}
          onPress={() => navigation.goBack()}
          >
          <FontAwesome5 name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        ),
        
      }}
        />
      <MainStack.Screen name="Following" component={FollowingScreen}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'space-between', justifyContent: 'center'}}>
                <Text style={styles.headerName}>locctocc </Text>
                <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
            </View>
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity 
            style={{ alignItems: "flex-end", marginLeft:16 }}
            onPress={() => navigation.goBack()}
            >
            <FontAwesome5 name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          ),
          
        }}
          />
        <MainStack.Screen name="Follower" component={FollowerScreen}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'space-between', justifyContent: 'center'}}>
                  <Text style={styles.headerName}>locctocc </Text>
                  <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
              </View>
            ),
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity 
              style={{ alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            ),
            
          }}
          />
        <MainStack.Screen name="LikesList" component={LikesList}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'space-between', justifyContent: 'center'}}>
                  <Text style={styles.headerName}>locctocc </Text>
                  <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
              </View>
            ),
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity 
              style={{ alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            ),
            
          }}
        />
        <MainStack.Screen name="FadesList" component={FadesList}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'space-between', justifyContent: 'center'}}>
                  <Text style={styles.headerName}>locctocc </Text>
                  <FontAwesome5 name="comment-dollar" color="#fff" size={26} />
              </View>
            ),
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity 
              style={{ alignItems: "flex-end", marginLeft:16 }}
              onPress={() => navigation.goBack()}
              >
              <FontAwesome5 name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            ),
            
          }}
        />
  </MainStack.Navigator>
)

export class App extends Component {
  constructor(props, navigation) {
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'  }}>
          <View>
          </View>
          <ActivityIndicator/>
        </View>
        
      )
    }

    if (!loggedIn) {
      return (
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Register" component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Login" component={LoginScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} 
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        
      );
    }

    /*if (!loggedIn) {
      return (
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Onboarding">
              <Stack.Screen name="Onboarding" component={OnboardingScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        
      );
    }*/

    return (
        <Provider store={store}>
          <NavigationContainer>
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="Main" component={MainStackScreen} options={{headerShown: false}} />
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
    fontStyle: 'italic'
  }, 
  loadingLogo: {
    alignSelf: 'center',
    color: "#009387",
    fontWeight: "bold",
    fontSize: 20,
    fontStyle: 'italic'
    
  }, 
  
  
})


