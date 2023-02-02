import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'

import { useNavigation } from '@react-navigation/native';

import analytics from "@react-native-firebase/analytics";

import moment from 'moment'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function TeamDetails(props) {

    const [detailCategory, setDetailCategory] = useState('');

    const {
        detailType,
        base, 
        name, 
        chassis,
        currentSeasonRank,
        currentSeasonPoints, 
        director, 
        engine, 
        fastest_laps, 
        first_team_entry, 
        highest_race_finish,
        logo,
        pole_positions,
        president,
        tyres,
        world_championships,

        abbr, 
        birthdate, 
        birthplace, 
        careerPoints, 
        country,
        driverId,
        driverName,
        driverNumber,
        driverRank,
        driverTeam,
        highestGridPosition,
        nationality,
        numberRaces,
    } = props.route.params;

    useEffect(() => {
        analytics().logScreenView({ screen_name: 'TeamDetails', screen_class: 'TeamDetails',  user_name: props.currentUser.name})

        setDetailCategory(detailType)
    }, [])
    
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.textInputContainer}>
        {detailCategory == 'team' ? 
        <View>
            <View style={styles.teamLogoContainer}>
                <Image 
                    style={styles.teamLogo}
                    source={{uri: logo}}
                />
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Team</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{name}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Rank</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{currentSeasonRank}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Points</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{currentSeasonPoints}</Text>
                </View>
            </View>
            <Text></Text>
            <View style={styles.borderView}></View>
            <Text></Text>
            
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Team Details</Text>
            </View>
            <Text></Text>
            <View style={styles.teamContainer} >
            <View style={styles.headerView}>
                <Text style={styles.detailsHeader}>Base</Text>
            </View>
            <View style={styles.detailsView}>
                <Text style={styles.detailsText}>{base}</Text>
            </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Team Principal</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{director}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>President</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{president}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>First Year</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{first_team_entry}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>World Championships</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{world_championships}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Fastest Laps</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{fastest_laps}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Pole Positions</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{pole_positions}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Best Finish</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{highest_race_finish}</Text>
                </View>
            </View>
            <Text></Text>
            <View style={styles.borderView}></View>
            <Text></Text>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Car Details</Text>
            </View>
            <Text></Text>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Engine</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{engine}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Tyres</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{tyres}</Text>
                </View>
            </View>
            
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Chassis</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{chassis}</Text>
                </View>
            </View>
        </View>
            
        :

        <View>
            <View style={styles.teamLogoContainer}>
                <Image 
                    style={styles.driverLogo}
                    source={{uri: logo}}
                />
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Name</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{driverName}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Rank</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{driverRank}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Points</Text>
                </View>
                <View style={styles.detailsView}>
                {currentSeasonPoints == null ? <Text>0</Text> : <Text style={styles.detailsText}>{currentSeasonPoints}</Text>}
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Team</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{driverTeam}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Number</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{driverNumber}</Text>
                </View>
            </View>
            <Text></Text>
            <View style={styles.borderView}></View>
            <Text></Text>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Player Info</Text>
            </View>
            <Text></Text>
            <View style={styles.teamContainer} >
            <View style={styles.headerView}>
                <Text style={styles.detailsHeader}>Birthdate</Text>
            </View>
            <View style={styles.detailsView}>
                <Text style={styles.detailsText}>{moment(birthdate).format('MMMM Do, YYYY')}</Text>
            </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Birthplace</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{birthplace}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Home Country</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{country}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Nationality</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{nationality}</Text>
                </View>
            </View>
            <Text></Text>
            <View style={styles.borderView}></View>
            <Text></Text>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Career</Text>
            </View>
            <Text></Text>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>World Championships</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{world_championships}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Best Finish</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{highest_race_finish}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Best Grid Position</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{highestGridPosition}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Number of Races</Text>
                </View>
                <View style={styles.detailsView}>
                    <Text style={styles.detailsText}>{numberRaces}</Text>
                </View>
            </View>
            <View style={styles.teamContainer} >
                <View style={styles.headerView}>
                    <Text style={styles.detailsHeader}>Career Points</Text>
                </View>
                <View style={styles.detailsView}>
                    {careerPoints == null ? <Text>0</Text> : <Text style={styles.detailsText}>{careerPoints}</Text>}
                </View>
            </View>
        </View>
        }
            
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    textInputContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    teamLogo: {
        width: 200,
        height: 100,
    },
    driverLogo: {
        width: 150,
        height: 150,
    },
    teamLogoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '4%'
    },
    teamContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: '1%',
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
        width: '45%',

    }
    
   
    
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps,  mapDispatchProps)(TeamDetails);




