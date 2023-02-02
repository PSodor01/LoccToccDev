import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, Image, Linking, Share } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import { FontAwesome5 } from "@expo/vector-icons";

import moment from 'moment'

import analytics from "@react-native-firebase/analytics";

import { captureRef } from 'react-native-view-shot';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

function SocialShare(props) {
    const [showInstagramStory, setShowInstagramStory] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);

    const { gameId, gameDate, homeTeam, awayTeam, homeMoneyline, awayMoneyline, homeSpread, awaySpread, homeSpreadOdds, awaySpreadOdds, over, overOdds, under, underOdds, drawMoneyline, sport,
        posterName, postCreation, postCaption, posterImg, postImg, userTagList, likesCount, fadesCount, comment}= props.route.params;

    useEffect(() => {

        analytics().logScreenView({ screen_name: 'SocialShare', screen_class: 'SocialShare',  user_name: props.currentUser.name})

    }, [props.allUsers])

    useEffect(() => {
 

    }, [])
    
    const viewRef = useRef();

    const onShare = async () => {

        analytics().logEvent('socialShare', { user_name: props.currentUser.name })
        
        try {
            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 0.7
            });
            const result = await Share.share({
                message:`Check out this lock on @locctocc`,
                title:"",
                url: uri
            });
    
            if (result.action === Share.sharedAction) {
                alert("Nice!")
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                //alert("Post cancelled")
            }
            } catch (error) {
            alert(error.message);
            }
      };
            

    const testFunction = () => {
        console.log(showInstagramStory)
    }


    return (
        <ScrollView style={styles.gameContainer}>
            <View ref={viewRef} style={styles.shareImage}>
                <View style={styles.logoHeader}>
                    <Text style={styles.headerName}>locctocc </Text>
                    <FontAwesome5 style={styles.headerLogo} name="comment-dollar"  />
                </View>
                <View>
                        {sport == 'US Masters Tournament Lines - Winner' || 
                        sport == 'NFL - Suberbowl Champion' ||
                        sport == 'MLB - World Series Winner' ||
                        sport == 'NBA - Championship' ||
                        sport == 'NHL - Stanley Cup Winner' 
                        ?
                        
                        <View style={styles.gameHeaderContainer}>
                            <Text style={styles.gameHeaderText}>{sport}</Text>
                        </View>
                        :
                        <View></View> 
                        
                        }
                        <View>
                            {sport == 'formula1' ?
                            <View>
                                <View style={styles.teamContainer} >
                                    <View style={styles.headerView}>
                                        <Text style={styles.detailsHeader}>Race</Text>
                                    </View>
                                    <View style={styles.detailsView}>
                                        <Text style={styles.detailsText}>{props.formula1Races.raceName}</Text>
                                    </View>
                                </View>
                                <View style={styles.teamContainer} >
                                    <View style={styles.headerView}>
                                        <Text style={styles.detailsHeader}>Track</Text>
                                    </View>
                                    <View style={styles.detailsView}>
                                        <Text style={styles.detailsText}>{props.formula1Races.trackName}</Text>
                                    </View>
                                </View>
                                <View style={styles.teamContainer} >
                                    <View style={styles.headerView}>
                                        <Text style={styles.detailsHeader}>City</Text>
                                    </View>
                                    <View style={styles.detailsView}>
                                        <Text style={styles.detailsText}>{props.formula1Races.raceCity}</Text>
                                    </View>
                                </View>
                                <View style={styles.teamContainer} >
                                    <View style={styles.headerView}>
                                        <Text style={styles.detailsHeader}>Country</Text>
                                    </View>
                                    <View style={styles.detailsView}>
                                        <Text style={styles.detailsText}>{props.formula1Races.raceCountry}</Text>
                                    </View>
                                </View>
                                <View style={styles.teamContainer} >
                                    <View style={styles.headerView}>
                                        <Text style={styles.detailsHeader}>Distance</Text>
                                    </View>
                                    <View style={styles.detailsView}>
                                        <Text style={styles.detailsText}>{props.formula1Races.raceDistance}</Text>
                                    </View>
                                </View>
                                <View style={styles.teamContainer} >
                                    <View style={styles.headerView}>
                                        <Text style={styles.detailsHeader}>Total Laps</Text>
                                    </View>
                                    <View style={styles.detailsView}>
                                        <Text style={styles.detailsText}>{props.formula1Races.totalLaps}</Text>
                                    </View>
                                </View>
                            </View>
                            

                            :

                            sport == 'soccer_epl' ? 
                            <View>
                                
                                <View style={styles.awayGameInfoContainer}>
                                    <View style={styles.teamItem}>
                                        <Text style={styles.teamText}>{awayTeam}</Text>
                                    </View>
                                    <View style={styles.moneylineItem}>
                                        {awayMoneyline > 0 ? 
                                            <Text style={styles.spreadText}>+{awayMoneyline}</Text> 
                                            : <Text style={styles.spreadText}>{awayMoneyline}</Text>
                                        }
                                    </View>
                                    <View style={styles.totalItem}>
                                        <Text style={styles.spreadText}>{over}</Text>
                                        {overOdds > 0 ? 
                                            <Text style={styles.oddsTopRowText}>+{overOdds}</Text> 
                                            : <Text style={styles.oddsTopRowText}>{overOdds}</Text>
                                        }
                                    </View>
                                </View>
                                <View style={styles.awayGameInfoContainer}>
                                    <View style={styles.teamItem}>
                                        <Text style={styles.teamText}>{homeTeam}</Text>
                                    </View>
                                    <View style={styles.moneylineItem}>
                                        {homeMoneyline > 0 ? 
                                            <Text style={styles.spreadText}>+{homeMoneyline}</Text> 
                                            : <Text style={styles.spreadText}>{homeMoneyline}</Text>
                                        }
                                    </View>
                                    <View style={styles.totalItem}>
                                        <Text style={styles.spreadText}>{under}</Text> 
                                        {underOdds > 0 ?
                                            <Text style={styles.oddsBottomRowText}>+{underOdds}</Text>
                                            : <Text style={styles.oddsBottomRowText}>{underOdds}</Text>
                                        }
                                    </View>
                                </View>
                                <View style={styles.homeGameInfoContainer}>
                                    <View style={styles.teamItem}>
                                        <Text style={styles.teamText}>Draw</Text>
                                    </View>
                                    <View style={styles.moneylineItem}>
                                        {drawMoneyline > 0 ? 
                                            <Text style={styles.spreadText}>+{drawMoneyline}</Text> 
                                            : <Text style={styles.spreadText}>{drawMoneyline}</Text>
                                        }
                                    </View>
                                    <View style={styles.totalItem}>
                                        <Text style={styles.spreadText}>{under}</Text> 
                                        {underOdds > 0 ?
                                            <Text style={styles.oddsBottomRowText}>+{underOdds}</Text>
                                            : <Text style={styles.oddsBottomRowText}>{underOdds}</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                            :
                            <View>
                                <View style={styles.awayGameInfoContainer}>
                                    <View style={styles.teamItem}>
                                        <Text style={styles.teamText}>{awayTeam}</Text>
                                    </View>
                                    <View style={styles.moneylineItem}>
                                        {awayMoneyline > 0 ? 
                                            <Text style={styles.spreadText}>+{awayMoneyline}</Text> 
                                            : <Text style={styles.spreadText}>{awayMoneyline}</Text>
                                        }
                                    </View>
                                    <View style={styles.spreadItem}>
                                        {awaySpread > 0 ? 
                                            <Text style={styles.spreadText}>+{awaySpread}</Text> 
                                            : <Text style={styles.spreadText}>{awaySpread}</Text>
                                        }
                                        {awaySpreadOdds > 0 ? 
                                            <Text style={styles.oddsTopRowText}>+{awaySpreadOdds}</Text> 
                                            : <Text style={styles.oddsTopRowText}>{awaySpreadOdds}</Text>
                                        }
                                    </View>
                                    <View style={styles.totalItem}>
                                        {sport == 'mma_mixed_martial_arts' ?
                                        <Text style={styles.spreadText}>{over}</Text>
                                        :
                                        <Text style={styles.spreadText}>{over}</Text>
                                        }
                                        {overOdds > 0 ? 
                                            <Text style={styles.oddsTopRowText}>+{overOdds}</Text> 
                                            : <Text style={styles.oddsTopRowText}>{overOdds}</Text>
                                        }
                                    </View>
                                </View>
                                <View style={styles.homeGameInfoContainer}>
                                    <View style={styles.teamItem}>
                                        <Text style={styles.teamText}>{homeTeam}</Text>
                                    </View>
                                    <View style={styles.moneylineItem}>
                                        {homeMoneyline > 0 ? 
                                            <Text style={styles.spreadText}>+{homeMoneyline}</Text> 
                                            : <Text style={styles.spreadText}>{homeMoneyline}</Text>
                                        }
                                    </View>
                                    <View style={styles.spreadItem}>
                                        {homeSpread > 0 ? 
                                            <Text style={styles.spreadText}>+{homeSpread}</Text> 
                                            : <Text style={styles.spreadText}>{homeSpread}</Text>
                                        }
                                        {homeSpreadOdds > 0 ?
                                            <Text style={styles.oddsBottomRowText}>+{homeSpreadOdds}</Text>
                                            : <Text style={styles.oddsBottomRowText}>{homeSpreadOdds}</Text>
                                        }
                                        
                                    </View>
                                    <View style={styles.totalItem}>
                                        {sport == 'mma_mixed_martial_arts' ?
                                        <Text style={styles.spreadText}>{under}</Text>
                                        :
                                        <Text style={styles.spreadText}>{under}</Text>
                                        }
                                        {underOdds > 0 ?
                                            <Text style={styles.oddsBottomRowText}>+{underOdds}</Text>
                                            : <Text style={styles.oddsBottomRowText}>{underOdds}</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                            }
                        </View>                    
                    </View>
                    <View>
                        <View style={styles.feedItem}>
                            <Image 
                                style={styles.profilePhotoCommentContainer}
                                source={{uri: posterImg}}
                            />
                        <View style={styles.postRightContainer}>
                            <View style={styles.postHeaderContainer}>
                                <Text style={styles.profileNameFeedText}>{posterName}</Text>
                                <Text style={styles.postTimeContainer}>{moment(postCreation.toDate()).fromNow()}</Text>
                            </View>
                            <View style={styles.postContentContainer}>
                                {postCaption != null ? <Text style={styles.captionText}>{postCaption}</Text> : null}
                                {postImg != "blank" ?
                                    <View style={styles.postPictureContainer}>
                                        <Image resizeMode={"cover"} source={{uri: postImg}} style={styles.postImage}/> 
                                    </View>
                                        : null}
                                {userTagList != null ? <Text style={{ color: '#0033cc', fontWeight: 'bold' }}>@{userTagList}</Text> : null}
                            </View>
                            <View style={styles.postFooterContainer}>
                                <View style={styles.likeContainer}>
                                        <Ionicons name={"hammer-outline"} size={20} color={"grey"} />
                                        <Text style={styles.likeNumber}>{likesCount}</Text>
                                </View>
                                <View style={styles.likeContainer}>
                                        <Foundation name={"skull"} size={20} color="#B3B6B7" />
                                        <Text style={styles.likeNumber}>{fadesCount}</Text>
                                </View>
                                <View style={styles.likeContainer}>
                                        <Ionicons name={"chatbubble-outline"} size={20} color={"grey"} />
                                        <Text style={styles.likeNumber}>{comment}</Text>
                                </View>
                                <View style={styles.likeContainer}>
                                        <Ionicons name={"share-outline"} size={20} color={"grey"} />
                                </View>
                                <View style={styles.likeContainer}>
                                        <Icon name={"ios-flag"} size={20} color={"grey"} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                
                </View>
            </View>
            <View style={styles.shareButtonsContainer}>
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => onShare()}>
                    <Text style={styles.shareText}>Share this Lock</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        
            
            
    )
};

const styles = StyleSheet.create({
    
    gameContainer: {
        padding: 6,
        marginVertical:4,
        marginRight: "1%",
        marginLeft: "1%",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",
        backgroundColor: "#ffffff",
        flex: 1,
        paddingTop: 6,

    },
    awayGameInfoContainer: { 
        flexDirection: 'row',
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
        width: "55%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 2,
    },
    teamNameItem: {
        width: "90%",
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 2,
    },
    spreadItem: {
        width: "15%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    moneylineItem: {
        width: "15%",
        borderRightColor: "#e1e2e6",
        borderRightWidth: 1,
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    totalItem: {
        width: "15%",
        alignItems: 'center',
        paddingTop: 2,
        justifyContent: 'center',
    },
    gameHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: '4%'
    },
    postButtonContainer: {
        paddingBottom: 5,
        borderBottomColor: "#CACFD2",
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    shareText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#009387",
    },
    feedItem:{
        padding:6,
        marginVertical:5,
        marginHorizontal:5,
        borderTopWidth: 1,
        borderTopColor: "#e1e2e6",
        flexDirection: 'row',
    },
    postPictureContainer: {
        width: 250,
        height: 200,
        aspectRatio: 1 * 1.4
    },
    postImage: {
        resizeMode: "contain",
        width: "100%",
        height: "100%",
    },
    captionText: {
        paddingBottom: 5,
    },
    profilePhotoCommentContainer: {
        width: 50,
        height: 50,
        borderRadius: 40,
        backgroundColor: "#e1e2e6"
      },
    likeContainer: {
        flexDirection: 'row',
    },
    commentsContainer: {
        flexDirection: 'row',
    },
    flagContainer: {
        flexDirection: 'row',
    },
    likeNumber: {
        marginLeft: 5,
        marginTop: 5,
        color: "grey",
    },
    profileNameFeedText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postTimeContainer: {
        fontSize: 10,
    },
    postContentContainer: {
        width: "95%",
        marginLeft: "3%",
    },
    postHeaderContainer: {
        flexDirection: 'row',
        width: "95%",
        justifyContent: 'space-between',
        paddingBottom: 4,
        marginLeft: "3%",
    },
    postFooterContainer: {
        flexDirection: 'row',
        paddingTop: 4,
        justifyContent: 'space-between',
        width: "80%",
        paddingTop: 5,
        marginLeft: "3%",
        paddingBottom: 2,
    },
    postRightContainer: {
        flex: 1,
    },
    golfGameContainer: {
        padding: 10,
        marginRight: 2,
        marginLeft: 2,
        borderTopWidth: .8,
        borderTopColor: "#ccc",
        backgroundColor: "#ffffff",
    },
    golfOddsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    golfPlayerText: {
    },
    gameHeaderText: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
    dateText: {
        color: 'grey',
        fontSize: 12,
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
    headerView:{
        width: '35%'
    },
    teamContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: '1%',
        paddingLeft: 4
    },
    shareButton: {
        backgroundColor: "#fff",
        borderRadius: 6,
        borderColor: '#009387',
        borderWidth: 2,
        paddingVertical: 4,
        paddingHorizontal: 20,
        height: 50,
        marginTop: "5%",
        marginBottom: "20%",
        aligntItems: 'center',
        justifyContent: 'center',
    },
    shareButtonsContainer: {
        alignItems: 'center'

    },
    cantShareButton: {
        backgroundColor: "grey",
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 6,
        width: "20%",
        alignSelf: "center",
        marginBottom: "1%",
        marginTop: "1%",
    },
    logoHeader: {
        backgroundColor: '#009387',
        flexDirection: 'row',
        justifyContent: 'center',
        aligntItems: 'center',
        paddingVertical: "2%"
    },
    headerName: {
        alignSelf: 'center',
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
        fontStyle: 'italic'
    },
    headerLogo: {
        alignSelf: 'center',
        color: "#fff",
        fontWeight: "bold",
        fontSize: 26,
    },
    shareImage: {
        borderBottomColor: '#CACFD2',
        borderBottomWidth: 1,
    }
    
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(SocialShare);


