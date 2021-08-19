import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, FlatList, TouchableOpacity } from 'react-native';

import moment from 'moment'

import {AdMobBanner, AdMobInterstitial} from 'expo-ads-admob'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")
import { connect } from 'react-redux'

const listTab = [
        {   
            sport: 'americanfootball_nfl'
        },
        {
            sport: 'MLB'
        },
        {
            sport: 'americanfootball_ncaaf'
        }
    ]

function Odds(props) {

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sport, setSport] = useState('americanfootball_nfl');
    const [datalist, setDatalist] = useState(games);

     useEffect(() => {
        setGames(props.games)
    }, [props.games])

    const setSportFilter = sport => {
        if (sport !== 'All') {
            setDatalist([...games.filter(e => e.sport === sport)])
        } else {
            setDatalist(games)

        }
        setSport(sport)


    }

    const interstitial = async () => {
        await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // Test ID, Replace with your-admob-unit-id
        try {
            await AdMobInterstitial.requestAdAsync();
            await AdMobInterstitial.showAdAsync();
        } catch(error) {
            console.log(e)
        }
    }

    useEffect(() => {
        interstitial();
    }, [])
    

    const renderItem = ({item, index}) => {
        return (
            <View key={index}>
                <View style={styles.gameContainer}>
                    <TouchableOpacity
                        style={styles.gameButton}
                        onPress={() => props.navigation.navigate('game', {gameId: item.gameId, gameDate: item.gameDate, homeTeam: item.homeTeam, awayTeam: item.awayTeam, homeSpread: item.homeSpread, awaySpread: item.awaySpread, homeSpreadOdds: item.homeSpreadOdds, awaySpreadOdds: item.awaySpreadOdds, awayMoneyline: item.awayMoneyline, homeMoneyline: item.homeMoneyline, over: item.over, overOdds: item.overOdds, under: item.under, underOdds: item.underOdds, awayTeamVote: item.awayTeamVote, homeTeamVote: item.homeTeamVote })}>
                        <View>
                            <Text>{moment(item.gameDate).format("LT")}</Text>
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
            <View style={styles.listTab}>
                {
                    listTab.map(e => (
                        <TouchableOpacity 
                            style={[styles.btnTab, sport === e.sport && styles.btnTabActive]}
                            onPress={() => setSportFilter(e.sport)}>
                            {e.sport == "americanfootball_nfl" ?
                                <Text style={styles.textTab, sport === e.sport && styles.textTabActive}>
                                NFL
                                </Text>
                                : 
                                e.sport == "americanfootball_ncaaf" ?
                                <Text style={styles.textTab, sport === e.sport && styles.textTabActive}>
                                NCAAF
                                </Text>
                                : <Text style={styles.textTab, sport === e.sport && styles.textTabActive}>
                                    {e.sport}
                                </Text>
                            }
                        </TouchableOpacity>
                    ))
                }
            </View>            
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
                data={datalist}
                keyExtractor={(e, i) => i.toString()}
                style={styles.feed}
                renderItem={renderItem} 

            />
            <AdMobBanner
                bannerSize="banner"
                adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds // true or false
            />
                
            
        </View>
    )
    
}

const styles = StyleSheet.create({
    
    feed: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 6,
        backgroundColor: "#e1e2e6",
    },
    gameContainer: {
        padding: 6,
        marginVertical:4,
        marginRight: "1%",
        marginLeft: "1%",
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
        width: 160,
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        justifyContent: 'center',
    },
    spreadItem: {
        width: 60,
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    moneylineItem: {
        width: 60,
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    totalItem: {
        width: 60,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    gameHeaderContainer: {
        flexDirection: 'row',
    },
    teamHeader: {
        width: 160,
    },
    spreadHeader: {
        width: 60,
        alignItems: 'center',
    },
    moneylineHeader: {
        width: 60,
        alignItems: 'center',
    },
    totalHeader: {
        width: 60,
        alignItems: 'center',
    },
    teamText: {
    },
    listTab: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 20,
        paddingTop: 5,
    },
    btnTab: {
        width: Dimensions.get('window').width /4,
        flexDirection: 'row',
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 6,
        justifyContent: 'center',
        marginRight: 10,
    },
    textTab: {
        fontSize: 16
    },
    btnTabActive: {
        backgroundColor: 'grey'
    },
    textTabActive: {
        color: '#fff',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    }
    
    
})

const mapStateToProps = (store) => ({
    games: store.gamesState.games,
})


export default connect(mapStateToProps, null)(Odds);
