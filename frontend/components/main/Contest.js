import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Linking, Alert } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { Avatar } from 'react-native-elements';

import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import analytics from "@react-native-firebase/analytics";
import { BannerAdSize, TestIds, BannerAd } from 'react-native-google-mobile-ads';

import { connect } from 'react-redux'

function Contest(props) {
    const [allUsers, setAllUsers] = useState([]);
    const [myScore, setMyScore] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fieldName = getFieldName(); // Use the helper function to get the dynamic field name
    
        const contestParticipants = props.allUsers.filter(user => user[fieldName] != null);
        setAllUsers(contestParticipants.sort((a, b) => parseFloat(b[fieldName]) - parseFloat(a[fieldName])).slice(0, 99));
    
        const myScore = props.allUsers.filter(user => user.name === props.currentUser.name);
        setMyScore(myScore);
    
        analytics().logScreenView({
          screen_name: 'Contest',
          screen_class: 'Contest',
          user_name: props.currentUser.name,
        });
    
      }, [props.allUsers, props.currentUser]);
    
      const getFieldName = () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so we add 1
        return `alltimeLeaders_${currentYear}_${currentMonth}`;
      };

      const getFormattedDate = () => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().toLocaleString('default', { month: 'short' }); // Get short month name
        return `${currentMonth} ${currentYear}`;
      };
    
      const renderMyScore = ({ item }) => (
        <View>
          {item[getFieldName()] != null ? (
            <Text style={styles.subTitleText}>{item[getFieldName()]}</Text>
          ) : (
            <Text style={styles.subTitleText}>0</Text>
          )}
        </View>
      );
    

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

    const bottomSheetModalRef = useRef(null)

    const snapPoints = ["40%", "95%"]

    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
        setIsOpen(true);
    }

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
            <Text style={leaderboardStyles.userScore}>{item[getFieldName()] || '0'}</Text>
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
    
    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    backgroundStyle={{ borderRadius: 50, backgroundColor: "#E8E8E8"}}
                    onDismiss={() => setIsOpen(false)}
                >
                    <View style={styles.panel}>
                        <View style={styles.panelContent}>
                            <Text style={styles.panelTitle}>Locctocc Leaderboard</Text>
                            <View style={styles.panelDescription}>
                                <Text style={styles.descriptionText}>
                                    - Post your locks and engage with other members of the community to participate
                                </Text>
                                <Text style={styles.descriptionText}>
                                    - Earn points by posting, collecting hammers, and gaining followers!
                                </Text>
                                <Text style={styles.descriptionText}>
                                    - Lose points by getting/giving fades - don't make enemies!
                                </Text>
                            </View>
                        </View>
                    </View>
            </BottomSheetModal>
        <View style={styles.textInputContainer}>
        <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Locctocc Leaderboard - {getFormattedDate()} </Text>
                        <TouchableOpacity onPress={() => {handlePresentModal(); countInfoClicks()}}
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
                        </View>
                </View>
            </View>
    </View>
                <FlatList
                data = {allUsers}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                
            /> 
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
        </BottomSheetModalProvider>
            
    )
    
};

const styles = StyleSheet.create({
    
    textInputContainer: {
        flex: 1,
        backgroundColor: "#B2DFDB",
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
        backgroundColor: '#E8E8E8',
        width: '100%',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelContent: {
        alignItems: 'center',
    },
    panelTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    panelDescription: {
        marginTop: 10,
    },
    descriptionText: {
        textAlign: 'justify',
        marginBottom: 5,
        fontSize: 16,
        lineHeight: 22,
        color: '#555555',
    },
    adView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkText: {
        color: 'blue',
        fontSize: 14,
    },
   
    
  
    
})

const mapStateToProps = (store) => ({
    allUsers: store.userState.allUsers,
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(Contest);