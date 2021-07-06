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
                <View>
                    <Text style={styles.textStyle}>{id}</Text>
                    <Text style={styles.textStyle}>{sites[0].site_nice}</Text>
                    <Text style={styles.textStyle}>{moment(commence_time).format("MMM Do YYYY")}</Text>
                    <Text style={styles.textStyle}>{JSON.stringify(teams)}</Text>
                    <Text style={styles.textStyle}>{sites[0].odds.spreads.odds}</Text>
                    <Text style={styles.textStyle}>{sites[0].odds.spreads.points}</Text>
                </View>
                
    )
    
}}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: "#ffffff",
    },
    gameContainer: {
        padding:6,
        marginVertical:10,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: "#fff",
    },
    gameButton: {
        flexDirection: 'row',
    },
    gameItem:{
        padding:4,
        marginHorizontal:5,
    },
    gameHeaderText: {
        fontWeight: "bold",
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#eee',
        alignItems: 'center',
        marginTop: 10,
      },
    
    
})


