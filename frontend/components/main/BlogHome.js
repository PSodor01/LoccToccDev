import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'

import analytics from "@react-native-firebase/analytics";
import { BannerAdSize, TestIds, BannerAd } from 'react-native-google-mobile-ads';

import moment from 'moment';

import { connect } from 'react-redux'

function BlogHomeScreen(props) {
    const [blogDetails, setBlogDetails] = useState([]);

    const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8519029912093094/8258310490'

    //ca-app-pub-8519029912093094/1769291941

   
    

    useEffect(() => {
        analytics().logScreenView({ screen_name: 'BlogHome', screen_class: 'BlogHome',  user_name: props.currentUser.name})

        const liveBlogs = props.blogDetails.filter(blog => blog.blogLive == true);

        setBlogDetails(liveBlogs);

    }, [ props.blogDetails ])

    const storeBlogClick = (blogTitle) => {

        analytics().logEvent('blogClick', {user_name: props.currentUser.name, blogName: blogTitle});
            
    }

    const ItemView = ({item}) => {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        storeBlogClick(item.blogTitle);
                        props.navigation.navigate('BlogDetails', { blogId: item.id });
                }}>
                    <View style={styles.feedItem}>
                        <Image source={{ uri: item.blogImage }} style={styles.logoImage} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.blogTitle}</Text>
                            <Text style={styles.author}>{item.blogAuthor}</Text>
                            <Text style={styles.date}>
                            {moment(item.blogDate.toDate()).format("MMM Do, YYYY")}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    
    return (
        <View style={styles.textInputContainer}>
            <FlatList
                data = {blogDetails.sort((a, b) => new Date(b.blogDate.toDate()) - new Date(a.blogDate.toDate()))}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}
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
        
            
            
    )
};

const styles = StyleSheet.create({
    textInputContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
      },
      feedItem: {
        padding: 10,
        marginVertical: 2,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
        alignItems: "center",
        width: "100%",
      },
      logoImage: {
        resizeMode: "cover",
        width: "80%",
        aspectRatio: 1.5,
        borderRadius: 5,
        marginBottom: 10,
      },
      textContainer: {
        flex: 1,
        alignItems: 'center',
      },
      title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: 'center', // Center text horizontally

      },
      author: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
      },
      date: {
        color: "grey",
        fontSize: 14,
      },
    adView: {
        alignItems: "center",
        justifyContent: "center",
    },
})

const mapStateToProps = (store) => ({
    blogDetails: store.blogDetailsState.blogDetails,
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(BlogHomeScreen);


