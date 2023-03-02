import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'

import { useNavigation } from '@react-navigation/native';

import analytics from "@react-native-firebase/analytics";

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function Standings(props) {

    const [formula1Teams, setFormula1Teams] = useState([]);
    const [formula1Drivers, setFormula1Drivers] = useState([]);
    const [formula1Rankings, setFormula1Rankings] = useState([]);
    const [standingsCategory, setStandingsCategory] = useState('');

    const { standingsType } = props.route.params;

    useEffect(() => {
        analytics().logScreenView({ screen_name: 'F1 Standings', screen_class: 'F1 Standings',  user_name: props.currentUser.name})

        setFormula1Teams(props.formula1Teams)
        setFormula1Drivers(props.formula1Drivers.slice(0, 20))
        setFormula1Rankings(props.formula1Rankings.slice(0, 20))
        setStandingsCategory(standingsType)
    }, [])
    
    const navigation = useNavigation();

    const renderFormula1ConstructorItem = ({ item }) => {
        return (
            <View>
                <View style={styles.listGameContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('TeamDetails', 
                        {
                            
                        detailType: 'team',
                        base: item.base, 
                        name: item.name, 
                        chassis: item.chassis, 
                        currentSeasonPoints: item.currentSeasonPoints, 
                        currentSeasonRank: item.currentSeasonRank,
                        director: item.director,
                        engine: item.engine,
                        fastest_laps: item.fastest_laps,
                        first_team_entry: item.first_team_entry,
                        highest_race_finish: item.highest_race_finish,
                        logo: item.logo,
                        pole_positions: item.pole_positions,
                        president: item.president,
                        tyres: item.tyres,
                        world_championships: item.world_championships
                        })}>
                        <View style={styles.formula1Container}>
                            <View style={styles.formula1RankContainer}>
                                <Text style={styles.listFormula1Text}>{item.currentSeasonRank}</Text>
                            </View>
                            <View style={styles.formula1LogoContainer}>
                                <Image 
                                    style={styles.teamLogoContainer}
                                    source={{uri: item.logo}}
                                />
                            </View>
                            <View style={styles.formula1TeamContainer}>
                                <Text style={styles.listFormula1Text}>{item.name}</Text>
                            </View>
                            <View style={styles.formula1PointsContainer}>
                                <Text style={styles.listFormula1Text}>{item.currentSeasonPoints}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderFormula1DriverItem = ({ item }) => {
        return (
            <View>
                <View style={styles.listGameContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('TeamDetails', 
                        {
                        detailType: 'driver',    
                        abbr: item.abbr, 
                        birthdate: item.birthdate, 
                        birthplace: item.birthplace, 
                        careerPoints: item.careerPoints, 
                        country: item.country,
                        currentSeasonPoints: item.currentSeasonPoints,
                        driverId: item.driverId,
                        logo: item.driverImage,
                        driverName: item.driverName,
                        driverNumber: item.driverNumber,
                        driverRank: item.driverRank,
                        driverTeam: item.driverTeam,
                        highest_race_finish: item.highest_race_finish,
                        highestGridPosition: item.highest_grid_position,
                        nationality: item.nationality,
                        numberRaces: item.numberRaces,
                        world_championships: item.world_championships
                        })}>
                        <View style={styles.formula1Container}>
                            <View style={styles.formula1RankContainer}>
                                <Text style={styles.listFormula1Text}>{item.driverRank}</Text>
                            </View>
                            <View style={styles.formula1LogoContainer}>
                                <Image 
                                    style={styles.driverLogoContainer}
                                    source={{uri: item.driverImage}}
                                />
                            </View>
                            <View style={styles.formula1TeamContainer}>
                                <Text style={styles.listFormula1Text}>{item.driverName}</Text>
                            </View>
                            <View style={styles.formula1PointsContainer}>
                                {item.currentSeasonPoints == null ? <Text>0 </Text> : <Text style={styles.listFormula1Text}>{item.currentSeasonPoints}</Text>}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderFormula1LiveRaceItem = ({ item }) => {
        return (
            <View style={styles.listGameContainer}>
                    <View style={styles.formula1Container}>
                        <View style={styles.formula1LiveRankContainer}>
                            <Text style={styles.listFormula1Text}>{item.driverPosition}</Text>
                        </View>
                        <View style={styles.formula1LiveLogoContainer}>
                            <Image 
                                style={styles.driverLogoContainer}
                                source={{uri: item.driverImage}}
                            />
                        </View>
                        <View style={styles.formula1LiveTeamContainer}>
                            <Text style={styles.listFormula1Text}>{item.driverName}</Text>
                            <Text style={styles.listFormula1SubHeader}>{item.driverTeam}</Text>
                        </View>
                        <View style={styles.formula1LivePointsContainer}>
                            {item.time == null ? <Text>-</Text> : <Text style={styles.listFormula1TimeText}>{item.time}</Text>}
                        </View>
                    </View>
            </View>
        )
    }

    return (
        <View style={styles.textInputContainer}>
            {standingsCategory == 'constructor' ? 
            <View>
                <View style={styles.standingsHeaderContainer}>
                    <Text style={styles.standingsHeaderText}>Constructor Standings</Text>
                </View>
                <FlatList 
                    data = {formula1Teams}
                    style={styles.feed}
                    renderItem={renderFormula1ConstructorItem}
                />
            </View>
            
            :
            standingsCategory == 'driver' ? 
            <View>
                <View style={styles.standingsHeaderContainer}>
                    <Text style={styles.standingsHeaderText}>Driver Standings</Text>
                </View>
                <FlatList 
                    data = {formula1Drivers}
                    style={styles.feed}
                    renderItem={renderFormula1DriverItem}
                />
            </View>
            :
            <View>
                <View style={styles.standingsHeaderContainer}>
                    <Text style={styles.standingsHeaderText}>Driver Standings</Text>
                </View>
                <FlatList 
                    data = {formula1Rankings}
                    style={styles.feed}
                    renderItem={renderFormula1LiveRaceItem}
                />
            </View>
             }
           
        </View>
    )
};

const styles = StyleSheet.create({
    textInputContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingBottom: 10
    },
    headerText: {
        fontSize: 16,
    },
    headerContainer: {
        alignItems: 'left'
    },
    listGameContainer: {
        padding: 12,
        marginRight: 2,
        marginLeft: 2,
        borderTopWidth: .8,
        borderTopColor: "#ccc",
        backgroundColor: "#ffffff",
    },
    formula1Container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listFormula1Text: {
        fontSize: 14,
    },
    listFormula1TimeText: {
        fontSize: 12,
    },
    listFormula1SubHeader: {
        fontSize: 12,
        color: "grey"
    },
    teamLogoContainer: {
        width: 80,
        height: 40,
    },
    driverLogoContainer: {
        width: 60,
        height: 50,
    },
    formula1TeamContainer: {
        width: '50%',
        justifyContent: 'center'
    },
    formula1RankContainer: {
        width: '10%',
        justifyContent: 'center'
    },
    formula1LogoContainer: {
        width: '30%',
        justifyContent: 'center'
    },
    formula1PointsContainer: {
        width: '10%',
        justifyContent: 'center'
    },
    formula1LiveTeamContainer: {
        width: '50%',
        justifyContent: 'center'
    },
    formula1LiveRankContainer: {
        width: '5%',
        justifyContent: 'center'
    },
    formula1LiveLogoContainer: {
        width: '25%',
        justifyContent: 'center'
    },
    formula1LivePointsContainer: {
        width: '20%',
        justifyContent: 'center'
    },
    standingsHeaderContainer: {
        paddingVertical: 8,
        marginLeft: '2%',
        alignItems: 'center'
    },
    standingsHeaderText: {
        fontWeight: 'bold',
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    formula1Teams: store.formula1TeamsState.formula1Teams,
    formula1Drivers: store.formula1DriversState.formula1Drivers,
    formula1Rankings: store.formula1RankingsState.formula1Rankings,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps,  mapDispatchProps)(Standings);




