import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

import firebase from 'firebase';
import "firebase/firestore";

import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, 
    fetchUserFollowing, 
    fetchUserBlocking, 
    fetchUserNotifications,
    fetchAllUsers, 
    fetchLikes,
    fetchFades,
    fetchMLBGames, 
    fetchMMAGames,
    fetchFutureGames,
    fetchBlogDetails, 
    fetchTeamLogos, 
    fetchWNBAGames,
    fetchGolfGames, 
    fetchNFLGames, 
    fetchNCAAFGames, 
    fetchFormula1Teams, 
    fetchFormula1Races,
    fetchFormula1Drivers, 
    fetchFormula1Rankings,
    fetchContestStatus, 
    clearData } from '../redux/actions/index';

import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import BlogHomeScreen from './main/BlogHome';
import Odds from './main/Odds';
import ContestScreen from './main/Contest';

const Tab = createBottomTabNavigator();

function Main() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearData());
    dispatch(fetchUser());
    dispatch(fetchUserFollowing());
    dispatch(fetchUserBlocking());
    dispatch(fetchUserNotifications());
    dispatch(fetchLikes());
    dispatch(fetchFades());
    dispatch(fetchAllUsers());
    dispatch(fetchMLBGames());
    dispatch(fetchNFLGames());
    dispatch(fetchNCAAFGames());
    dispatch(fetchGolfGames());
    dispatch(fetchFutureGames());
    dispatch(fetchTeamLogos());
    dispatch(fetchBlogDetails());
    dispatch(fetchFormula1Teams());
    dispatch(fetchFormula1Races());
    dispatch(fetchFormula1Drivers());
    dispatch(fetchFormula1Rankings());
    dispatch(fetchWNBAGames());
    dispatch(fetchMMAGames());
    dispatch(fetchContestStatus());
  }, []);

  return (
    <Tab.Navigator 
      initialRouteName="Odds" 
      activeColor="#fff" 
      tabBarColor='#009387'
      screenOptions={{
        tabBarStyle: { backgroundColor: "#009387" },
        tabBarShowLabel: false,
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
        name="Blog Home" 
        component={BlogHomeScreen} 
        options={{
          tabBarLabel: 'Blog',
          tabBarColor: '#009387',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="open-book" color={"#FFD700"} size={30}  style={{ marginBottom: 5 }}/>
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
            navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
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