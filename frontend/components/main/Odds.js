import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, ActivityIndicator, Image, TextInput, Dimensions, Linking, FlatList, TouchableOpacity, ScrollView } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Foundation from 'react-native-vector-icons/Foundation'
import Icon from 'react-native-vector-icons/Ionicons';

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device';
import * as StoreReview from 'expo-store-review';

import moment from 'moment'

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import analytics from "@react-native-firebase/analytics";
import { BannerAdSize, TestIds, BannerAd } from 'react-native-google-mobile-ads';
import AnnouncementModal from '../buttons/announcement';
import LatestBlogPreview from '../buttons/LatestBlogPreview';

import AsyncStorage from '@react-native-async-storage/async-storage';


import { connect } from 'react-redux'

function Odds(props) {

    const [sportGames, setSportGames] = useState([]);
    const [golfGames, setGolfGames] = useState([]);
    const [fantasyGames, setFantasyGames] = useState([]);
    const [futureGames, setFutureGames] = useState([]);
    const [formula1Teams, setFormula1Teams] = useState([]);
    const [formula1Races, setFormula1Races] = useState([]);
    const [formula1Drivers, setFormula1Drivers] = useState([]);
    const [formula1Rankings, setFormula1Rankings] = useState([]);
    const [formula1RaceLive, setFormula1RaceLive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sport, setSport] = useState('');
    const [browse, setBrowse] = useState(false);
    const [trendingGames, setTrendingGames] = useState([]);
    const [notification, setNotification] = useState('');
    const [notificationCriteria, setNotificationCriteria] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(sportGames);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    const [showAnnouncement, setShowAnnouncement] = useState(false);
    const [blogPreview, setBlogPreview] = useState(true)

    const { blogDetails } = props;

    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8519029912093094/8258310490'

    const user = auth().currentUser;

    useEffect(() => {

        (() => registerForPushNotificationsAsync())()

        analytics().logScreenView({ screen_name: 'Odds', screen_class: 'Odds',  user_name: props.currentUser.name})

        if (user) {
            firestore()
              .collection('users')
              .doc(user.uid)
              .get()
              .then((snapshot) => {
                if (snapshot.exists) {
                  firestore()
                    .collection('users')
                    .doc(user.uid)
                    .set(
                      {
                        lastLogin: firestore.Timestamp.fromDate(new Date()),
                      },
                      { merge: true }
                    );
                }
              });
          }
        
    }, [])

    useEffect(() => {
        const currentUserUid = user.uid;

        if (currentUserUid === 'o5iJPFfAF3h9A5TSLqB0AkjK8QA2') {
            return;
          }


        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so we add 1
    
        const fieldName = `alltimeLeaders_${currentYear}_${currentMonth}`;

        firestore()
          .collection('users')
          .doc(currentUserUid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              const userDoc = firestore().collection("users").doc(currentUserUid);
              const userData = snapshot.data();
    
              if (!userData[fieldName]) {
                userDoc.set({ [fieldName]: 100 }, { merge: true });
                /*setShowAnnouncement(true); */
              }
            }
          });
      }, []);

      
      useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
            if(value == null ) {
                AsyncStorage.setItem('alreadyLaunched', 'true');    
                setIsFirstLaunch(true)
                analytics().logEvent('firstLaunch', {user_name: props.currentUser.name});

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
        setLoading(true)

        const allowedSports = ['MLB', 'NCAAF', 'NCAAB', 'NHL', 'NBA', 'WNBA', 'NCAAF', 'EPL', 'UFC', 'PGA', 'Futures', 'Formula 1', 'Trending'];

        if (allowedSports.includes(sport)) {
        
        }
        else {
            setSportGames(props.nflGames)
            setSport('NFL')
            setLoading(false)
        }

    }, [ props.nbaGames, props.nhlGames, props.eplGames, props.nflGames, props.ncaabGames, props.mmaGames])

    
    const fetchData = async () => {
        const games = [, props.nbaGames, props.nhlGames, props.mmaGames, props.nflGames, props.ncaabGames, props.eplGames];

        const teamLogosById = {};
            for (const logo of props.teamLogos) {
                teamLogosById[logo.id] = logo.teamLogo;
            }

            for (const game of [ ...props.nflGames,...props.nbaGames, ...props.nhlGames, ...props.ncaabGames, ...props.eplGames]) {
                game.homeTeamLogo = teamLogosById[game.homeTeam];
                game.awayTeamLogo = teamLogosById[game.awayTeam];
            }
        
        const fetchGamePostsCount = async (game) => {
          return firestore()
            .collection("votes")
            .doc(game.gameId)
            .collection("gameVotes")
            .doc("info")
            .get()
            .then((snapshot) => {
              if (snapshot.exists) {
                const gameMiscData = snapshot.data();
                game.gamePostsCount = gameMiscData.gamePostsCount
              } else {
                game.gamePostsCount = 0
              }
            });
        };
        
        const addGamePostsCount = async (games) => {
          for (const game of games) {
            await fetchGamePostsCount(game);
          }
        };
        
        await addGamePostsCount(games.flat());
      
        const trendingGames = games.flat().sort((a, b) => a.gameDate.localeCompare(b.gameDate));
        setTrendingGames(trendingGames);
        /*setFutureGames(props.futureGames)
        setFormula1Teams(props.formula1Teams)
        setFormula1Races(props.formula1Races)
        setFormula1Drivers(props.formula1Drivers)
        setFormula1Rankings(props.formula1Rankings)
        setGolfGames(props.golfGames)
        
        if (props.formula1Rankings.length > 2 ) {setFormula1RaceLive(true)}*/

        setLoading(false);
      }

    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Device.isDevice) {
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
            const res = await firestore()
                .collection("users")
                .doc(user.uid)
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

        const currentBadgeNumber = await Notifications.getBadgeCountAsync();
        const nextBadgeNumber = currentBadgeNumber + 1;

        const message = {
            to: token,
            sound: 'default',
            title: 'locctocc',
            body: notification ? notification : '',
            badge: nextBadgeNumber,
            priority: 'high', 
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

         // Update the badge number in the local notification center
         await Notifications.setBadgeCountAsync(nextBadgeNumber);

        
    }

    const sendNotificationToAllUsers = async () => {
        const users = await firestore().collection("users").get();
        users.docs.map((user) => sendNotification(user.data().token))

        await analytics().logEvent('sendNotificationToAllUsers', {user_name: props.currentUser.name})



    };

      const handleSearch = (text) => {
        setSearchText(text);
        const newData = sportGames.filter((item) => {
          const awayData = item.awayTeam ? item.awayTeam.toUpperCase() : '';
          const homeData = item.homeTeam ? item.homeTeam.toUpperCase() : '';
          const textData = text.toUpperCase();
          return awayData.includes(textData) || homeData.includes(textData);
        });
        setFilteredData(newData);
      };


    const browseFunction = () => {

        if (browse == true) {
            setBrowse(false)
        } else {
            setBrowse(true)
            analytics().logEvent('searchGames', {user_name: props.currentUser.name});
            setBlogPreview(false)
        }
    }

    const displayNotificationInput = () => {
        if (notificationCriteria == true) {
            setNotificationCriteria(false)
        } else {
            setNotificationCriteria(true)
        }
    }

    const renderPeppers = (count) => {
        const peppers = [];
        if (count > 6) {
          peppers.push(<FontAwesome5 key={1} name="pepper-hot" size={16} color="#B81D13" />);
          peppers.push(<FontAwesome5 key={2} name="pepper-hot" size={16} color="#B81D13" />);
          peppers.push(<FontAwesome5 key={3} name="pepper-hot" size={16} color="#B81D13" />);
        } else if (count > 4) {
          peppers.push(<FontAwesome5 key={1} name="pepper-hot" size={16} color="orange" />);
          peppers.push(<FontAwesome5 key={2} name="pepper-hot" size={16} color="orange" />);
        } else if (count > 0) {
          peppers.push(<FontAwesome5 key={1} name="pepper-hot" size={16} color="#fed550" />);
        }
        return peppers;
      };

    const setSportFunction = (sport) => {
        if (sport == 'Trending') {setSportGames(trendingGames); analytics().logEvent('selectTrendingGames', { user_name: props.currentUser.name }); setSport('Trending'); setBlogPreview(false)}
        if (sport == 'NFL') {setSportGames(props.nflGames); analytics().logEvent('selectNFLGames', {user_name: props.currentUser.name}); setSport('NFL'); setBlogPreview(false)}
        if (sport == 'NBA') {setSportGames(props.nbaGames); analytics().logEvent('selectNBAGames', {user_name: props.currentUser.name}); setSport('NBA'); setBlogPreview(false)}
        if (sport == 'WNBA') {setSportGames(props.wnbaGames); analytics().logEvent('selectWNBAGames', {user_name: props.currentUser.name}); setSport('WNBA'); setBlogPreview(false)}
        if (sport == 'NHL') {setSportGames(props.nhlGames); analytics().logEvent('selectNHLGames', {user_name: props.currentUser.name}); setSport('NHL'); setBlogPreview(false)}
        if (sport == 'NCAAF') {setSportGames(props.ncaafGames); analytics().logEvent('selectNCAAFGames', {user_name: props.currentUser.name}); setSport('NCAAF'); setBlogPreview(false)}
        if (sport == 'EPL') {setSportGames(props.eplGames); analytics().logEvent('selectEPLGames', {user_name: props.currentUser.name}); setSport('EPL'); setBlogPreview(false)}
        if (sport == 'MLB') {setSportGames(props.mlbGames); analytics().logEvent('selectMLBGames', {user_name: props.currentUser.name}); setSport('MLB'); setBlogPreview(false)}
        if (sport == 'NCAAB') {setSportGames(props.ncaabGames); analytics().logEvent('selectNCAABGames', {user_name: props.currentUser.name}); setSport('NCAAB'); setBlogPreview(false)}
        if (sport == 'UFC') {setSportGames(props.mmaGames); analytics().logEvent('selectUFCGames', {user_name: props.currentUser.name}); setSport('UFC'); setBlogPreview(false)}
        if (sport == 'PGA') {setSportGames(props.golfGames); analytics().logEvent('selectGolfGames', {user_name: props.currentUser.name}); setSport('PGA'); setBlogPreview(false)}
        if (sport == 'Futures') {setSportGames(props.futureGames); analytics().logEvent('selectFuturesGames', {user_name: props.currentUser.name}); setSport('Futures'); setBlogPreview(false)}
        if (sport == 'Formula 1') {setSportGames(props.formula1Races); analytics().logEvent('selectFormula1Games', {user_name: props.currentUser.name}); setSport('Formula 1'); setBlogPreview(false)}
        if (sport == 'Fantasy') {setSportGames(fantasyGames); analytics().logEvent('selectFantasyGames', {user_name: props.currentUser.name}); setSport('Fantasy'); setBlogPreview(false)}
    }

    const nbaIcon = (<Icon name="basketball-outline" color="#ee6730" size={16}/>);
    const wnbaIcon = (<MaterialCommunityIcons name="basketball-hoop-outline" color="#800000" size={16}/>);
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
            sport: 'NBA',
            id: '3',
            icon: nbaIcon
        },
        {
            sport: 'NCAAB',
            id: '4',
            icon: ncaabIcon
        },
        {
            sport: 'NHL',
            id: '5',
            icon: nhlIcon
        },
        {
            sport: 'UFC',
            id: '6',
            icon: mmaIcon
        },
        {
            sport: 'EPL',
            id: '7',
            icon: eplIcon
        },
        
       
     
      ];

      const fantasyList = [
        {
            id: '1',
            gameId: 'startsit2023',
            fantasyTopic: 'Start or Sit',
            sport: 'Fantasy',
            icon: fantasyIcon,
        },
        {
            id: '2',
            gameId: 'dfs2023',
            fantasyTopic: 'Daily Fantasy Sports',
            sport: 'Fantasy',
            icon: fantasyIcon,
        },
        {
            id: '3',
            gameId: 'waiver2023',
            fantasyTopic: 'Waiver Wire',
            sport: 'Fantasy',
            icon: fantasyIcon,
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
        
      ];


      const openAdLink = () => {

        analytics().logEvent('adClick', {user_name: props.currentUser.name, sponsorName: 'betalytics'});
            
        }

        /*<View style={styles.adView}>
        <BannerAd
            unitId={adUnitId}
            sizes={[BannerAdSize.FULL_BANNER]}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true,
            }}
        />
    </View> */

    const renderSportsListItem = ({ item }) => {
        return (
          <View style={item.sport === sport ? styles.sportContainerHighlight : styles.sportContainer}>
            <TouchableOpacity
              style={styles.sportButton}
              onPress={() => {
                setSportFunction(item.sport); 
              }}
            >
              {item.sport !== 'Trending' && <Text>{item.sport}</Text>}
              <Text> {item.icon}</Text>
              {item.sport === 'Trending' && <Text>{item.icon}</Text>}
            </TouchableOpacity>
          </View>
        );
      };

    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.gameContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, gameDate: item.gameDate, homeTeam: item.homeTeam, awayTeam: item.awayTeam, homeSpread: item.homeSpread, awaySpread: item.awaySpread, homeSpreadOdds: item.homeSpreadOdds, awaySpreadOdds: item.awaySpreadOdds, awayMoneyline: item.awayMoneyline, homeMoneyline: item.homeMoneyline, over: item.over, overOdds: item.overOdds, under: item.under, underOdds: item.underOdds, sport: item.sport, homeScore: item.homeScore, awayScore: item.awayScore, awayTeamLogo: item.awayTeamLogo, homeTeamLogo: item.homeTeamLogo })}>
                        <View>
                            <View style={styles.gameDateContainer}>
                                <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                <View style={styles.pepperContainer}>
                                    {renderPeppers(item.gamePostsCount)}
                                </View>
                            </View>
                            <View style={styles.awayGameInfoContainer}>
                                <View style={styles.teamItem}>
                                    <View style={styles.teamNameItem}>
                                        {item.sport == 'mma_mixed_martial_arts' ? null : (
                                        <Image source={{ uri: item.awayTeamLogo }} style={styles.logoImage} />
                                        )}
                                        <View>
                                        <Text style={styles.teamNameText}>{item.awayTeam}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.teamScoreItem}>
                                        {item.awayScore || item.homeScore ? (
                                        <Text style={styles.scoreText}>{item.awayScore}</Text>
                                        ) : null}
                                    </View>
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
                                        {item.sport == 'mma_mixed_martial_arts' ?
                                        null
                                        :
                                        <Image  source={{ uri: item.homeTeamLogo }} style={styles.logoImage} />}
                                        <View>
                                            <Text style={styles.teamNameText}>{item.homeTeam}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.teamScoreItem}>
                                    {item.awayScore || item.homeScore ? <Text style={styles.scoreText}>{item.homeScore}</Text> : null}
                                    </View>
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
                            <View style={styles.gameDateContainer}>
                                <Text style={styles.dateText}>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
                                <View style={styles.pepperContainer}>
                                    {renderPeppers(item.gamePostsCount)}
                                </View>
                            </View>
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
          <TouchableOpacity
            style={styles.listGameContainer}
            onPress={() =>
              props.navigation.navigate("game", { gameId: item.gameId, sport: item.sport })
            }
          >
            <View style={styles.listOddsContainer}>
              <View style={styles.listOddsLeft}>
                <Text style={styles.listPlayerName}>{item.playerName}</Text>
              </View>
              <View style={styles.listOddsRight}>
                <Text style={styles.listOddsText}>
                  {item.playerOdds > 0 ? "+" : ""}
                  {item.playerOdds}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      };

    const renderFutureItem = ({ item }) => {
        return (
            <View>
                <View style={styles.listGameContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, sport: item.futureSport })}>
                        <View style={styles.listOddsContainer}>
                            <View style={styles.listOddsLeft}>
                                <Text style={styles.listPlayerText}>{item.futureSport}  {item.icon}</Text>
                            </View>
                            <View>
                                
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderFantasyItem = ({ item }) => {
        return (
            <View style={styles.listGameContainer}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('game', {gameId: item.gameId, sport: item.sport, fantasyTopic: item.fantasyTopic })}>
                    <View style={styles.listOddsContainer}>
                        <Text style={styles.listPlayerText}>{item.fantasyTopic}</Text>
                        <Text style={styles.listPlayerText}>{item.icon}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    
    
      return (
        <View style={styles.container}>
            <AnnouncementModal
                showAnnouncement={showAnnouncement}
                onClose={() => setShowAnnouncement(false)}
            />
            {user.uid == 'U6u9pFuuwLVEn97z76a07WHK1V63' ?
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
                    value={searchText}
                    onChangeText={handleSearch}
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
                <Text style={styles.gameHeaderText}>US Tournament Lines - Winner</Text>
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
                data={searchText ? filteredData : sportGames.sort((a, b) => a.gameDate.localeCompare(b.gameDate))}
                style={styles.feed}
                renderItem={renderItem}

            />
            

            }
            {blogPreview == true ? 
            <View style={styles.blogContainer}>
                <LatestBlogPreview blogDetails={blogDetails} />
            </View> : null }
            <View style={styles.adView}>
                <BannerAd
                    unitId={adUnitId}
                    sizes={[BannerAdSize.FULL_BANNER]}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
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
    blogContainer: {
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
        backgroundColor: "#ffffff",
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 10,
        elevation: 2,
      },
      listOddsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderTopWidth: 0.5,
        borderTopColor: "#ccc",
      },
      listOddsLeft: {
        flex: 1,
      },
      listPlayerName: {
        fontWeight: "bold",
        fontSize: 14,
      },
      listOddsRight: {
        flex: 1,
        alignItems: "flex-end",
      },
      listOddsText: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#009387",
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
            alignItems: 'center',
            paddingRight: 2,
            justifyContent: "space-between",
          },
        teamNameItem: {
            backgroundColor: "#ffffff",
            flexDirection: 'row',
            paddingRight: 2,
            alignItems: 'center',
            width: '80%'
          },
        teamNameText: {
            flexWrap: 'wrap', // Allow the team name text to wrap
        },
        teamScoreItem: {
            alignItems: 'center',
            justifyContent: 'flex-end'
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
        justifyContent: "center",
        alignItems: 'center'
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
    },
    logoImage: {
        resizeMode: "contain",
        width: 30,
        height: 30,
        marginRight: 10,
    },
    
})

const mapStateToProps = (store) => ({
    eplGames: store.eplGamesState.eplGames,
    nflGames: store.nflGamesState.nflGames,
    nbaGames: store.nbaGamesState.nbaGames,
    nhlGames: store.nhlGamesState.nhlGames,
    ncaabGames: store.ncaabGamesState.ncaabGames,
    mmaGames: store.mmaGamesState.mmaGames,
    teamLogos: store.teamLogosState.teamLogos,
    allUsers: store.userState.allUsers,
    currentUser: store.userState.currentUser,


})

export default connect(mapStateToProps)(Odds);