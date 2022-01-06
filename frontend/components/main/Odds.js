import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, useWindowDimensions, Alert, TextInput, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'

import moment from 'moment'

import {AdMobBanner, AdMobInterstitial} from 'expo-ads-admob'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';

function Odds(props) {

    const [sportGames, setSportGames] = useState([]);
    const [nflGames, setnflGames] = useState([]);
    const [ncaafGames, setncaafGames] = useState([]);
    const [ncaabGames, setncaabGames] = useState([]);
    const [nbaGames, setnbaGames] = useState([]);
    const [eplGames, seteplGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sport, setSport] = useState('');
    const [browse, setBrowse] = useState(false);
    const [trendingGames, setTrendingGames] = useState([]);
    const [notification, setNotification] = useState('');

     useEffect(() => {
        fetchData()
        setSportGames(props.nflGames)
        setSport('NFL')

    }, [ props.nflGames, props.ncaafGames, props.nbaGames, props.ncaabGames, props.eplGames, props.trendingGames])

    const fetchData = () => {
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
        setnflGames(props.nflGames)

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
        setnbaGames(props.nbaGames)

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
        setncaafGames(props.ncaafGames)

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
        setncaabGames(props.ncaabGames)

                 
        setLoading(false)

       array1 = props.nflGames
        .concat(props.nbaGames, props.ncaabGames, props.ncaafGames)

        setTrendingGames(array1)

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
            alert('Failed to get push token for push notification!');
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
        async function sendPushNotification(expoPushToken) {
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

    }

    const sendNotificationToAllUsers = async () => {
        const users = await firebase.firestore().collection("users").get();
        users.docs.map((user) => sendNotification(user.data().token))
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
            if (sport == 'NFL') {setSportGames(props.nflGames)}
            if (sport == 'NBA') {setSportGames(props.nbaGames)} 
            if (sport == 'NCAAF') {setSportGames(props.ncaafGames)} 
            if (sport == 'NCAAB') {setSportGames(props.ncaabGames)}
            if (sport == 'EPL') {setSportGames(props.eplGames)}
            if(sport == 'Trending') {setSportGames(trendingGames)}
            setSearch(text)
        }
        
    }

    const browseFunction = () => {
        if (browse == true) {
            setBrowse(false)
        } else {
            setBrowse(true)
        }
    }
    
    const setSportFunction = (sport) => {
        if (sport == 'Trending') {setSportGames(trendingGames); setSport('Trending'); }
        if (sport == 'NFL') {setSportGames(props.nflGames); setSport('NFL')}
        if (sport == 'NBA') {setSportGames(props.nbaGames); setSport('NBA')} 
        if (sport == 'NCAAF') {setSportGames(props.ncaafGames); setSport('NCAAF')} 
        if (sport == 'NCAAB') {setSportGames(props.ncaabGames); setSport('NCAAB')}
        if (sport == 'EPL') {setSportGames(props.eplGames); setSport('EPL')}
    }

    const nbaIcon = (<Icon name="basketball-outline" color="#ee6730" size={16}/>);
    const nflIcon = (<Icon name="american-football" color="#825736" size={16}/>);
    const ncaafIcon = (<MaterialCommunityIcons name="football-helmet" color="#00843D" size={16}/>);
    const ncaabIcon = (<MaterialCommunityIcons name="basketball-hoop-outline" color="grey" size={16}/>);
    const eplIcon = (<MaterialCommunityIcons name="soccer" color="black" size={16}/>);
    const trendingIcon = (<MaterialCommunityIcons name="trending-up" color="#00FF00" size={16}/>);

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
            sport: 'NBA',
            id: '3',
            icon: nbaIcon
        },
        {
            sport: 'NCAAF',
            id: '4',
            icon: ncaafIcon
        },
        {
            sport: 'NCAAB',
            id: '5',
            icon: ncaabIcon
        },
        {
            sport: 'EPL',
            id: '6',
            icon: eplIcon
        },
      ];

    /*const interstitial = async () => {
        await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // Test ID, Replace with your-admob-unit-id
        try {
            await AdMobInterstitial.requestAdAsync();
            await AdMobInterstitial.showAdAsync();
        } catch(error) {
            console.log(error)
        }
    } */

    /* */

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
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, gameDate: item.gameDate, homeTeam: item.homeTeam, awayTeam: item.awayTeam, homeSpread: item.homeSpread, awaySpread: item.awaySpread, homeSpreadOdds: item.homeSpreadOdds, awaySpreadOdds: item.awaySpreadOdds, awayMoneyline: item.awayMoneyline, homeMoneyline: item.homeMoneyline, over: item.over, overOdds: item.overOdds, under: item.under, underOdds: item.underOdds, sport: item.sport })}>
                        <View>
                            {item.gamePostsCount > 4 ?
                                <View style={styles.gameDateContainer}>
                                    <Text>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                    </View>
                                </View>
                                
                            : 
                            item.gamePostsCount > 2 ?
                                <View style={styles.gameDateContainer}>
                                    <Text>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"orange"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"orange"}/>
                                    </View>
                                </View>
                            : 
                            item.gamePostsCount > 0 ? 
                                <View style={styles.gameDateContainer}>
                                    <Text>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#fed550"}/>
                                    </View>
                                </View>
                            :
                                <View style={styles.gameDateContainer}>
                                    <Text>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                </View>
                                }
                            <View style={styles.awayGameInfoContainer}>
                                <View style={styles.teamItem}>
                                    <Text style={styles.teamText}>{item.awayTeam}</Text>
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
                                    <Text style={styles.teamText}>{item.homeTeam}</Text>
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
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, gameDate: item.gameDate, homeTeam: item.homeTeam, awayTeam: item.awayTeam, awayMoneyline: item.awayMoneyline, homeMoneyline: item.homeMoneyline, drawMoneyline: item.drawMoneyline, sport: item.sport })}>
                        <View>
                            {item.gamePostsCount > 4 ?
                                <View style={styles.gameDateContainer}>
                                    <Text>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#B81D13"}/>
                                    </View>
                                </View>
                                
                            : 
                            item.gamePostsCount > 2 ?
                                <View style={styles.gameDateContainer}>
                                    <Text>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"orange"}/>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"orange"}/>
                                    </View>
                                </View>
                            : 
                            item.gamePostsCount > 0 ? 
                                <View style={styles.gameDateContainer}>
                                    <Text>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                    <View style={styles.pepperContainer}>
                                        <FontAwesome5 name={"pepper-hot"} size={16} color={"#fed550"}/>
                                    </View>
                                </View>
                            :
                                <View style={styles.gameDateContainer}>
                                    <Text>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                </View>
                                }
                            <View style={styles.eplAwayGameInfoContainer}>
                                <View style={styles.teamItem}>
                                    <Text style={styles.teamText}>{item.awayTeam}</Text>
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

    return (
        <View style={styles.container}>
            {firebase.auth().currentUser.uid == 'U6u9pFuuwLVEn97z76a07WHK1V63' ?
            <View style={styles.notificationContainer}>
                <TextInput
                    style={styles.notificationInput}
                    onChangeText={(text) => setNotification(text)}
                    placeholder="Message"
                    clearButtonMode={'always'}
                />
                
                <TouchableOpacity
                    onPress={() => {sendNotificationToAllUsers()}}
                    style={styles.notificationButton}>
                        <Text style={styles.notificationText}>SEND</Text>
                </TouchableOpacity>
            </View>
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
            {sportGames == trendingGames ?
                <FlatList 
                data = {sportGames.sort((a, b) => parseFloat(b.gamePostsCount) - parseFloat(a.gamePostsCount)).slice(0, 10)}
                style={styles.feed}
                renderItem={renderItem}
    
            />
            :
            sportGames == props.eplGames ?
            <FlatList 
                data={sportGames}
                style={styles.feed}
                renderItem={renderEPLItem}
    
            />
            :
            <FlatList 
                data={sportGames}
                style={styles.feed}
                renderItem={renderItem}
    
            />
            }
            <View style={styles.adView}>
                <AdMobBanner
                    bannerSize="banner"
                    adUnitID="ca-app-pub-8519029912093094/4907013689" // Real ID: 8519029912093094/4907013689, test ID: 3940256099942544/2934735716
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
        backgroundColor: "#e1e2e6",
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
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: "#ffffff",

    },
    eplGameContainer: {
        padding: 6,
        marginVertical:4,
        marginRight: 2,
        marginLeft: 2,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: "#ffffff",

    },
    awayGameInfoContainer: { 
        flexDirection: 'row',
        borderBottomColor: "#e1e2e6",
        borderBottomWidth: 1,
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
        width: "50%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        justifyContent: 'center',
        backgroundColor: "#ffffff"
    },
    spreadItem: {
        width: "16.5%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    moneylineItem: {
        width: "16.5%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    totalItem: {
        width: "16.5%",
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    gameHeaderContainer: {
        flexDirection: 'row',
    },
    teamHeader: {
        width: "50%",
    },
    spreadHeader: {
        width: "16.5%",
        alignItems: 'center',
    },
    moneylineHeader: {
        width: "16.5%",
        alignItems: 'center',
    },
    totalHeader: {
        width: 60,
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
        borderColor: "#CACFD2",
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
    pepperContainer: {
        flexDirection: 'row',
    },
    notificationButton: {
        backgroundColor: "#0033cc",
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 6,
        width: "20%",
        alignSelf: "center",
        marginBottom: "1%",
        marginTop: "1%",
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

    }
    
    
    
})

const mapStateToProps = (store) => ({
    nflGames: store.nflGamesState.nflGames,
    ncaafGames: store.ncaafGamesState.ncaafGames,
    mlbGames: store.mlbGamesState.mlbGames,
    nbaGames: store.nbaGamesState.nbaGames,
    ncaabGames: store.ncaabGamesState.ncaabGames,
    eplGames: store.eplGamesState.eplGames,

})


export default connect(mapStateToProps, null)(Odds);
