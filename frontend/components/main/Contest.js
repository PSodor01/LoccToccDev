import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import {AdMobBanner, AdMobInterstitial} from 'expo-ads-admob'
import Constants from 'expo-constants'

import Leaderboard from 'react-native-leaderboard';

require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

function Contest(props) {
    const [allUsers, setAllUsers] = useState([]);
    const [myScore, setMyScore] = useState([]);

    useEffect(() => {

        const contestParticipants = props.allUsers.filter(user => user.loccMadnessScore != null);
        setAllUsers(contestParticipants.sort((a, b) => parseFloat(b.loccMadnessScore) - parseFloat(a.loccMadnessScore)).slice(0, 50))

        const myScore = props.allUsers.filter(user => user.name == props.currentUser.name);
        setMyScore(myScore)


    }, [props.allUsers, props.currentUser])

    useEffect(() => {

        interstitial()

    }, [])

    const renderMyScore = ({item}) => {
        return (
            <View>
                <Text style={styles.subTitleText}>{item.loccMadnessScore}</Text>
            </View>
        )}

    renderInner = () => (
        <View style={styles.panel}>
          <View >
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Locc Madness</Text>
                <Text>Welcome to Locc Madness: Locctocc's first cash giveaway contest!</Text>
                <Text> </Text>
            </View>
            <View style={{ alignItems: 'center'}}>
                <Text style={styles.panelSubtitle}>Contest Rules</Text>
            </View>
            <View style={{textAlign: 'justify'}}>
                <Text>- Post your locks and engage with other members of the community to earn points</Text>
                <Text>- Contest will run for all of March Madness</Text>
                <Text>- First place receives $150, second place receives $50</Text>
                <Text>- Winner will be notified via email and will have 24 hours to respond</Text>
                <Text>- Prizes will be paid electronically (Venmo, Paypal, etc)</Text>
                <Text>- Locctocc reserves the right to choose a new winner in the event of foul play</Text>
            </View>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => this.bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Let's do it!</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      );
    
      renderHeader = () => (
        <View style={styles.header}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
        </View>
      );

    bs = React.createRef();
    fall = new Animated.Value(1);


    const testBannerID = 'ca-app-pub-3940256099942544/2934735716';
    const productionBannerID = 'ca-app-pub-8519029912093094/1640242937';
    // Is a real device and running in production.
    const adBannerUnitID = Constants.isDevice && !__DEV__ ? productionBannerID : testBannerID;

    const testInterstitialID = 'ca-app-pub-3940256099942544/1033173712';
    const productionInterstitialID = 'ca-app-pub-8519029912093094/2876269149';
    // Is a real device and running in production.
    const adInterstitialUnitID = Constants.isDevice && !__DEV__ ? productionInterstitialID : testInterstitialID;

    const interstitial = async () => {
        await AdMobInterstitial.setAdUnitID(adInterstitialUnitID); // Test ID, Replace with your-admob-unit-id
        try {
            await AdMobInterstitial.requestAdAsync();
            await AdMobInterstitial.showAdAsync();
        } catch(error) {
            console.log(error)
        }
    } 

   
    
    return (
        <View style={styles.textInputContainer}>
            <BottomSheet 
                ref={this.bs}
                snapPoints={[475, -5]}
                renderContent={this.renderInner}
                renderHeader={this.renderHeader}
                initialSnap={1}
                callbackNode={this.fall}
                enabledGestureInteraction={true}       
            />
            <Animated.View style={{ flex:1, opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),}}>
                <View style={styles.headerContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Leaderboard   </Text>
                        <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                            <FontAwesome5 name="info-circle" size={18} justifyContent='center' alignItems='center' color="#2e64e5"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.subTitleText}>CASH PRIZES: $200</Text>
                        
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.subTitleText}>My Score: </Text>
                        <FlatList
                            data ={myScore}
                            renderItem={renderMyScore}
                        />
                    </View>
                </View>
                <Leaderboard 
                    data={allUsers} 
                    sortBy='loccMadnessScore' 
                    labelBy='name'
                    icon='userImg'
                    />
                <View style={styles.adView}>
                    <AdMobBanner
                        bannerSize="banner"
                        adUnitID={adBannerUnitID} // Real ID: 8519029912093094/1666835736, test ID: 3940256099942544/2934735716
                        servePersonalizedAds // true or false
                    />
                </View>
            </Animated.View>
        </View>
        
            
            
    )
};

const styles = StyleSheet.create({
    
    textInputContainer: {
        flex: 1,
        backgroundColor: "#B2DFDB",
        alignItems: 'center',
        justifyContent: 'center',

    },
    scoreContainer: {
        flexDirection: 'row',
    },
    searchResultsText: {
        fontSize: 14,
        padding: 8,
        alignSelf: 'center',
        marginLeft: "5%",
    },
    feed: {
        borderColor: '#e1e2e6',
        backgroundColor: "#B2DFDB",

    },
    profilePhotoPostContainer: {
        backgroundColor: "#e1e2e6",
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    profilePhotoContainer: {

    },
    feedItem:{
        padding:2,
        marginVertical:2,
        marginHorizontal:5, 
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#e1e2e6',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff'
    },
    postLeftContainer: {
        flexDirection: "row",
    },
    titleText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    subTitleText: {
        fontSize: 14,
        color: 'black',    
        fontWeight: 'bold', 
    },
    headerContainer: {
        paddingBottom: 10,
        paddingTop: 5,
        marginLeft: "5%",
    },
    titleContainer: {
        flexDirection: 'row',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: "5%"
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 20,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#2e64e5',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    adView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    
})

const mapStateToProps = (store) => ({
    allUsers: store.userState.allUsers,
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(Contest);


