import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

import auth from '@react-native-firebase/auth';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, 
    fetchUserFollowing, 
    fetchUserBlocking, 
    fetchUserNotifications,
    fetchAllUsers, 
    fetchLikes,
    fetchFades,
    fetchEPLGames, 
    fetchMMAGames,
    fetchBlogDetails, 
    fetchTeamLogos, 
    fetchNBAGames,
    fetchNHLGames,
    fetchMLBGames,
    fetchNCAABGames,
    fetchNFLGames, 
    clearData } from '../redux/actions/index';

import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import BlogsHomeScreen from './main/BlogsHome';
import Odds from './main/Odds';
import ContestScreen from './main/Contest';

const Tab = createBottomTabNavigator();

function Main() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      dispatch(clearData());
  
      if (user) {
        // User is signed in
        dispatch(fetchUser());
        dispatch(fetchUserFollowing());
        dispatch(fetchUserBlocking());
        dispatch(fetchUserNotifications());
        dispatch(fetchLikes());
        dispatch(fetchFades());
        dispatch(fetchAllUsers());
        dispatch(fetchEPLGames());
        dispatch(fetchNFLGames());
        dispatch(fetchTeamLogos());
        dispatch(fetchBlogDetails());
        dispatch(fetchNBAGames());
        dispatch(fetchNHLGames());
        dispatch(fetchMLBGames());
        dispatch(fetchNCAABGames());
        dispatch(fetchMMAGames());
      } else {
        // User is signed out
        // ... other dispatch actions related to a signed-out user
      }
    });
  
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <Tab.Navigator 
      initialRouteName="Odds" 
      activeColor="#fff" 
      tabBarColor='#009387'
      screenOptions={{
        tabBarStyle: { backgroundColor: "#009387" },
        tabBarShowLabel: true,
        headerShown: false,
        tabBarInactiveTintColor: "#CACFD2",
        tabBarActiveTintColor: "#fff"
      }}
    >
      <Tab.Screen 
        name="Odds" 
        component={Odds}
        options={{
          tabBarLabel: 'Games',
          tabBarColor: '#009387',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="comment-dollar" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen}
        options={{
          tabBarLabel: 'Locks',
          tabBarColor: '#009387',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-lock" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen 
        name="Blogs Home" 
        component={BlogsHomeScreen} 
        options={{
          tabBarLabel: 'Blog',
          tabBarColor: '#009387',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="open-book" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen 
        name="Contest" 
        component={ContestScreen}
        options={{
          tabBarLabel: 'Leaders',
          tabBarColor: '#009387',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="trophy" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault();
            const currentUser = auth().currentUser;
            if (currentUser) {
              navigation.navigate('Profile', { uid: currentUser.uid });
            }
          }})}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#009387',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Main;