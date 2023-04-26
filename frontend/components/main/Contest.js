import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Linking, Alert } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Avatar } from 'react-native-elements';

import analytics from "@react-native-firebase/analytics";
import { BannerAdSize, TestIds, BannerAd } from 'react-native-google-mobile-ads';


import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

function Contest(props) {
    const [allUsers, setAllUsers] = useState([]);
    const [myScore, setMyScore] = useState([]);
    const [contestLive, setContestLive] = useState();
    const [showInterstitial, setShowInterstitial] = useState(false);

    useEffect(() => {

        if (props.contestStatus.contestLive == true) {
            setContestLive(true)
        } else {
            setContestLive(false)
        }

        const contestParticipants = props.allUsers.filter(user => user.loccMadness2023Score != null);
        setAllUsers(contestParticipants.sort((a, b) => parseFloat(b.loccMadness2023Score) - parseFloat(a.loccMadness2023Score)).slice(0, 100))

        const myScore = props.allUsers.filter(user => user.name == props.currentUser.name);
        setMyScore(myScore)

        analytics().logScreenView({ screen_name: 'Contest', screen_class: 'Contest',  user_name: props.currentUser.name})

    }, [props.allUsers, props.currentUser, props.contestStatus])

    const renderMyScore = ({item}) => {
        return (
            <View>
            {item.loccMadness2023Score != null ?
            <Text style={styles.subTitleText}>{item.loccMadness2023Score}</Text>
            :
            <Text style={styles.subTitleText}>0</Text>

            }
            </View>
    )}
    

    const countInfoClicks = () => {
        analytics().logEvent('contestInfoClicks', {user_name: props.currentUser.name});
    }

    const countWebsiteClicks = async () => {
        const url = 'https://www.snackmagic.com/?grsf=613qvn';
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }

        analytics().logEvent('websiteClicks', {user_name: props.currentUser.name});
        

    }

    const countLocctoccInstagramClicks = () => {

        analytics().logEvent('locctoccInstagramClicks', {user_name: props.currentUser.name});
        
    }

    const countLocctoccTwitterClicks = () => {

        analytics().logEvent('locctoccTwitterClicks', {user_name: props.currentUser.name});
        
    }

    const countLocctoccTiktokClicks = () => {

        analytics().logEvent('locctoccTiktokClicks', {user_name: props.currentUser.name});
     
    }

    renderInner = () => (
        <View style={styles.panel}>
          <View >
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>Locc Madness</Text>
                <Text> </Text>
            </View>
            <View style={{ alignItems: 'center'}}>
                <Text style={styles.panelSubtitle}>Contest Rules</Text>
                <Text></Text>
            </View>
            <View style={{textAlign: 'justify'}}>
                <Text>- Contest will run through the end of March Madness</Text>
                <Text>- Post your locks and engage with other members of the community to participate</Text>
                <Text>- Earn points by posting and collecting hammers, lose points for fades</Text>
                <Text>- Winners will be announced on our IG at the end of the contest</Text>
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

    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8519029912093094/8258310490'
    

    const renderItem = ({ item, index }) => {
        const rowStyle = index % 2 === 0 ? leaderboardStyles.row : leaderboardStyles.rowAlt;
        const indexStyle = index < 9 ? leaderboardStyles.indexSingleDigit : leaderboardStyles.indexDoubleDigit;

    
        return (
          <TouchableOpacity style={rowStyle} onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
             <View style={[leaderboardStyles.indexContainer, indexStyle]}>
                <Text style={leaderboardStyles.index}>{index + 1}</Text>
            </View>
            <Avatar
                source={{ uri: item.userImg }}
                icon={{ name: 'person', type: 'ionicons', color: 'white' }}
                overlayContainerStyle={{ backgroundColor: '#95B9C7' }}
                style={{ marginRight: 10, width: 50, height: 50 }}
                rounded
                size="medium"
                containerStyle={leaderboardStyles.avatarContainer}
            />
            <Text style={leaderboardStyles.userName}>{item.name}</Text>
            <Text style={leaderboardStyles.userScore}>{item.loccMadness2023Score}</Text>
          </TouchableOpacity>
        );
      };

      const leaderboardStyles = {
        container: {
          flex: 1,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: 'white',
        },
        rowAlt: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: '#EFEFEF',
        },
        index: {
            fontWeight: 'bold',
            fontSize: 18,
            marginRight: 4,
            width: 28,
            textAlign: 'center',
        },
        userImg: {
            width: 48,
            height: 48,
            borderRadius: 24,
            marginRight: 12,
        },
        userName: {
            flex: 1,
            fontWeight: 'bold',
            marginRight: 12,
        },
        userScore: {
            fontWeight: 'bold',
            fontSize: 16,
        },
        avatarContainer: {
            marginRight: 10,
            alignSelf: 'flex-start',
          },
        
        indexContainer: {
        minWidth: 22,
        marginRight: 10,
        alignItems: 'center',
        },
    
        indexDoubleDigit: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        },
    
        indexSingleDigit: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        },
      };



    /*const testBannerID = 'ca-app-pub-3940256099942544/2934735716';
    const productionBannerID = 'ca-app-pub-8519029912093094/1640242937';
    // Is a real device and running in production.
    const adBannerUnitID = Device.isDevice && !__DEV__ ? productionBannerID : testBannerID;

    const testInterstitialID = 'ca-app-pub-3940256099942544/1033173712';
    const productionInterstitialID = 'ca-app-pub-8519029912093094/2876269149';
    // Is a real device and running in production.
    const adInterstitialUnitID = Device.isDevice && !__DEV__ ? productionInterstitialID : testInterstitialID;

    const interstitial = async () => {
        await AdMobInterstitial.setAdUnitID(adInterstitialUnitID); // Test ID, Replace with your-admob-unit-id
        try {
            await AdMobInterstitial.requestAdAsync();
            await AdMobInterstitial.showAdAsync();
        } catch(error) {
            console.log(error)
        }
    } */

    /*<View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
            <View>
                <Image 
                    style={{ width: 130, height: 100, marginBottom: 5, marginRight: 10, }}
                    source={require('../../assets/locctocclogo.png')}
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
    
    
    <View style={styles.headerContainer}>
                    <View>
                        <View>
                            <Text style={styles.titleText}>LOCC MADNESS Leaderboard </Text>
                        </View>
                        <View>
                            <View style={styles.titleContainer}>
                                <Text style={styles.subTitleText}>CASH PRIZES: $250  </Text>
                                <TouchableOpacity onPress={() => {this.bs.current.snapTo(0); countInfoClicks()}}
                                >
                                    <FontAwesome5 name="info-circle" size={18} justifyContent='center' alignItems='center' color="#2e64e5"/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>My Score: </Text>
                                <FlatList
                                    data ={myScore}
                                    renderItem={renderMyScore}
                                />
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}> </Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>Follow us for all the latest updates:</Text>
                            </View>
                            <View style={styles.titleContainer}>
                                <View style={styles.infoContainer}>
                                    <TouchableOpacity
                                        style={styles.linkText}
                                        onPress={() => {
                                        countLocctoccInstagramClicks()
                                        Linking.openURL('https://www.instagram.com/locctocc/');
                                        }}>
                                        <FontAwesome5 name="instagram" size={24} justifyContent='center' alignItems='center' color="#E1306C"/>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.infoContainer}>
                                    <TouchableOpacity
                                        style={styles.linkText}
                                        onPress={() => {
                                        countLocctoccTwitterClicks()
                                        Linking.openURL('https://twitter.com/LoccTocc');
                                        }}>
                                        <FontAwesome5 name="twitter" size={24} justifyContent='center' alignItems='center' color="#1DA1F2"/>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.infoContainer}>
                                    <TouchableOpacity
                                        style={styles.linkText}
                                        onPress={() => {
                                        countLocctoccTiktokClicks()
                                        Linking.openURL('https://www.tiktok.com/@locctocc');
                                        }}>
                                        <FontAwesome5 name="tiktok" size={24} justifyContent='center' alignItems='center' color="#000"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>*/

   /* <View style={styles.adView}>
                <AdMobBanner
                    bannerSize="banner"
                    adUnitID={adUnitID} 
                    servePersonalizedAds // true or false
                />
            </View> */
    
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
                
                {contestLive == true ?
                    <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
            <View>
                <TouchableOpacity onPress={() => {countWebsiteClicks()}}>
                    <Image 
                        style={{ width: 130, height: 100, marginBottom: 5, marginRight: 10, }}
                        source={require('../../assets/betalyticsBanner.png')}
                    />
                </TouchableOpacity>
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
                        onPress={() => {countWebsiteClicks()}}>
                        Snack Magic</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
                
                :
                <View style={styles.headerContainer}>
                    <View style={styles.titleContainer}>
                        <View>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>Locctocc Cash Contests  </Text>
                                <TouchableOpacity onPress={() => {this.bs.current.snapTo(0); countInfoClicks()}}>
                                    <FontAwesome5 name="info-circle" size={18} justifyContent='center' alignItems='center' color="#2e64e5"/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>New contests coming soon! Check back here and follow us on social media for updates!</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}> </Text>
                            </View>
                            <View style={styles.titleContainer}>
                                <View style={styles.infoContainer}>
                                    <TouchableOpacity
                                        style={styles.linkText}
                                        onPress={() => {
                                        countLocctoccInstagramClicks()
                                        Linking.openURL('https://www.instagram.com/locctocc/');
                                        }}>
                                        <FontAwesome5 name="instagram" size={24} justifyContent='center' alignItems='center' color="#E1306C"/>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.infoContainer}>
                                    <TouchableOpacity
                                        style={styles.linkText}
                                        onPress={() => {
                                        countLocctoccTwitterClicks()
                                        Linking.openURL('https://twitter.com/LoccTocc');
                                        }}>
                                        <FontAwesome5 name="twitter" size={24} justifyContent='center' alignItems='center' color="#1DA1F2"/>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.infoContainer}>
                                    <TouchableOpacity
                                        style={styles.linkText}
                                        onPress={() => {
                                        countLocctoccTiktokClicks()
                                        Linking.openURL('https://www.tiktok.com/@locctocc');
                                        }}>
                                        <FontAwesome5 name="tiktok" size={24} justifyContent='center' alignItems='center' color="#000"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>Previous contest leaderboard:</Text>
                            </View>
                        </View>
                    </View>
                </View>
                
                }
                
                <FlatList
                data = {allUsers}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                
            /> 
                
                
                
            </Animated.View>
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
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    subTitleText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    infoText: {
        fontSize: 14,
        color: 'black',    
        fontWeight: 'bold', 
    },
    headerContainer: {
        paddingBottom: 10,
        paddingTop: 5,
        marginLeft: "5%",
    },
    noContestContainer: {
        flex: 1,
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
        width: "60%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandText: {
        fontSize: 11,
        textAlign: 'justify'
    },
    linkText: {
        color: 'blue',
        fontSize: 14,
    },
    brandTextContainer: {
        justifyContent: 'center',
        width: "95%"
    },
    
})

const mapStateToProps = (store) => ({
    allUsers: store.userState.allUsers,
    currentUser: store.userState.currentUser,
    contestStatus: store.userState.contestStatus,
})

export default connect(mapStateToProps)(Contest);