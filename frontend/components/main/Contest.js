import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import {AdMobBanner, AdMobInterstitial} from 'expo-ads-admob'
import Constants from 'expo-constants'

import Leaderboard from 'react-native-leaderboard';

import * as Analytics from 'expo-firebase-analytics';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

function Contest(props) {
    const [allUsers, setAllUsers] = useState([]);
    const [myScore, setMyScore] = useState([]);

    useEffect(() => {

        const contestParticipants = props.allUsers.filter(user => user.masters2022Score != null);
        setAllUsers(contestParticipants.sort((a, b) => parseFloat(b.masters2022Score) - parseFloat(a.masters2022Score)).slice(0, 50))

        const myScore = props.allUsers.filter(user => user.name == props.currentUser.name);
        setMyScore(myScore)


    }, [props.allUsers, props.currentUser])

    useEffect(() => {

        interstitial()
        Analytics.logEvent('screen_view', { screen_name: 'Contest' })

    }, [])

    const renderMyScore = ({item}) => {
        return (
            <View>
                <Text style={styles.subTitleText}>{item.masters2022Score}</Text>
            </View>
        )}

    const countInfoClicks = () => {
        Analytics.logEvent('contestInfoClicks', {});
    }

    const countWebsiteClicks = () => {

        Analytics.logEvent('websiteClicks', {});


        firebase.firestore()
            .collection("brandClicks")
            .doc('tropicalBros')
            .update({
                website: firebase.firestore.FieldValue.increment(1),
            })

        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                masters2022Score: firebase.firestore.FieldValue.increment(10)
            })
    }

    const countInstagramClicks = () => {

        Analytics.logEvent('instagramClicks', {});

        firebase.firestore()
            .collection("brandClicks")
            .doc('tropicalBros')
            .update({
                instagram: firebase.firestore.FieldValue.increment(1)
            })

        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                masters2022Score: firebase.firestore.FieldValue.increment(10)
            })
    }

    renderInner = () => (
        <View style={styles.panel}>
          <View >
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Locctocc Cash Contest</Text>
                <Text>Masters and MLB Opening Weekend</Text>
                <Text> </Text>
            </View>
            <View style={{ alignItems: 'center'}}>
                <Text style={styles.panelSubtitle}>Contest Rules</Text>
            </View>
            <View style={{textAlign: 'justify'}}>
                <Text>- Post your locks and engage with other members of the community to earn points</Text>
                <Text>- Contest will run for the duration of the Masters tournament</Text>
                <Text>- First place: $150, second place: $50</Text>
                <Text>- Winners will be announced on our IG and notified via email and will have 24 hours to respond</Text>
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
                    <View>
                        <Image 
                            style={{ width: 130, height: 100, marginBottom: 5, marginRight: 10, }}
                            source={require('../../assets/tropBrosLogo.png')}
                        />
                    </View>
                    <View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>CASH PRIZES: $200  </Text>
                            <TouchableOpacity onPress={() => {this.bs.current.snapTo(0); countInfoClicks()}}
                            >
                                <FontAwesome5 name="info-circle" size={18} justifyContent='center' alignItems='center' color="#2e64e5"/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.subTitleText}>My Score: </Text>
                            <FlatList
                                data ={myScore}
                                renderItem={renderMyScore}
                            />
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.subTitleText}> </Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.subTitleText}>Presented by:</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <TouchableOpacity
                                style={styles.linkText}>
                                    <Text style={styles.linkText}
                                onPress={() => {
                                countWebsiteClicks()
                                Linking.openURL('https://tropicalbros.com');
                                }}>
                                www.TROPICALBROS.com</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContainer}>
                            <TouchableOpacity
                                style={styles.linkText}>
                                    <Text style={styles.linkText}
                                onPress={() => {
                                countInstagramClicks()
                                Linking.openURL('https://www.instagram.com/tropical.bros/');
                                }}>
                                Follow!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.brandTextContainer}>
                    <Text style={styles.brandText}>Enjoy Life in Style with Tropical Bros laid back lifestyle golf and beachwear. We deliver the highest quality products with the coolest designs at the most competitive prices.  Stay Tropical. </Text>
                </View>
                </View>
                <Leaderboard 
                    data={allUsers} 
                    sortBy='masters2022Score' 
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
    brandText: {
        fontSize: 11,
        textAlign: 'justify'
    },
    linkText: {
        color: 'blue',
    },
    brandTextContainer: {
        justifyContent: 'center',
        width: "95%"
    },
    
})

const mapStateToProps = (store) => ({
    allUsers: store.userState.allUsers,
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(Contest);


