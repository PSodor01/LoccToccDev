import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserFollowing, fetchUserBlocking, fetchAllUsers, fetchLikes, fetchFades, fetchNCAABGames, fetchNBAGames, fetchEPLGames, fetchNHLGames, clearData } from '../redux/actions/index'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import Research from './main/Research'
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
        this.props.fetchLikes();
        this.props.fetchFades();
        this.props.fetchAllUsers();
        this.props.fetchNBAGames();
        this.props.fetchNCAABGames();
        this.props.fetchEPLGames();
        this.props.fetchNHLGames();
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
    eplGames: store.eplGamesState.eplGames,
    nhlGames: store.nhlGamesState.nhlGames,
    nbaGames: store.nbaGamesState.nbaGames,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserFollowing, fetchAllUsers, fetchUserBlocking, fetchLikes, fetchFades, fetchNBAGames, fetchNCAABGames, fetchEPLGames, fetchNHLGames, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
