import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import moment from 'moment';

import PostButton from '../PostButton'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }
        

    }, [props.usersFollowingLoaded, props.feed])
    
    const onLikePress = (userId, postId) => {
        const userPosts = firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId);
        
        userPosts.collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
            .then(() => {
                userPosts.update({
                    likesCount: firebase.firestore.FieldValue.increment(1)
                });
            })
    }
    const onDislikePress = (userId, postId) => {
        const userPosts = firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId);

        userPosts.collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
            .then(() => {
                userPosts.update({
                    likesCount: firebase.firestore.FieldValue.increment(-1)
                });
            })
    }

    const onTrendingPress = () => {
        console.warn( 'Placeholder: should take you to comments about this game' );
        Alert.alert(
            'Placeholder: should take you to comments about this game',
          );
    }
    const onReportPostPress = () => {
        console.warn( 'Report Post' );
        Alert.alert(
            'This will be the Report Post button',
          );
    }
    const navigation = useNavigation();

    const trendingGames = [
        {
            id: '1',
            homeTeam: 'Gonzaga',
            awayTeam: 'Baylor',
            homeSpread: '-4.5',
            awaySpread: '+4.5',
            homeMoneyline: '-200',
            awayMoneyline: '+175',
            over: '135.5',
            under: '135.5',
        },
        {
            id: '2',
            homeTeam: 'Clippers',
            awayTeam: 'Lakers',
            homeSpread: '-1.5',
            awaySpread: '+1.5',
            homeMoneyline: '-117',
            awayMoneyline: '+109',
            over: '225.5',
            under: '225.5',
        },
        {
            id: '3',
            homeTeam: '76ers',
            awayTeam: 'Bucks',
            homeSpread: '+1.5',
            awaySpread: '-1.5',
            homeMoneyline: '+135',
            awayMoneyline: '-110',
            over: '230',
            under: '230',
        },
        {
            id: '4',
            homeTeam: 'Orioles',
            awayTeam: 'Yankees',
            homeSpread: '+1.5',
            awaySpread: '-1.5',
            homeMoneyline: '+150',
            awayMoneyline: '-177',
            over: '10',
            under: '10',
        },
    ]

    const favoriteGames = [
        {
            id: '1',
            homeTeam: 'Nets',
            awayTeam: 'Knicks',
            homeSpread: '-6.5',
            awaySpread: '+6.5',
            homeMoneyline: '-200',
            awayMoneyline: '+175',
            over: '213',
            under: '213',
        },
        {
            id: '2',
            homeTeam: 'Orioles',
            awayTeam: 'Yankees',
            homeSpread: '+1.5',
            awaySpread: '-1.5',
            homeMoneyline: '+150',
            awayMoneyline: '-177',
            over: '10',
            under: '10',
        },
    ]

    return (
        <View style={styles.container}>
            <ScrollableTabView
                style={styles.scrollTab}
                initialPage={1}
                renderTabBar={() => <DefaultTabBar />}
            >
                <FlatList tabLabel='Trending'
                numColumns={1}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={trendingGames}
                renderItem={({item}) => (
                    <View style={styles.trendingContainer}>
                        <TouchableOpacity 
                            style={styles.trendingButton}
                            onPress={onTrendingPress}>
                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingHeaderText}>Team</Text>
                                <Text>{item.awayTeam}</Text>
                                <Text>{item.homeTeam}</Text>
                            </View>
                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingHeaderText}>Spread</Text>
                                <Text>{item.awaySpread}</Text>
                                <Text>{item.homeSpread}</Text>
                            </View>
                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingHeaderText}>ML</Text>
                                <Text>{item.awayMoneyline}</Text>
                                <Text>{item.homeMoneyline}</Text>
                            </View>
                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingHeaderText}>O/U</Text>
                                <Text>{item.over}</Text>
                                <Text>{item.under}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    
                )}
            />
            <FlatList tabLabel='Favorites'
                numColumns={1}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={favoriteGames}
                renderItem={({item}) => (
                    <View style={styles.trendingContainer}>
                        <TouchableOpacity 
                            style={styles.trendingButton}
                            onPress={onTrendingPress}>
                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingHeaderText}>Team</Text>
                                <Text>{item.awayTeam}</Text>
                                <Text>{item.homeTeam}</Text>
                            </View>
                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingHeaderText}>Spread</Text>
                                <Text>{item.awaySpread}</Text>
                                <Text>{item.homeSpread}</Text>
                            </View>
                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingHeaderText}>ML</Text>
                                <Text>{item.awayMoneyline}</Text>
                                <Text>{item.homeMoneyline}</Text>
                            </View>
                            <View style={styles.trendingItem}>
                                <Text style={styles.trendingHeaderText}>O/U</Text>
                                <Text>{item.over}</Text>
                                <Text>{item.under}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    
                )}
            />
                
            </ScrollableTabView>
        
        <View style={styles.containerGallery}>
            <FlatList
                style={styles.feed}
                numColumns={1}
                horizontal={false}
                data={posts}
                renderItem={({ item }) => (
                    <View style={styles.feedItem}>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                            <Image source={require('../../assets/profilePhoto.png')} style={styles.profilePhotoPostContainer} />
                        </TouchableOpacity>
                        <View style={styles.postRightContainer}>
                            <View style={styles.postHeaderContainer}>
                                <Text style={styles.profileNameFeedText}>{item.user.name}</Text>
                                <Text style={styles.postTimeContainer}>{moment(item.creation.toDate()).fromNow()}</Text>
                            </View>
                            <View style={styles.postContentContainer}>
                                <Text style={styles.captionText}>{item.caption}</Text>
                            </View>
                            <View style={styles.postFooterContainer}>
                                { item.currentUserLike ?
                                    (
                                        <TouchableOpacity
                                            style={styles.likeContainer}
                                            onPress={() => onDislikePress(item.user.uid, item.id)} >
                                            <Icon name={"ios-heart"} size={25} color={"red"} />
                                            <Text style={styles.likeNumber}>{item.likesCount}</Text>
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <TouchableOpacity
                                            style={styles.likeContainer}
                                            onPress={() => onLikePress(item.user.uid, item.id)}> 
                                            <Icon name={"ios-heart-empty"}  size={25} color={"pink"}/>
                                            <Text style={styles.likeNumber}>{item.likesCount}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                <TouchableOpacity
                                    style={styles.commentsContainer}
                                    onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                    <Icon name={"ios-chatboxes"} size={25} color={"grey"} marginRight={10} />
                                    <Text style={styles.likeNumber}>{item.comments}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.flagContainer}
                                    onPress={onReportPostPress}>
                                    <Icon name={"ios-flag"} size={25} color={"grey"} marginRight={10} />
                                    <Text style={styles.flagText}>Report</Text>
                                </TouchableOpacity>
                                </View>
                                
                        </View>
                    </View>
                )}

            />
        </View>
        <PostButton />
    </View>
            

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e1e2e6",
    },
    containerGallery: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 10,
        flex: 1,
        marginTop: -10,
    },
    feed: {
        backgroundColor: "#ffffff",
        flex: 1,
        marginTop: 14,
    },
    feedItem:{
        padding:6,
        marginVertical:5,
        marginHorizontal:5,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
        flexDirection: 'row',
    },
    profileNameFeedText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 2.5,
    },
    captionText: {
        marginHorizontal: 10,

    },
    postTimeContainer: {
        fontSize: 10,
    },
    postContentContainer: {
        flex: 1,
        width: "90%",
    },
    postHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "80%",
        paddingBottom: 4,
    },
    profilePhotoPostContainer: {
        width: 50,
        height: 50,
        borderRadius: 40,
    },
    postFooterContainer: {
        flexDirection: 'row',
        paddingTop: 4,
        justifyContent: 'space-between',
        width: "60%",
        paddingTop: 5,
        marginLeft: "5%",

    },
    postRightContainer: {
        width: "100%",
    },
    trendingItem:{
        padding:4,
        marginHorizontal:5,
    },
    trendingContainer:{
        padding:6,
        marginVertical:15,
        marginHorizontal:5,
        flexDirection: 'row',
        flex: 1,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: "#fff",
    },
    trendingHeaderText: {
        fontWeight: "bold",
    },
    trendingButton: {
        flexDirection: 'row',
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
    flagText: {
        marginLeft: 5,
        marginTop: 5,
        color: "grey",
        fontSize: 10,
    },
    scrollTab: {
        marginBottom: "2%",
        flex: .4,
        backgroundColor: "#e1e2e6",
    }
    
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);

