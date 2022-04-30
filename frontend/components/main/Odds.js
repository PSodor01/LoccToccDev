import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, TextInput, Dimensions, FlatList, TouchableOpacity } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';

import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'

import moment from 'moment'

import {AdMobBanner} from 'expo-ads-admob'
import * as Analytics from 'expo-firebase-analytics';


import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

function Odds(props) {

    const [sportGames, setSportGames] = useState([]);
    const [nhlGames, setnhlGames] = useState([]);
    const [ncaabGames, setncaabGames] = useState([]);
    const [nbaGames, setnbaGames] = useState([]);
    const [mlbGames, setmlbGames] = useState([]);
    const [eplGames, seteplGames] = useState([]);
    const [golfGames, setGolfGames] = useState([]);
    const [futureGames, setFutureGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sport, setSport] = useState('');
    const [browse, setBrowse] = useState(false);
    const [trendingGames, setTrendingGames] = useState([]);
    const [notification, setNotification] = useState('');
    const [notificationCriteria, setNotificationCriteria] = useState(false);
    const [bannerId, setBannerId] = useState('') //test id: 3940256099942544/2934735716
    
    useEffect(() => {
        setBannerId('ca-app-pub-8519029912093094/2973755922')

        Analytics.setUserId(firebase.auth().currentUser.uid);

    }, [])

    useEffect(() => {
        fetchData()
        if ( sport == 'MLB' || sport == 'NHL' || sport == 'EPL' || sport == 'Futures' || sport == 'Trending') {

        } 
        else {
            setSportGames(props.nbaGames)
            setSport('NBA')
        }

        Analytics.logEvent('screen_view', { screen_name: 'Odds', user_name: props.currentUser.name })
        
    }, [ props.nhlGames, props.nbaGames, props.mlbGames, props.eplGames, props.futureGames, props.trendingGames])

   /* useEffect(() => {

        firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            if (snapshot.exists) {
                if (snapshot.data().masters2022Score > -100000) {

                } else{
                    firebase.firestore()
                    .collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({masters2022Score: 150}, { merge:true });
                }
            }
        })
    }, []) */

    
    const fetchData = () => {

        function trendingFunction(nbaGames, mlbGames, nhlGames) {
            let trendingGames = nbaGames.concat(mlbGames, nhlGames)
            setTrendingGames(trendingGames)
        }

        for (let i = 0; i < props.nbaGames.length; i++) {

            firebase.firestore()
            .collection("votes")
            .doc(props.nbaGames[i].gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let gameMiscData = snapshot.data();
                    props.nbaGames[i].gamePostsCount = gameMiscData.gamePostsCount
                }
                else {
                    props.nbaGames[i].gamePostsCount = 0
                }
            })
        }
        setnbaGames(props.nbaGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))

        for (let i = 0; i < props.nhlGames.length; i++) {

            firebase.firestore()
            .collection("votes")
            .doc(props.nhlGames[i].gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let gameMiscData = snapshot.data();
                    props.nhlGames[i].gamePostsCount = gameMiscData.gamePostsCount
                }
                else {
                    props.nhlGames[i].gamePostsCount = 0
                }
            })
        }
        setnhlGames(props.nhlGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))

        for (let i = 0; i < props.mlbGames.length; i++) {

            firebase.firestore()
            .collection("votes")
            .doc(props.mlbGames[i].gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let gameMiscData = snapshot.data();
                    props.mlbGames[i].gamePostsCount = gameMiscData.gamePostsCount
                }
                else {
                    props.mlbGames[i].gamePostsCount = 0
                }
            })
        }
        setmlbGames(props.mlbGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))

        for (let i = 0; i < props.eplGames.length; i++) {

            firebase.firestore()
            .collection("votes")
            .doc(props.eplGames[i].gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let gameMiscData = snapshot.data();
                    props.eplGames[i].gamePostsCount = gameMiscData.gamePostsCount
                }
                else {
                    props.eplGames[i].gamePostsCount = 0
                }
            })
        }
        seteplGames(props.eplGames)
        setFutureGames(props.futureGames)

        trendingFunction(nbaGames, mlbGames, nhlGames)
        setLoading(false)

    }

    useEffect(() =>{
        (() => registerForPushNotificationsAsync())()
    }, []);


    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            //alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
          alert('Must use physical device for Push Notifications');
        }

        if (token) {
            const res = await firebase.firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({token}, { merge:true });
        }
        
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }

      

    const sendNotification = async (token) => {
        const message = {
            to: token,
            sound: 'default',
            title: 'locctocc',
            body: notification ? notification : 'Empty Notification',
        };
        
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        
    }

    const sendNotificationToAllUsers = async () => {
        const users = await firebase.firestore().collection("users").get();
        users.docs.map((user) => sendNotification(user.data().token))

        Analytics.logEvent('sendNotificationToAllUsers', {user_name: props.currentUser.name})

    };


    const searchNFLFilter = (text) => {
        if (text) {
            const newData = sportGames.filter((item) => {
                const awayData = item.awayTeam ? item.awayTeam.toUpperCase() : ''.toUpperCase();
                const homeData = item.homeTeam ? item.homeTeam.toUpperCase() : ''.toUpperCase();

                const textData = text.toUpperCase();
                return (awayData.indexOf(textData) > -1 ||
                homeData.indexOf(textData) > -1)
                
            });
            setSportGames(newData)
            setSearch(text)

        } else {
            if (sport == 'NBA') {setSportGames(props.nbaGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))} 
            if (sport == 'NHL') {setSportGames(props.nhlGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))} 
            if (sport == 'MLB') {setSportGames(props.mlbGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))}
            if (sport == 'EPL') {setSportGames(props.eplGames)}
            if (sport == 'Masters') {setSportGames(props.golfGames)}
            if (sport == 'Futures') {setSportGames(props.futureGames)}
            if(sport == 'Trending') {setSportGames(trendingGames)}
            setSearch(text)
        }
        
    }

    const browseFunction = () => {
        if (browse == true) {
            setBrowse(false)
        } else {
            setBrowse(true)
            Analytics.logEvent('searchGames', {user_name: props.currentUser.name
            });
        }
    }

    const displayNotificationInput = () => {
        if (notificationCriteria == true) {
            setNotificationCriteria(false)
        } else {
            setNotificationCriteria(true)
        }
    }
    
    const setSportFunction = (sport) => {
        if (sport == 'Trending') {setSportGames(trendingGames); Analytics.logEvent('selectTrendingGames', {}); setSport('Trending'); setBannerId('ca-app-pub-8519029912093094/4907013689')} // Real ID: 8519029912093094/4907013689, test ID: 3940256099942544/2934735716
        if (sport == 'NFL') {setSportGames(props.nflGames); Analytics.logEvent('selectNFLGames', {}); setSport('NFL'); setBannerId('ca-app-pub-8519029912093094/7298151920')} // Real ID: 8519029912093094/7298151920, test ID: 3940256099942544/2934735716
        if (sport == 'NBA') {setSportGames(props.nbaGames); Analytics.logEvent('selectNBAGames', {}); setSport('NBA'); setBannerId('ca-app-pub-8519029912093094/2973755922')} // Real ID: 8519029912093094/2973755922, test ID: 3940256099942544/2934735716
        if (sport == 'NHL') {setSportGames(props.nhlGames); Analytics.logEvent('selectNHLGames', {}); setSport('NHL'); setBannerId('ca-app-pub-8519029912093094/4095265900')} // Real ID: 8519029912093094/4095265900, test ID: 3940256099942544/2934735716
        if (sport == 'NCAAB') {setSportGames(props.ncaabGames); Analytics.logEvent('selectNCAABGames', {}); setSport('NCAAB'); setBannerId('ca-app-pub-8519029912093094/8772877514')} // Real ID: 8519029912093094/8772877514, test ID: 3940256099942544/2934735716
        if (sport == 'EPL') {setSportGames(props.eplGames); Analytics.logEvent('selectEPLGames', {}); setSport('EPL'); setBannerId('ca-app-pub-8519029912093094/8198162447')}
        if (sport == 'MLB') {setSportGames(props.mlbGames); Analytics.logEvent('selectMLBGames', {}); setSport('MLB'); setBannerId('ca-app-pub-8519029912093094/2973755922')}
        if (sport == 'Masters') {setSportGames(props.golfGames); Analytics.logEvent('selectMastersGames', {}); setSport('Masters'); setBannerId('ca-app-pub-8519029912093094/8198162447')}
        if (sport == 'Futures') {setSportGames(props.futureGames); Analytics.logEvent('selectFuturesGames', {}); setSport('Futures'); setBannerId('ca-app-pub-8519029912093094/8198162447')}
    }

    const nbaIcon = (<Icon name="basketball-outline" color="#ee6730" size={16}/>);
    const mlbIcon = (<Icon name="baseball-outline" color="red" size={16}/>);
    const nflIcon = (<Icon name="american-football" color="#825736" size={16}/>);
    const nhlIcon = (<MaterialCommunityIcons name="hockey-sticks" color="#B87333" size={16}/>);
    const ncaabIcon = (<MaterialCommunityIcons name="basketball-hoop-outline" color="#800000" size={16}/>);
    const eplIcon = (<MaterialCommunityIcons name="soccer" color="black" size={16}/>);
    const golfIcon = (<MaterialCommunityIcons name="golf" color="green" size={16}/>);
    const futureIcon = (<MaterialCommunityIcons name="alien" color="#6CC417" size={16}/>);
    const trendingIcon = (<MaterialCommunityIcons name="trending-up" color="#009387" size={16}/>);
    const propsIcon = (<MaterialCommunityIcons name= "trophy" color="#ffd700" size={16}/>)

    const sportsList = [
        {
            sport: 'Trending',
            id: '1',
            icon: trendingIcon
        },
        {
            sport: 'NBA',
            id: '2',
            icon: nbaIcon
        },
        {
            sport: 'MLB',
            id: '3',
            icon: mlbIcon
        },
        {
            sport: 'NHL',
            id: '4',
            icon: nhlIcon
        },
        {
            sport: 'EPL',
            id: '5',
            icon: eplIcon
        },
        {
            sport: 'Futures',
            id: '6',
            icon: futureIcon
        },
      ];

      const futureList = [
        {
            futureSport: 'NFL - Suberbowl Champion',
            id: '1',
            icon: nflIcon,
            gameId: 'eb5274457814f2cc586fc6f7bb4f5640'
        },
        {
            futureSport: 'MLB - World Series Winner',
            id: '2',
            icon: mlbIcon,
            gameId: '70eaa9b364fa80ebaff9bbbb3fcf4c4e'
        },
        {
            futureSport: 'NBA - Championship',
            id: '3',
            icon: nbaIcon,
            gameId: 'c1714d7099c2785edcfd113d54c69042'
        },
        {
            futureSport: 'NHL - Stanley Cup Winner',
            id: '4',
            icon: nhlIcon,
            gameId: 'df4021a0bcf22ecd2a32feb1ba0e0206'
        },
        
      ];

    const testID = 'ca-app-pub-3940256099942544/2934735716';
    // Is a real device and running in production.
    const adUnitID = Constants.isDevice && !__DEV__ ? bannerId : testID;

    /*const theRandomNumber = Math.floor(Math.random() * 3) + 1
        if (theRandomNumber == 4) {
            interstitial()
            console.log(theRandomNumber)
        } else {
            null
        } */

    const renderSportsListItem = ({ item }) => (
        <View>
        {sport == item.sport ?
            <View style={styles.sportContainerHighlight}>
                <TouchableOpacity
                    style={styles.sportButton}
                    onPress={() => {setSportFunction(item.sport)}}>
                    <Text>{item.sport}</Text>
                    <Text> {item.icon}</Text>
                </TouchableOpacity>
            </View>
        :
            <View style={styles.sportContainer}>
                <TouchableOpacity
                    style={styles.sportButton}
                    onPress={() => {setSportFunction(item.sport)}}>
                    <Text>{item.sport}</Text>
                    <Text> {item.icon}</Text>
                </TouchableOpacity>
            </View>
        }
            
        </View>
        
        
    );

    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.gameContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, gameDate: item.gameDate, homeTeam: item.homeTeam, awayTeam: item.awayTeam, homeSpread: item.homeSpread, awaySpread: item.awaySpread, homeSpreadOdds: item.homeSpreadOdds, awaySpreadOdds: item.awaySpreadOdds, awayMoneyline: item.awayMoneyline, homeMoneyline: item.homeMoneyline, over: item.over, overOdds: item.overOdds, under: item.under, underOdds: item.underOdds, sport: item.sport, homeScore: item.homeScore, awayScore: item.awayScore })}>
                        <View>
                            {item.gamePostsCount > 4 ?
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                    </View>
                                </View>
                                
                            : 
                            item.gamePostsCount > 2 ?
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"orange"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"orange"}/>
                                    </View>
                                </View>
                            : 
                            item.gamePostsCount > 0 ? 
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#fed550"}/>
                                    </View>
                                </View>
                            :
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                </View>
                                }
                            <View style={styles.awayGameInfoContainer}>
                                <View style={styles.teamItem}>
                                    <View style={styles.teamNameItem}>
                                        <Text style={styles.teamText}>{item.awayTeam}</Text>
                                    </View>
                                    {item.awayScore || item.homeScore ? <Text style={styles.scoreText}>{item.awayScore}</Text> : null}
                                </View>
                                <View style={styles.moneylineItem}>
                                    {item.awayMoneyline > 0 ? 
                                        <Text style={styles.spreadText}>+{item.awayMoneyline}</Text> 
                                        : <Text style={styles.spreadText}>{item.awayMoneyline}</Text>
                                    }
                                </View> 
                                <View style={styles.spreadItem}>
                                    {item.awaySpread > 0 ? 
                                        <Text style={styles.spreadText}>+{item.awaySpread}</Text> 
                                        : <Text style={styles.spreadText}>{item.awaySpread}</Text>
                                    }
                                    {item.awaySpreadOdds > 0 ? 
                                        <Text style={styles.oddsTopRowText}>+{item.awaySpreadOdds}</Text> 
                                        : <Text style={styles.oddsTopRowText}>{item.awaySpreadOdds}</Text>
                                    }
                                </View>
                                <View style={styles.totalItem}>
                                    <Text style={styles.spreadText}>O {item.over}</Text>
                                    {item.overOdds > 0 ? 
                                        <Text style={styles.oddsTopRowText}>+{item.overOdds}</Text> 
                                        : <Text style={styles.oddsTopRowText}>{item.overOdds}</Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.homeGameInfoContainer}>
                                <View style={styles.teamItem}>
                                    <View style={styles.teamNameItem}>
                                        <Text style={styles.teamText}>{item.homeTeam}</Text>
                                    </View>
                                    {item.awayScore || item.homeScore ? <Text style={styles.scoreText}>{item.homeScore}</Text> : null}
                                </View>
                                <View style={styles.moneylineItem}>
                                    {item.homeMoneyline > 0 ? 
                                        <Text style={styles.spreadText}>+{item.homeMoneyline}</Text> 
                                        : <Text style={styles.spreadText}>{item.homeMoneyline}</Text>
                                    }
                                </View>
                                <View style={styles.spreadItem}>
                                    {item.homeSpread > 0 ? 
                                        <Text style={styles.spreadText}>+{item.homeSpread}</Text> 
                                        : <Text style={styles.spreadText}>{item.homeSpread}</Text>
                                    }
                                    {item.homeSpreadOdds > 0 ?
                                        <Text style={styles.oddsBottomRowText}>+{item.homeSpreadOdds}</Text>
                                        : <Text style={styles.oddsBottomRowText}>{item.homeSpreadOdds}</Text>
                                    }
                                    
                                </View>
                                <View style={styles.totalItem}>
                                    <Text style={styles.spreadText}>U {item.under}</Text> 
                                    {item.underOdds > 0 ?
                                        <Text style={styles.oddsBottomRowText}>+{item.underOdds}</Text>
                                        : <Text style={styles.oddsBottomRowText}>{item.underOdds}</Text>
                                    }
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderEPLItem = ({ item }) => {
        return (
            <View>
                <View style={styles.eplGameContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, gameDate: item.gameDate, homeTeam: item.homeTeam, awayTeam: item.awayTeam, awayMoneyline: item.awayMoneyline, homeMoneyline: item.homeMoneyline, drawMoneyline: item.drawMoneyline, sport: item.sport, homeScore: item.homeScore, awayScore: item.awayScore })}>
                        <View>
                            {item.gamePostsCount > 4 ?
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                    </View>
                                </View>
                                
                            : 
                            item.gamePostsCount > 2 ?
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"orange"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"orange"}/>
                                    </View>
                                </View>
                            : 
                            item.gamePostsCount > 0 ? 
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#fed550"}/>
                                    </View>
                                </View>
                            :
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                </View>
                                }
                            <View style={styles.eplAwayGameInfoContainer}>
                                <View style={styles.teamItem}>
                                    <Text style={styles.teamText}>{item.awayTeam}</Text>
                                    {item.awayScore || item.homeScore ? <Text style={styles.scoreText}>{item.awayScore}</Text> : null}
                                </View>
                                <View style={styles.moneylineItem}>
                                    {item.awayMoneyline > 0 ? 
                                        <Text style={styles.spreadText}>+{item.awayMoneyline}</Text> 
                                        : <Text style={styles.spreadText}>{item.awayMoneyline}</Text>
                                    }
                                </View> 
                            </View>
                            <View style={styles.eplAwayGameInfoContainer}>
                                <View style={styles.teamItem}>
                                    <Text style={styles.teamText}>{item.homeTeam}</Text>
                                    {item.awayScore || item.homeScore ? <Text style={styles.scoreText}>{item.homeScore}</Text> : null}
                                </View>
                                <View style={styles.moneylineItem}>
                                    {item.homeMoneyline > 0 ? 
                                        <Text style={styles.spreadText}>+{item.homeMoneyline}</Text> 
                                        : <Text style={styles.spreadText}>{item.homeMoneyline}</Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.eplHomeGameInfoContainer}>
                                <View style={styles.teamItem}>
                                    <Text style={styles.teamText}>Draw</Text>
                                </View>
                                <View style={styles.moneylineItem}>
                                    {item.drawMoneyline > 0 ? 
                                        <Text style={styles.spreadText}>+{item.drawMoneyline}</Text> 
                                        : <Text style={styles.spreadText}>{item.drawMoneyline}</Text>
                                    }
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderListItem = ({ item }) => {
        return (
            <View>
                <View style={styles.listGameContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, sport: item.sport })}>
                        <View style={styles.listOddsContainer}>
                            <View style={styles.listPlayerContainer}>
                                <Text style={styles.listPlayerText}>{item.playerName}</Text>
                            </View>
                            <View>
                                {item.playerOdds > 0 ?
                                <Text>+{item.playerOdds}</Text> : <Text>{item.playerOdds}</Text>
                                } 
                            </View>
                            
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderFutureItem = ({ item }) => {
        return (
            <View>
                <View style={styles.listGameContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, sport: item.futureSport })}>
                        <View style={styles.listOddsContainer}>
                            <View style={styles.listPlayerContainer}>
                                <Text style={styles.listPlayerText}>{item.futureSport}  {item.icon}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {firebase.auth().currentUser.uid == 'U6u9pFuuwLVEn97z76a07WHK1V63' ?
            notificationCriteria == true ?
            <View style={styles.notificationContainer}>
                <TextInput
                    style={styles.notificationInput}
                    onChangeText={(text) => setNotification(text)}
                    placeholder="Message"
                    clearButtonMode={'always'}
                />
                
                <TouchableOpacity
                    onPress={() => {sendNotificationToAllUsers()}}
                    style={styles.sendButton}>
                        <Text style={styles.notificationText}>SEND</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {displayNotificationInput()}}
                    style={styles.notificationButton}>
                        <Text style={styles.notificationText}>NOTIFICATION</Text>
                </TouchableOpacity>
            </View>
            :
                <TouchableOpacity
                    onPress={() => {displayNotificationInput()}}
                    style={styles.notificationButton}>
                        <Text style={styles.notificationText}>NOTIFICATION</Text>
                </TouchableOpacity>
            :
            null}
            <View style={styles.sportListContainer}>
                <TouchableOpacity
                    onPress={() => {browseFunction()}}
                    style={styles.showAllButton}>
                    <FontAwesome5 name={"search-dollar"} size={20} color={"#009387"}/>
                </TouchableOpacity>
                <FlatList
                    data={sportsList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderSportsListItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
                
            </View>
            {browse == true ? 
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Find your lock..."
                    clearButtonMode={'while-editing'}
                    autoCorrect={false}
                    value={search}
                    onChangeText={(text) => searchNFLFilter(text)}
                />
            </View>
                
            : null}

            {sportGames == futureGames  ?
            <View style={styles.gameHeaderContainer}>
                    <Text style={styles.gameHeaderText}>Team Futures - Champion</Text>
            </View>
            :
            sportGames == golfGames  ?
            <View style={styles.gameHeaderContainer}>
                    <Text style={styles.gameHeaderText}>US Masters Tournament Lines - Winner</Text>
            </View>
            :
            
            <View style={styles.gameHeaderContainer}>
                <View style={styles.teamHeader}>
                    <Text style={styles.gameHeaderText}>Team</Text>
                </View>
                <View style={styles.moneylineHeader}>
                    <Text style={styles.gameHeaderText}>ML</Text>
                </View>
                <View style={styles.spreadHeader}>
                    <Text style={styles.gameHeaderText}>Spread</Text>
                </View>
                <View style={styles.totalHeader}>
                    <Text style={styles.gameHeaderText}>Total</Text>
                </View>
            </View>
            }  
            
            {
            sportGames == trendingGames ?
            <FlatList 
            data = {sportGames.sort((a, b) => parseFloat(b.gamePostsCount) - parseFloat(a.gamePostsCount)).slice(0, 10)}
            style={styles.feed}
            renderItem={renderItem}
    
            />
            :
            
            sportGames == props.eplGames ?
            <FlatList 
                data = {sportGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate))}
                style={styles.feed}
                renderItem={renderEPLItem}
    
            />
            :

            sportGames == props.golfGames  ?
            <FlatList 
                data = {sportGames.sort((a, b) => parseFloat(a.playerOdds) - parseFloat(b.playerOdds))}
                style={styles.feed}
                renderItem={renderListItem}
    
            />
            :

            sportGames == props.futureGames  ?
            <FlatList 
                data = {futureList}
                style={styles.feed}
                renderItem={renderFutureItem}
    
            />
            :

            <FlatList 
                data = {sportGames}
                style={styles.feed}
                renderItem={renderItem}
    
            />
            }
            <View style={styles.adView}>
                <AdMobBanner
                    bannerSize="banner"
                    adUnitID={adUnitID} 
                    servePersonalizedAds // true or false
                />
            </View>
            
         
        </View>
        
        
    );
    
}

const styles = StyleSheet.create({
    
    feed: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 6,
        backgroundColor: "#ffffff",
    },
    sportListContainer: {
        alignItems: 'center',
        paddingBottom: "2%",
        flexDirection: 'row',
    },
    gameContainer: {
        padding: 6,
        marginVertical:4,
        marginRight: 2,
        marginLeft: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: .8,
        borderTopColor: "#ccc",
        backgroundColor: "#ffffff",
    },
    eplGameContainer: {
        padding: 6,
        marginVertical:4,
        marginRight: 2,
        marginLeft: 2,
        justifyContent: 'center',
        borderTopWidth: .8,
        borderTopColor: "#ccc",
        backgroundColor: "#ffffff",

    },
    listGameContainer: {
        padding: 12,
        marginRight: 2,
        marginLeft: 2,
        borderTopWidth: .8,
        borderTopColor: "#ccc",
        backgroundColor: "#ffffff",
    },
    listOddsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listPlayerText: {
    },
    awayGameInfoContainer: { 
        flexDirection: 'row',
    },
    eplAwayGameInfoContainer: { 
        flexDirection: 'row',
        borderBottomColor: "#e1e2e6",
        borderBottomWidth: 1,
        paddingVertical: 6,
    },
    homeGameInfoContainer: { 
        flexDirection: 'row',
    },
    eplHomeGameInfoContainer: { 
        flexDirection: 'row',
        paddingVertical: 6,
    },
    gameHeaderText: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
    spreadText: {
        textAlign: 'right',
    },
    oddsTopRowText: {
        textAlign: 'right',
        color: 'grey',
        paddingBottom: 5,
        fontSize: 12,
    },
    oddsBottomRowText: {
        textAlign: 'right',
        color: 'grey',
        fontSize: 12,
    },
    teamItem: {
        width: "55%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 2,
    },
    teamNameItem: {
        width: "90%",
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 2,
    },
    scoreText: {
        color: '#0033cc',
        fontWeight: 'bold',
        fontSize: 12,
    },
    spreadItem: {
        width: "15%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    moneylineItem: {
        width: "15%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    totalItem: {
        width: "15%",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 2,
    },
    gameHeaderContainer: {
        flexDirection: 'row',
        marginLeft: '2%',
        paddingBottom: 2,
    },
    teamHeader: {
        width: "50%",
    },
    spreadHeader: {
        width: "15%",
        alignItems: 'center',
    },
    moneylineHeader: {
        width: "15%",
        alignItems: 'center',
    },
    totalHeader: {
        width: "15%",
        alignItems: 'center',
    },
    textInput: {
        height: 30,
        width: Dimensions.get('window').width * .80,
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        borderWidth: .5,
        borderColor: "#CACFD2"
    },
    textInputContainer: {
        padding: 10,
        
    },
    sportContainer: {
        flexDirection: 'row',
        backgroundColor: "#ffffff",
        borderRadius: 20,
        borderColor: "#ccc",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: .5,
        justifyContent: 'center',
        marginHorizontal: 2,
        alignItems: 'center'
    },
    sportContainerHighlight: {
        flexDirection: 'row',
        backgroundColor: "#ffffff",
        borderRadius: 20,
        borderColor: "black",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: .5,
        justifyContent: 'center',
        marginHorizontal: 2,
        alignItems: 'center'
    },
    sportButton: {
        flexDirection: 'row'
    },
    showAllButton: {
        marginHorizontal: "2%",
    },
    searchContainer: {
        alignItems: 'center',
        paddingBottom: 5,
    },
    adView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    gameDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 5
    },
    dateText: {
        color: 'grey',
        fontSize: 12,
    },
    teamText: {
    },
    pepperContainer: {
        flexDirection: 'row',
    },
    sendButton: {
        backgroundColor: "#0033cc",
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 6,
        width: "20%",
        alignSelf: "center",
        marginBottom: "1%",
        marginTop: "1%",
    },
    notificationButton: {
        backgroundColor: "red",
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 6,
        width: "40%",
        alignSelf: "center",
        marginBottom: "1%",
        marginTop: "0%",
    },
    notificationText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        alignSelf: "center",
    },
    notificationInput: {
        height: 30,
        width: "75%",
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        borderWidth: .5,
        borderColor: "#CACFD2",
        alignSelf: "center",

    },
    notificationContainer: {
        paddingBottom: 5

    },
    StatusWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    
    
    
    
})

const mapStateToProps = (store) => ({
    ncaafGames: store.ncaafGamesState.ncaafGames,
    mlbGames: store.mlbGamesState.mlbGames,
    ncaabGames: store.ncaabGamesState.ncaabGames,
    nhlGames: store.nhlGamesState.nhlGames,
    eplGames: store.eplGamesState.eplGames,
    golfGames: store.golfGamesState.golfGames,
    futureGames: store.futureGamesState.futureGames,
    nbaGames: store.nbaGamesState.nbaGames,
    allUsers: store.userState.allUsers,
    currentUser: store.userState.currentUser,


})

export default connect(mapStateToProps)(Odds);



