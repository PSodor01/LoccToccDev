import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserFollowing, fetchUserBlocking, fetchUserNotifications, fetchAllUsers, fetchLikes, fetchFades, fetchMLBGames, fetchMMAGames, fetchFutureGames, fetchFormula1Teams, fetchFormula1Races, fetchFormula1Drivers, fetchFormula1Rankings, fetchNFLGames,  fetchNHLGames, fetchNBAGames, fetchNCAAFGames, fetchNCAABGames, fetchEPLGames, fetchContestStatus, clearData } from '../redux/actions/index'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import ContestScreen from './main/Contest'
import Merch from './main/Merch'
import Notifications from './main/Notifications'
import SearchScreen from './main/Search'
import Odds from './main/Odds'

const Stack = createStackNavigator();

const MessageStack = ({navigation}) => (
    <Stack.Navigator>
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route}) => ({
          title: route.params.userName,
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );


const Tab = createMaterialBottomTabNavigator();

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
        this.props.fetchFutureGames();
        this.props.fetchFormula1Teams();
        this.props.fetchFormula1Races();
        this.props.fetchFormula1Drivers();
        this.props.fetchFormula1Rankings();
        this.props.fetchNFLGames();
        this.props.fetchNHLGames();
        this.props.fetchNBAGames();
        this.props.fetchEPLGames();
        this.props.fetchNCAAFGames();
        this.props.fetchNCAABGames();
        this.props.fetchMMAGames();
        this.props.fetchContestStatus();
    }

    render() {
        return (
            <Tab.Navigator initialRouteName="Odds" activeColor="#fff" tabBarColor='#009387'>
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
                    name="Notifications" 
                    component={Notifications} 
                    navigation={this.props.navigation}
                    options={{
                        tabBarLabel: 'Notifications',
                        tabBarColor: '#009387',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="heart-outline" color={color} size={26} />
                        ),
                    }} /> 

                
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
    nflGames: store.nflGamesState.nflGames,
    nbaGames: store.nbaGamesState.nbaGames,
    eplGames: store.eplGamesState.eplGames,
    nhlGames: store.nhlGamesState.nhlGames,
    ncaafGames: store.ncaafGamesState.ncaafGames,
    mmaGames: store.mmaGamesState.mmaGames,
    mlbGames: store.mlbGamesState.mlbGames,
    futureGames: store.futureGamesState.futureGames,
    formula1Teams: store.formula1TeamsState.formula1Teams,
    formula1Races: store.formula1RacesState.formula1Races,
    formula1Drivers: store.formula1DriversState.formula1Drivers,
    formula1Rankings: store.formula1RankingsState.formula1Rankings,

})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserFollowing, fetchUserNotifications, fetchAllUsers, fetchUserBlocking, fetchLikes, fetchFades, fetchMLBGames, fetchMMAGames, fetchFutureGames, fetchFormula1Teams, fetchFormula1Races, fetchFormula1Drivers, fetchFormula1Rankings, fetchNFLGames, fetchNBAGames, fetchNHLGames, fetchNCAABGames, fetchEPLGames, fetchNCAAFGames, fetchContestStatus, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
