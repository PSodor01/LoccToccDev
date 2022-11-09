import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Linking, Image, TextInput, Dimensions, FlatList, TouchableOpacity, ScrollView } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Foundation from 'react-native-vector-icons/Foundation'
import Icon from 'react-native-vector-icons/Ionicons';

import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import * as Device from 'expo-device';
import * as Updates from 'expo-updates';

import moment from 'moment'

import * as Analytics from 'expo-firebase-analytics';
import * as StoreReview from 'expo-store-review';

import AsyncStorage from '@react-native-async-storage/async-storage';


import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

function Odds(props) {

    const [sportGames, setSportGames] = useState([]);
    const [nflGames, setnflGames] = useState([]);
    const [mmaGames, setmmaGames] = useState([]);
    const [ncaafGames, setncaafGames] = useState([]);
    const [ncaabGames, setncaabGames] = useState([]);
    const [nbaGames, setnbaGames] = useState([]);
    const [nhlGames, setnhlGames] = useState([]);
    const [mlbGames, setmlbGames] = useState([]);
    const [eplGames, seteplGames] = useState([]);
    const [golfGames, setGolfGames] = useState([]);
    const [fantasyGames, setFantasyGames] = useState([]);
    const [futureGames, setFutureGames] = useState([]);
    const [formula1Teams, setFormula1Teams] = useState([]);
    const [formula1Races, setFormula1Races] = useState([]);
    const [formula1Drivers, setFormula1Drivers] = useState([]);
    const [formula1Rankings, setFormula1Rankings] = useState([]);
    const [formula1RaceLive, setFormula1RaceLive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sport, setSport] = useState('');
    const [browse, setBrowse] = useState(false);
    const [trendingGames, setTrendingGames] = useState([]);
    const [notification, setNotification] = useState('');
    const [notificationCriteria, setNotificationCriteria] = useState(false);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    const [adMobLive, setAdMobLive] = useState();
    
    useEffect(() => {

        Analytics.setUserId(firebase.auth().currentUser.uid);
        Analytics.logEvent('screen_view', { screen_name: 'Odds', user_name: props.currentUser.name });

        resetBadgeCount()
        
    }, [])

    useEffect(() => {

        if (props.contestStatus.adMobLive == true) {
            setAdMobLive(true)
        } else {
            setAdMobLive(false)
        }

    }, [props.contestStatus])

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
            if(value == null ) {
                AsyncStorage.setItem('alreadyLaunched', 'true');    
                setIsFirstLaunch(true)
                Analytics.logEvent('firstLaunch', {user_name: props.currentUser.name});

            } else {
                setIsFirstLaunch(false);
                if (StoreReview.hasAction()) {
                        StoreReview.requestReview();
                  }
            }
        });

    }, []);
    
    

    useEffect(() => {
        fetchData()
        if ( sport == 'NCAAB' || sport == 'NBA' || sport == 'NHL' || sport == 'NCAAF' || sport == 'FIFA' || sport == 'UFC' || sport == 'PGA' || sport == 'Futures' || sport == 'Formula 1' ||sport == 'Trending') {

        } 
        else {
            setSportGames(props.nflGames)
            setSport('NFL')
        }

    }, [ props.nflGames, props.ncaafGames, props.eplGames, props.ncaabGames, props.nbaGames, props.nhlGames, props.mmaGames, props.futureGames, props.formula1Teams, props.formula1Races, props.formula1Drivers, props.formula1Rankings ])

   useEffect(() => {

      /*  firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            if (snapshot.exists) {
                if (snapshot.data().nbanhl2022Score > -100000) {

                } else{
                    firebase.firestore()
                    .collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({nbanhl2022Score: 150}, { merge:true });
                }
            }
        })*/

        firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            if (snapshot.exists) {
                firebase.firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({lastLogin: firebase.firestore.Timestamp.fromDate(new Date()),}, 
                    { merge:true });
            }
        })


    }, [])

    const fetchData = () => {

        function trendingFunction(nflGames, ncaabGames, ncaafGames, nbaGames, nhlGames) {
            let trendingGames = nflGames.concat(ncaafGames, ncaabGames, nbaGames, nhlGames)
            setTrendingGames(trendingGames)
        }

        for (let i = 0; i < props.ncaabGames.length; i++) {

            firebase.firestore()
            .collection("votes")
            .doc(props.ncaabGames[i].gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let gameMiscData = snapshot.data();
                    props.ncaabGames[i].gamePostsCount = gameMiscData.gamePostsCount
                }
                else {
                    props.ncaabGames[i].gamePostsCount = 0
                }
            })
        }
        setncaabGames(props.ncaabGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))

        for (let i = 0; i < props.nflGames.length; i++) {

            firebase.firestore()
            .collection("votes")
            .doc(props.nflGames[i].gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let gameMiscData = snapshot.data();
                    props.nflGames[i].gamePostsCount = gameMiscData.gamePostsCount
                }
                else {
                    props.nflGames[i].gamePostsCount = 0
                }
            })
        }
        setnflGames(props.nflGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))

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

        for (let i = 0; i < props.ncaafGames.length; i++) {

            firebase.firestore()
            .collection("votes")
            .doc(props.ncaafGames[i].gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let gameMiscData = snapshot.data();
                    props.ncaafGames[i].gamePostsCount = gameMiscData.gamePostsCount
                }
                else {
                    props.ncaafGames[i].gamePostsCount = 0
                }
            })
        }
        setncaafGames(props.ncaafGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))

        for (let i = 0; i < props.mmaGames.length; i++) {

            firebase.firestore()
            .collection("votes")
            .doc(props.mmaGames[i].gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let gameMiscData = snapshot.data();
                    props.mmaGames[i].gamePostsCount = gameMiscData.gamePostsCount
                }
                else {
                    props.mmaGames[i].gamePostsCount = 0
                }
            })
        }
        setmmaGames(props.mmaGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))

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
        seteplGames(props.eplGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))


        setFutureGames(props.futureGames)
        setFormula1Teams(props.formula1Teams)
        setFormula1Races(props.formula1Races)
        setFormula1Drivers(props.formula1Drivers)
        setFormula1Rankings(props.formula1Rankings)
        if (props.formula1Rankings.length > 2 ) {setFormula1RaceLive(true)}

        trendingFunction(ncaabGames, nflGames, ncaafGames, nbaGames, nhlGames, mmaGames)
        setLoading(false)

    }

    useEffect(() =>{
        (() => registerForPushNotificationsAsync())()
        checkForUpdate()

    }, []);

    const checkForUpdate = async () => {

        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
            updateApp();
        }
        
    }
    
    const updateApp = async () => {

        await Updates.fetchUpdateAsync()
        Updates.reloadAsync() 
        
    }

    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowAnnouncements: true,
                },
            });
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

    const resetBadgeCount = async () => {

        await Notifications.setBadgeCountAsync(0);
        
    }

    const sendNotification = async (token) => {

        const message = {
            to: token,
            sound: 'default',
            title: 'locctocc',
            body: notification ? notification : '',
            badge: 1,
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
            if (sport == 'NCAAF') {setSportGames(props.ncaafGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))} 
            if (sport == 'NFL') {setSportGames(props.nflGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))} 
            if (sport == 'MLB') {setSportGames(props.mlbGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))}
            if (sport == 'NCAAB') {setSportGames(props.ncaabGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))}
            if (sport == 'NBA') {setSportGames(props.nbaGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))}
            if (sport == 'NHL') {setSportGames(props.nhlGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))}
            if (sport == 'MMA') {setSportGames(props.mmaGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate)))} 
            if (sport == 'FIFA') {setSportGames(props.eplGames)}
            if (sport == 'PGA') {setSportGames(props.golfGames)}
            if (sport == 'Futures') {setSportGames(props.futureGames)}
            if (sport == 'Formula 1') {setSportGames(props.formula1Races)}
            if(sport == 'Trending') {setSportGames(trendingGames)}
            setSearch(text)
        }
        
    }

    const browseFunction = () => {

        if (browse == true) {
            setBrowse(false)
        } else {
            setBrowse(true)
            Analytics.logEvent('searchGames', {user_name: props.currentUser.name});
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
        if (sport == 'Trending') {setSportGames(trendingGames); Analytics.logEvent('selectTrendingGames', { user_name: props.currentUser.name }); setSport('Trending');}
        if (sport == 'NFL') {setSportGames(props.nflGames); Analytics.logEvent('selectNFLGames', {user_name: props.currentUser.name}); setSport('NFL');}
        if (sport == 'NBA') {setSportGames(props.nbaGames); Analytics.logEvent('selectNBAGames', {user_name: props.currentUser.name}); setSport('NBA');}
        if (sport == 'NHL') {setSportGames(props.nhlGames); Analytics.logEvent('selectNHLGames', {user_name: props.currentUser.name}); setSport('NHL');}
        if (sport == 'NCAAF') {setSportGames(props.ncaafGames); Analytics.logEvent('selectNCAAFGames', {user_name: props.currentUser.name}); setSport('NCAAF');}
        if (sport == 'FIFA') {setSportGames(props.eplGames); Analytics.logEvent('selectFIFAGames', {user_name: props.currentUser.name}); setSport('FIFA');}
        if (sport == 'MLB') {setSportGames(props.mlbGames); Analytics.logEvent('selectMLBGames', {user_name: props.currentUser.name}); setSport('MLB');}
        if (sport == 'NCAAB') {setSportGames(props.ncaabGames); Analytics.logEvent('selectNCAABGames', {user_name: props.currentUser.name}); setSport('NCAAB');}
        if (sport == 'UFC') {setSportGames(props.mmaGames); Analytics.logEvent('selectUFCGames', {user_name: props.currentUser.name}); setSport('UFC');}
        if (sport == 'PGA') {setSportGames(props.golfGames); Analytics.logEvent('selectGolfGames', {user_name: props.currentUser.name}); setSport('PGA');}
        if (sport == 'Futures') {setSportGames(props.futureGames); Analytics.logEvent('selectFuturesGames', {user_name: props.currentUser.name}); setSport('Futures');}
        if (sport == 'Formula 1') {setSportGames(props.formula1Races); Analytics.logEvent('selectFormula1Games', {user_name: props.currentUser.name}); setSport('Formula 1');}
        if (sport == 'Fantasy') {setSportGames(fantasyGames); Analytics.logEvent('selectFantasyGames', {user_name: props.currentUser.name}); setSport('Fantasy');}
    }

    const nbaIcon = (<Icon name="basketball-outline" color="#ee6730" size={16}/>);
    const mlbIcon = (<Icon name="baseball-outline" color="red" size={16}/>);
    const nflIcon = (<Icon name="american-football" color="#825736" size={16}/>);
    const ncaafIcon = (<MaterialCommunityIcons name="football-helmet" color="navy" size={16}/>);
    const nhlIcon = (<MaterialCommunityIcons name="hockey-sticks" color="#B87333" size={16}/>);
    const ncaabIcon = (<MaterialCommunityIcons name="basketball-hoop-outline" color="#800000" size={16}/>);
    const eplIcon = (<MaterialCommunityIcons name="soccer" color="black" size={16}/>);
    const golfIcon = (<MaterialCommunityIcons name="golf" color="green" size={16}/>);
    const futureIcon = (<MaterialCommunityIcons name="alien" color="#6CC417" size={16}/>);
    const formula1Icon = (<Icon name="car-sport" color="red" size={16}/>);
    const trendingIcon = (<MaterialCommunityIcons name="trending-up" color="#009387" size={16}/>);
    const propsIcon = (<MaterialCommunityIcons name= "trophy" color="#ffd700" size={16}/>)
    const mmaIcon = (<MaterialCommunityIcons name="boxing-glove" color="#0000FF" size={16}/>);
    const fantasyIcon = (<Foundation name="clipboard-pencil" color="#000" size={16}/>)

    const sportsList = [
        {
            sport: 'Trending',
            id: '1',
            icon: trendingIcon
        },
        {
            sport: 'NFL',
            id: '2',
            icon: nflIcon
        },
        {
            sport: 'NCAAF',
            id: '3',
            icon: ncaafIcon
        },
        {
            sport: 'NBA',
            id: '4',
            icon: nbaIcon
        },
        {
            sport: 'NCAAB',
            id: '5',
            icon: ncaabIcon
        },
        {
            sport: 'NHL',
            id: '6',
            icon: nhlIcon
        },
        {
            sport: 'FIFA',
            id: '7',
            icon: eplIcon
        },
        {
            sport: 'Formula 1',
            id: '8',
            icon: formula1Icon
        },
        {
            sport: 'UFC',
            id: '9',
            icon: mmaIcon
        },
        {
            sport: 'Futures',
            id: '10',
            icon: futureIcon
        },
     
      ];

      const fantasyList = [
        {
            id: '1',
            fantasyTopic: 'Start or Sit'
        },
        {
            id: '2',
            fantasyTopic: 'Daily Fantasy Sports'
        },
        {
            id: '3',
            fantasyTopic: 'Waiver Wire'
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
            gameId: 'fa2852d4b88dd0759b0f8bc2665261b8'
        },
        {
            futureSport: 'FIFA World Cup Winner',
            id: '5',
            icon: eplIcon,
            gameId: '28abbddced5f6df0409dc0c7ec0fd5f6'
        },
        
      ];

    const testID = 'ca-app-pub-3940256099942544/2934735716';
    const productionID = 'ca-app-pub-8519029912093094/5201658236';
    // Is a real device and running in production.
    const adUnitID = Device.isDevice && !__DEV__ ? productionID : testID;

    const openAdLink = () => {

        Analytics.logEvent('adClick', {user_name: props.currentUser.name, adPartner: 'Sporttrade'});
            
    }

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
                    {item.sport != 'Trending' ? <Text>{item.sport}</Text> : null}
                    {item.sport != 'Trending' ? <Text> {item.icon}</Text> : <Text>{item.icon}{item.icon}</Text> }
                </TouchableOpacity>
            </View>
        :
            <View style={styles.sportContainer}>
                <TouchableOpacity
                    style={styles.sportButton}
                    onPress={() => {setSportFunction(item.sport)}}>
                    {item.sport != 'Trending' ? <Text>{item.sport}</Text> : null}
                    {item.sport != 'Trending' ? <Text> {item.icon}</Text> : <Text>{item.icon}{item.icon}</Text> }
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
                            {item.gamePostsCount > 6 ?
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                        
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                    </View>
                                </View>
                                
                            : 
                            item.gamePostsCount > 4 ?
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
                                    {item.sport == 'mma_mixed_martial_arts' ?
                                    <Text style={styles.spreadText}>{item.over}</Text>
                                    :
                                    <Text style={styles.spreadText}>O {item.over}</Text>
                                    }
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
                                    {item.sport == 'mma_mixed_martial_arts' ?
                                    <Text style={styles.spreadText}>{item.over}</Text>
                                    :
                                    <Text style={styles.spreadText}>U {item.over}</Text>
                                    } 
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
                            {item.gamePostsCount > 6 ?
                                <View style={styles.gameDateContainer}>
                                    <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                    </View>
                                </View>
                                
                            : 
                            item.gamePostsCount > 4 ?
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
                                <View style={styles.spreadItem}>
                                </View>
                                <View style={styles.totalItem}>
                                    {item.sport == 'mma_mixed_martial_arts' ?
                                    <Text style={styles.spreadText}>{item.over}</Text>
                                    :
                                    <Text style={styles.spreadText}>O {item.over}</Text>
                                    } 
                                    {item.overOdds > 0 ?
                                        <Text style={styles.oddsBottomRowText}>+{item.overOdds}</Text>
                                        : <Text style={styles.oddsBottomRowText}>{item.overOdds}</Text>
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
                                <View style={styles.spreadItem}>
                                    <Text style={styles.spreadText}></Text>
                                </View>
                                <View style={styles.totalItem}>
                                    {item.sport == 'mma_mixed_martial_arts' ?
                                    <Text style={styles.spreadText}>{item.over}</Text>
                                    :
                                    <Text style={styles.spreadText}>U {item.over}</Text>
                                    } 
                                    {item.underOdds > 0 ?
                                        <Text style={styles.oddsBottomRowText}>+{item.underOdds}</Text>
                                        : <Text style={styles.oddsBottomRowText}>{item.underOdds}</Text>
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

    const renderFantasyItem = ({ item }) => {
        return (
            <View>
                <TouchableOpacity>
                    <Text style={styles.listPlayerText}>{item.fantasyTopic}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /* <View style={styles.adView}>
            <AdMobBanner
                bannerSize="banner"
                adUnitID={adUnitID} 
                servePersonalizedAds // true or false
            />
        </View> 
        <TouchableOpacity style={styles.adView}
            onPress={() => { Linking.openURL('https://www.snackmagic.com/?grsf=613qvn'); openAdLink()}} >
            <Image 
                style={{ width: "95%", height: 40 }}
                source={require('../../assets/snackMagicBanner.jpg')}
            />
        </TouchableOpacity>*/

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
            sportGames == props.formula1Races  ?
            <View style={styles.formula1HeaderContainer}>
                <Text style={styles.gameHeaderText}>Current Race</Text>
            </View>
            :
            sportGames == fantasyGames  ?
            <View style={styles.formula1HeaderContainer}>
                <Text style={styles.gameHeaderText}>Fantasy Central</Text>
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
            /*
            sportGames == props.golfGames  ?
            <FlatList 
                data = {sportGames.sort((a, b) => parseFloat(a.playerOdds) - parseFloat(b.playerOdds))}
                style={styles.feed}
                renderItem={renderListItem}
    
            /> 
            :*/

            sportGames == props.futureGames  ?
            <FlatList 
                data = {futureList}
                style={styles.feed}
                renderItem={renderFutureItem}
    
            />
            :

            sportGames == fantasyGames  ?
            <FlatList 
                data = {fantasyList}
                style={styles.feed}
                renderItem={renderFantasyItem}
    
            />
            :

            sportGames == props.formula1Races  ?
            <ScrollView style={styles.feed}>
                <TouchableOpacity
                        onPress={() => props.navigation.navigate('game', {gameId: props.formula1Races.gameId, gameDate: props.formula1Races.gameDate, sport: props.formula1Races.sport })}>
                    <View style={styles.fakeButtonContainer}>
                        <Text style={styles.fakeButton}>See Locks {'>'}{'>'}</Text>
                    </View>
                    <View style={styles.teamContainer} >
                        <View style={styles.headerView}>
                            <Text style={styles.detailsHeader}>Race</Text>
                        </View>
                        <View style={styles.detailsView}>
                            <Text style={styles.detailsText}>{props.formula1Races.raceName}</Text>
                        </View>
                    </View>
                    <View style={styles.teamContainer} >
                        <View style={styles.headerView}>
                            <Text style={styles.detailsHeader}>Date</Text>
                        </View>
                        <View style={styles.detailsView}>
                            <Text style={styles.detailsText}>{moment(props.formula1Races.gameDate).format('MMMM Do, h:mma')}</Text>
                        </View>
                    </View>
                    <View style={styles.teamContainer} >
                        <View style={styles.headerView}>
                            <Text style={styles.detailsHeader}>Track</Text>
                        </View>
                        <View style={styles.detailsView}>
                            <Text style={styles.detailsText}>{props.formula1Races.trackName}</Text>
                        </View>
                    </View>
                    <View style={styles.teamContainer} >
                        <View style={styles.headerView}>
                            <Text style={styles.detailsHeader}>City</Text>
                        </View>
                        <View style={styles.detailsView}>
                            <Text style={styles.detailsText}>{props.formula1Races.raceCity}</Text>
                        </View>
                    </View>
                    <View style={styles.teamContainer} >
                        <View style={styles.headerView}>
                            <Text style={styles.detailsHeader}>Country</Text>
                        </View>
                        <View style={styles.detailsView}>
                            <Text style={styles.detailsText}>{props.formula1Races.raceCountry}</Text>
                        </View>
                    </View>
                    <View style={styles.teamContainer} >
                        <View style={styles.headerView}>
                            <Text style={styles.detailsHeader}>Distance</Text>
                        </View>
                        <View style={styles.detailsView}>
                            <Text style={styles.detailsText}>{props.formula1Races.raceDistance}</Text>
                        </View>
                    </View>
                    <View style={styles.teamContainer} >
                        <View style={styles.headerView}>
                            <Text style={styles.detailsHeader}>Total Laps</Text>
                        </View>
                        <View style={styles.detailsView}>
                            <Text style={styles.detailsText}>{props.formula1Races.totalLaps}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                    {formula1RaceLive == false ?
                    null
                    :
                    <View>
                        <Text></Text>
                        <View style={styles.borderView}></View>
                        <Text></Text>
                        <TouchableOpacity
                             onPress={() => props.navigation.navigate('Standings', {standingsType: 'liveRace'})}>
                            <View style={styles.formula1HeaderContainer}>
                                <Text style={styles.standingsHeaderText}>{props.formula1Races.raceName} Standings</Text>
                                <Text style={styles.fakeButton}>See All {'>'}{'>'}</Text>
                            </View>
                            <View style={styles.formula1Container}>
                                <View style={styles.formula1RankContainer}>
                                    <Text style={styles.listFormula1Text}>{props.formula1Rankings[0].driverPosition}</Text>
                                </View>
                                <View style={styles.formula1LogoContainer}>
                                    <Image 
                                        style={styles.driverLogoContainer}
                                        source={{uri: props.formula1Rankings[0].driverImage}}
                                    />
                                </View>
                                <View style={styles.formula1TeamContainer}>
                                    <Text style={styles.listFormula1Text}>{props.formula1Rankings[0].driverName}</Text>
                                </View>
                            </View>
                            <View style={styles.formula1Container}>
                                <View style={styles.formula1RankContainer}>
                                    <Text style={styles.listFormula1Text}>{props.formula1Rankings[1].driverPosition}</Text>
                                </View>
                                <View style={styles.formula1LogoContainer}>
                                    <Image 
                                        style={styles.driverLogoContainer}
                                        source={{uri: props.formula1Rankings[1].driverImage}}
                                    />
                                </View>
                                <View style={styles.formula1TeamContainer}>
                                    <Text style={styles.listFormula1Text}>{props.formula1Rankings[1].driverName}</Text>
                                </View>
                            </View>
                            <View style={styles.formula1Container}>
                                <View style={styles.formula1RankContainer}>
                                    <Text style={styles.listFormula1Text}>{props.formula1Rankings[2].driverPosition}</Text>
                                </View>
                                <View style={styles.formula1LogoContainer}>
                                    <Image 
                                        style={styles.driverLogoContainer}
                                        source={{uri: props.formula1Rankings[2].driverImage}}
                                    />
                                </View>
                                <View style={styles.formula1TeamContainer}>
                                    <Text style={styles.listFormula1Text}>{props.formula1Rankings[2].driverName}</Text>
                                </View>
                            </View>   
                        </TouchableOpacity>
                        
                    </View>
                    
                    }
                <Text></Text>
                <View style={styles.borderView}></View>
                <Text></Text>
                <View style={styles.formula1HeaderContainer}>
                    <Text style={styles.standingsHeaderText}>Constructor Standings</Text>
                    <Text style={styles.fakeButton}>See All {'>'}{'>'}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('Standings', {standingsType: 'constructor'})}>
                    <View style={styles.formula1Container}>
                        <View style={styles.formula1RankContainer}>
                            <Text style={styles.listFormula1Text}>{props.formula1Teams[0].currentSeasonRank}</Text>
                        </View>
                        <View style={styles.formula1LogoContainer}>
                            <Image 
                                style={styles.teamLogoContainer}
                                source={{uri: props.formula1Teams[0].logo}}
                            />
                        </View>
                        <View style={styles.formula1TeamContainer}>
                            <Text style={styles.listFormula1Text}>{props.formula1Teams[0].name}</Text>
                        </View>
                        <View style={styles.formula1PointsContainer}>
                            <Text style={styles.listFormula1Text}>{props.formula1Teams[0].currentSeasonPoints}</Text>
                        </View>
                    </View>
                    <View style={styles.formula1Container}>
                        <View style={styles.formula1RankContainer}>
                            <Text style={styles.listFormula1Text}>{props.formula1Teams[1].currentSeasonRank}</Text>
                        </View>
                        <View style={styles.formula1LogoContainer}>
                            <Image 
                                style={styles.teamLogoContainer}
                                source={{uri: props.formula1Teams[1].logo}}
                            />
                        </View>
                        <View style={styles.formula1TeamContainer}>
                            <Text style={styles.listFormula1Text}>{props.formula1Teams[1].name}</Text>
                        </View>
                        <View style={styles.formula1PointsContainer}>
                            <Text style={styles.listFormula1Text}>{props.formula1Teams[1].currentSeasonPoints}</Text>
                        </View>
                    </View>
                    <View style={styles.formula1Container}>
                        <View style={styles.formula1RankContainer}>
                            <Text style={styles.listFormula1Text}>{props.formula1Teams[2].currentSeasonRank}</Text>
                        </View>
                        <View style={styles.formula1LogoContainer}>
                            <Image 
                                style={styles.teamLogoContainer}
                                source={{uri: props.formula1Teams[2].logo}}
                            />
                        </View>
                        <View style={styles.formula1TeamContainer}>
                            <Text style={styles.listFormula1Text}>{props.formula1Teams[2].name}</Text>
                        </View>
                        <View style={styles.formula1PointsContainer}>
                            <Text style={styles.listFormula1Text}>{props.formula1Teams[2].currentSeasonPoints}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                
                <Text></Text>
                <View style={styles.borderView}></View>
                <Text></Text>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('Standings', {standingsType: 'driver'})}>
                    <View style={styles.formula1HeaderContainer}>
                        <Text style={styles.standingsHeaderText}>Driver Standings</Text>
                        <Text style={styles.fakeButton}>See All {'>'}{'>'}</Text>
                    </View>
                <View style={styles.formula1Container}>
                    <View style={styles.formula1RankContainer}>
                        <Text style={styles.listFormula1Text}>{props.formula1Drivers[0].driverRank}</Text>
                    </View>
                    <View style={styles.formula1LogoContainer}>
                        <Image 
                            style={styles.driverLogoContainer}
                            source={{uri: props.formula1Drivers[0].driverImage}}
                        />
                    </View>
                    <View style={styles.formula1TeamContainer}>
                        <Text style={styles.listFormula1Text}>{props.formula1Drivers[0].driverName}</Text>
                    </View>
                    <View style={styles.formula1PointsContainer}>
                        <Text style={styles.listFormula1Text}>{props.formula1Drivers[0].currentSeasonPoints}</Text>
                    </View>
                </View>
                <View style={styles.formula1Container}>
                    <View style={styles.formula1RankContainer}>
                        <Text style={styles.listFormula1Text}>{props.formula1Drivers[1].driverRank}</Text>
                    </View>
                    <View style={styles.formula1LogoContainer}>
                        <Image 
                            style={styles.driverLogoContainer}
                            source={{uri: props.formula1Drivers[1].driverImage}}
                        />
                    </View>
                    <View style={styles.formula1TeamContainer}>
                        <Text style={styles.listFormula1Text}>{props.formula1Drivers[1].driverName}</Text>
                    </View>
                    <View style={styles.formula1PointsContainer}>
                        <Text style={styles.listFormula1Text}>{props.formula1Drivers[1].currentSeasonPoints}</Text>
                    </View>
                </View>
                <View style={styles.formula1Container}>
                    <View style={styles.formula1RankContainer}>
                        <Text style={styles.listFormula1Text}>{props.formula1Drivers[2].driverRank}</Text>
                    </View>
                    <View style={styles.formula1LogoContainer}>
                        <Image 
                            style={styles.driverLogoContainer}
                            source={{uri: props.formula1Drivers[2].driverImage}}
                        />
                    </View>
                    <View style={styles.formula1TeamContainer}>
                        <Text style={styles.listFormula1Text}>{props.formula1Drivers[2].driverName}</Text>
                    </View>
                    <View style={styles.formula1PointsContainer}>
                        <Text style={styles.listFormula1Text}>{props.formula1Drivers[2].currentSeasonPoints}</Text>
                    </View>
                </View>   
            </TouchableOpacity>
                
                

            </ScrollView>
            :

            <FlatList 
                data = {sportGames}
                style={styles.feed}
                renderItem={renderItem}
    
            />

            
            }
            <TouchableOpacity style={styles.adView}
                onPress={() => { Linking.openURL('https://sporttrade.onelink.me/evxw/LoccTocc'); openAdLink()}} >
                <Image 
                    style={{ width: "95%", height: 50 }}
                    source={require('../../assets/sporttradeBanner.png')}
                />
            </TouchableOpacity>
         
            
            
            
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
        alignItems: 'center',
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
    formula1HeaderContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginLeft: '2%',
        marginRight: '10%',
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
    teamLogoContainer: {
        width: 80,
        height: 40,
    },
    driverLogoContainer: {
        width: 80,
        height: 60,
    },
    formula1Container: {
        flexDirection: 'row',
    },
    formula1TeamContainer: {
        width: '50%',
        justifyContent: 'center'
    },
    formula1RankContainer: {
        width: '10%',
        justifyContent: 'center',
        marginLeft: 4
    },
    formula1LogoContainer: {
        width: '30%',
        justifyContent: 'center'
    },
    formula1PointsContainer: {
        width: '10%',
        justifyContent: 'center'
    },

    listFormula1Text: {
        fontSize: 14,
    },
    detailsText: {
        fontSize: 12,
    },
    detailsHeader: {
        fontSize: 12,
        textTransform: 'uppercase',
        color: 'grey'
    },
    headerText: {
        fontSize: 16,
        
    },
    headerContainer: {
        alignItems: 'left'
    },
    borderView: {
        borderBottomColor: '#CACFD2',
        borderBottomWidth: 1,
    },
    detailsView:{
        
    },
    headerView:{
        width: '35%'
    },
    teamContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: '1%',
        paddingLeft: 4
    },
    teamLogo: {
        width: "100%",
        height: "100%",
    },
    standingsHeaderContainer: {
        paddingBottom: 8,
        marginLeft: '2%',
    },
    standingsHeaderText: {
        fontWeight: 'bold',
    },
    fakeButton: {
        color: '#0033cc',
        fontSize: 12,
    },
    fakeButtonContainer: {
        alignItems: 'flex-end',
        marginRight: "10%",
    }
})

const mapStateToProps = (store) => ({
    ncaafGames: store.ncaafGamesState.ncaafGames,
    mlbGames: store.mlbGamesState.mlbGames,
    ncaabGames: store.ncaabGamesState.ncaabGames,
    nflGames: store.nflGamesState.nflGames,
    nbaGames: store.nbaGamesState.nbaGames,
    nhlGames: store.nhlGamesState.nhlGames,
    mmaGames: store.mmaGamesState.mmaGames,
    eplGames: store.eplGamesState.eplGames,
    futureGames: store.futureGamesState.futureGames,
    formula1Teams: store.formula1TeamsState.formula1Teams,
    formula1Races: store.formula1RacesState.formula1Races,
    formula1Drivers: store.formula1DriversState.formula1Drivers,
    formula1Rankings: store.formula1RankingsState.formula1Rankings,
    allUsers: store.userState.allUsers,
    currentUser: store.userState.currentUser,
    contestStatus: store.userState.contestStatus,


})

export default connect(mapStateToProps)(Odds);



