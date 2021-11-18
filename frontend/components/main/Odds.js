import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, useWindowDimensions, TextInput, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons'

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
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sport, setSport] = useState('');
    const [browse, setBrowse] = useState(false);

     useEffect(() => {
        fetchData()
        setSportGames(props.nflGames)
        setSport('NFL')
    }, [ props.nflGames, props.ncaafGames, props.nbaGames, props.ncaabGames ])

    const fetchData = () => {

        function matchGametoPostCount(postsCount) {
            for (let i = 0; i < props.nflGames.length; i++) {

                if (postsCount.indexOf(props.nflGames[i].gameId) > -1) {
                    console.log(props.nflGames[i].gameId)
                } else {
                    console.log('no match')

                }
                
            }
            setnflGames(props.nflGames)
            setLoading(false)
        }

        firebase.firestore()
        .collectionGroup("votes")
        .orderBy('id', 'desc')
        .get()
        .then((snapshot) => {

            let postsCount = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
                
                matchGametoPostCount(postsCount)

            })

    


        
        setncaafGames(props.ncaafGames)
        setncaabGames(props.ncaabGames)
        setnbaGames(props.nbaGames)
        setLoading(false);
        }
    
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
        if (sport == 'NFL') {setSportGames(props.nflGames); setSport('NFL')}
        if (sport == 'NBA') {setSportGames(props.nbaGames); setSport('NBA')} 
        if (sport == 'NCAAF') {setSportGames(props.ncaafGames); setSport('NCAAF')} 
        if (sport == 'NCAAB') {setSportGames(props.ncaabGames); setSport('NCAAB')}
    }

    const nbaIcon = (<Icon name="basketball-outline" color="#ee6730" size={16}/>);
    const nflIcon = (<Icon name="american-football" color="#825736" size={16}/>);
    const ncaafIcon = (<MaterialCommunityIcons name="football-helmet" color="#00843D" size={16}/>);
    const ncaabIcon = (<MaterialCommunityIcons name="basketball-hoop-outline" color="grey" size={16}/>);

    const sportsList = [
        {
            sport: 'NFL',
            id: '1',
            icon: nflIcon
        },
        {
            sport: 'NBA',
            id: '2',
            icon: nbaIcon
        },
        {
            sport: 'NCAAF',
            id: '3',
            icon: ncaafIcon
        },
        {
            sport: 'NCAAB',
            id: '4',
            icon: ncaabIcon
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
        <View style={styles.sportContainer}>
            <TouchableOpacity
                style={styles.sportButton}
                onPress={() => {setSportFunction(item.sport)}}>
                <Text>{item.sport}</Text>
                <Text> {item.icon}</Text>
            </TouchableOpacity>
        </View>
        
    );
        
    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={styles.gameContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, gameDate: item.gameDate, homeTeam: item.homeTeam, awayTeam: item.awayTeam, homeSpread: item.homeSpread, awaySpread: item.awaySpread, homeSpreadOdds: item.homeSpreadOdds, awaySpreadOdds: item.awaySpreadOdds, awayMoneyline: item.awayMoneyline, homeMoneyline: item.homeMoneyline, over: item.over, overOdds: item.overOdds, under: item.under, underOdds: item.underOdds, awayTeamVote: item.awayTeamVote, homeTeamVote: item.homeTeamVote })}>
                        <View>
                            <Text>{moment(item.gameDate).format('MMMM Do, h:mma')}</Text>
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

    return (
        <View style={styles.container}>
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
            <FlatList 
                data={sportGames}
                style={styles.feed}
                renderItem={renderItem}
                onRefresh={() => fetchNCAABData()}
                refreshing={loading}
    
            />
            <View style={styles.adView}>
                <AdMobBanner
                    bannerSize="banner"
                    adUnitID="ca-app-pub-3940256099942544/2934735716" // Real ID: 8519029912093094/4907013689, test ID: 3940256099942544/2934735716
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
    awayGameInfoContainer: { 
        flexDirection: 'row',
        borderBottomColor: "#e1e2e6",
        borderBottomWidth: 1,
    },
    homeGameInfoContainer: { 
        flexDirection: 'row',
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
    
    
    
})

const mapStateToProps = (store) => ({
    nflGames: store.nflGamesState.nflGames,
    ncaafGames: store.ncaafGamesState.ncaafGames,
    mlbGames: store.mlbGamesState.mlbGames,
    nbaGames: store.nbaGamesState.nbaGames,
    ncaabGames: store.ncaabGamesState.ncaabGames,

})


export default connect(mapStateToProps, null)(Odds);
