import 'react-native-gesture-handler'
import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import firebase from 'firebase'
import "firebase/firestore";

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserFollowing, fetchUserBlocking, fetchUserNotifications, fetchAllUsers, fetchLikes, fetchFades, fetchMLBGames, fetchMMAGames, fetchFutureGames,  fetchNHLGames, fetchNBAGames, fetchNCAABGames, fetchEPLGames, fetchFormula1Teams, fetchFormula1Races, fetchFormula1Drivers, fetchFormula1Rankings, fetchContestStatus, clearData } from '../redux/actions/index'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import NotificationsScreen from './main/Notifications'
import SearchScreen from './main/Search'
import Odds from './main/Odds'
import ContestScreen from './main/Contest'


const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

const getTabBarVisibility = (route) => {
    const routeName = route.mapStateToProps
    ? route.state.routes[route.state.index].name
    : '';
    if(routeName === 'Chat') {
        return false;
    }
    return true;
};


export class Main extends Component {
    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserFollowing();
        this.props.fetchUserBlocking();
        this.props.fetchUserNotifications();
        this.props.fetchLikes();
        this.props.fetchFades();
        this.props.fetchAllUsers();
        this.props.fetchMLBGames();
        this.props.fetchEPLGames();
        this.props.fetchFutureGames();
        this.props.fetchFormula1Teams();
        this.props.fetchFormula1Races();
        this.props.fetchFormula1Drivers();
        this.props.fetchFormula1Rankings();
        this.props.fetchNHLGames();
        this.props.fetchNBAGames();
        this.props.fetchNCAABGames();
        this.props.fetchMMAGames();
        this.props.fetchContestStatus();

    }

    render() {
        return (
            <Tab.Navigator 
                initialRouteName="Odds" 
                activeColor="#fff" 
                tabBarColor='#009387'
                screenOptions={{
                    tabBarStyle: { backgroundColor: "#009387" },
                    tabBarShowLabel:false,
                    headerShown:false,
                    tabBarInactiveTintColor:"#CACFD2",
                    tabBarActiveTintColor:"#fff"



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
                    }} />
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
                    name="Contest" 
                    component={ContestScreen}
                    options={{
                        tabBarLabel: 'Leaders',
                        tabBarColor: '#009387',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="trophy" color={"#FFD700"} size={20} />
                        ),
                    }}
                    />
                <Tab.Screen 
                    name="Notifications" 
                    component={NotificationsScreen}
                    options={{
                        tabBarLabel: 'Notifications',
                        tabBarColor: '#009387',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="heart" color={color} size={20} />
                        ),
                    }}
                    />
                
                <Tab.Screen 
                    name="Search" 
                    component={SearchScreen} 
                    navigation={this.props.navigation}
                    options={{
                        tabBarLabel: 'Explore',
                        tabBarColor: '#009387',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={26} />
                        ),
                    }} />
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
                    }} />
                
                    
                
            </Tab.Navigator>
            
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    ncaabGames: store.ncaabGamesState.ncaabGames,
    nbaGames: store.nbaGamesState.nbaGames,
    nhlGames: store.nhlGamesState.nhlGames,
    mmaGames: store.mmaGamesState.mmaGames,
    mlbGames: store.mlbGamesState.mlbGames,
    eplGames: store.eplGamesState.eplGames,
    futureGames: store.futureGamesState.futureGames,
    formula1Teams: store.formula1TeamsState.formula1Teams,
    formula1Races: store.formula1RacesState.formula1Races,
    formula1Drivers: store.formula1DriversState.formula1Drivers,
    formula1Rankings: store.formula1RankingsState.formula1Rankings,
   

})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserFollowing, fetchUserNotifications, fetchAllUsers, fetchUserBlocking, fetchLikes, fetchFades, fetchMLBGames, fetchMMAGames, fetchFutureGames, fetchNBAGames, fetchNHLGames, fetchNCAABGames, fetchEPLGames, fetchFormula1Teams, fetchFormula1Races, fetchFormula1Drivers, fetchFormula1Rankings,  fetchContestStatus, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);