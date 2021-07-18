import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';

import moment from 'moment'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource: [],
        }
    }

    componentDidMount() {
        const url = "https://api.the-odds-api.com/v3/odds/?apiKey=32537244e2372228d57f009ba53a1d46&sport=basketball&region=us&mkt=spreads&oddsFormat=american&dateFormat=iso"
        fetch(url, {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log("res after api call ==>", responseJson)
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.data,
                }, function(){

                })
        })
        .catch(error=>console.log(error))
    }

    

    //https://api.the-odds-api.com/v3/odds/?apiKey=32537244e2372228d57f009ba53a1d46&sport=basketball&region=us&mkt=totals&oddsFormat=american

    render() {

        
            return (
                <View style={styles.container}>
                    <Text style={{fontSize: 24, marginBottom: '5%', fontWeight: 'bold'}}>Upcoming Games</Text>
                    
                    <FlatList 
                        data={this.state.dataSource}
                        keyExtractor={({id}, index) => id}
                        renderItem={({item}) => 
                        <View>
                            <Text>{item.id}</Text>
                            <Text>{item.sites[1].site_nice}</Text>
                            <View style={styles.gameContainer}>
                                <TouchableOpacity
                                    style={styles.gameButton}
                                    onPress={() => this.props.navigation.navigate('game', {gameId: item.id, site: item.sites[1].site_nice, date: item.commence_time, homeTeam: item.teams[1], awayTeam: item.teams[0], homeMoneyline: item.sites[1].odds.spreads.odds[1], awayMoneyline: item.sites[1].odds.spreads.odds[0], homeSpread: item.sites[1].odds.spreads.points[1], awaySpread: item.sites[1].odds.spreads.points[0] })}>
                                    <Text>{moment(item.commence_time).format("MMM Do")}</Text>
                                    <View style={styles.gameInfoContainer}>
                                        <View style={styles.gameItem}>
                                            <Text style={styles.gameHeaderText}>Team</Text>
                                            <Text>{item.teams[0]}</Text>
                                            <Text>{item.teams[1]}</Text>
                                        </View>
                                        <View style={styles.gameItem}>
                                            <Text style={styles.gameHeaderText}>Moneyline</Text>
                                            <Text style={styles.oddsText}>{item.sites[1].odds.spreads.odds[0]}</Text>
                                            <Text style={styles.oddsText}>{item.sites[1].odds.spreads.odds[1]}</Text>
                                        </View>
                                        <View style={styles.gameItem}>
                                            <Text style={styles.gameHeaderText}>Spread</Text>
                                            <Text style={styles.oddsText}>{item.sites[1].odds.spreads.points[0]}</Text>
                                            <Text style={styles.oddsText}>{item.sites[1].odds.spreads.points[1]}</Text>
                                        </View>
                                        <View style={styles.gameItem}>
                                            <Text style={styles.gameHeaderText}>Total</Text>
                                            <Text style={styles.oddsText}>{}</Text>
                                        </View>
                                    </View>
                                    
                                </TouchableOpacity>
                            
                            
                        </View>
                        </View>
                        
                        
                        }
                        

                    />
                </View>
            )
        }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        backgroundColor: "#ffffff",
    },
    gameContainer: {
        padding:6,
        marginVertical:10,
        marginRight: "2%",
        marginLeft: "2%",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: "#ffffff",

    },
    gameButton: {
    },
    gameInfoContainer: {
        flexDirection: 'row',
    },
    gameItem:{
        padding:4,
        marginHorizontal:5,
    },
    gameHeaderText: {
        fontWeight: "bold",
    },
    oddsText: {
        textAlign: 'right',
    }
    
    
})

