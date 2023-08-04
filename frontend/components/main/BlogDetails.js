import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native'

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'

import analytics from "@react-native-firebase/analytics";
import { BannerAdSize, TestIds, BannerAd, InterstitialAd, AdEventType  } from 'react-native-google-mobile-ads';

import moment from 'moment';

import { connect } from 'react-redux'

function BlogDetailsScreen(props) {
    const [blogDetails, setBlogDetails] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const { blogId } = props.route.params;

    const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8519029912093094/8258310490'
    const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-8519029912093094/1703388279';

    
    useEffect(() => {
      const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['fashion', 'clothing'],
      });
      const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        setLoaded(true);
        interstitial.show();
      });
  
      // Start loading the interstitial straight away
      interstitial.load();
      
      
  
      // Unsubscribe from events on unmount
      return unsubscribe;
    }, []);

   


    useEffect(() => {
        analytics().logScreenView({ screen_name: 'BlogDetails', screen_class: 'BlogDetails',  user_name: props.currentUser.name, blog_name: props.blogDetails.blogTitle})

        const liveBlogs = props.blogDetails.filter(blog => blog.id == blogId);

        setBlogDetails(liveBlogs)

    }, [ props.blogDetails ])

    const countExternalBlogClicks = async (blogTitle) => {

      const url = blogTitle;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }

      analytics().logEvent('externalBlogClick', {user_name: props.currentUser.name, blog_name: props.blogDetails.blogTitle});

    }

    const ItemView = ({ item }) => {
        const subHeadings = [];
        const paragraphs = [];
      
        for (let i = 1; i <= 20; i++) {
          if (item["subHeading" + i]) {
            subHeadings.push(
              <Text key={"subHeading" + i} style={styles.subHeadingText}>
                {item["subHeading" + i]}
              </Text>
            );
          }
      
          if (item["paragraph" + i]) {
            paragraphs.push(
              <Text key={"paragraph" + i} style={styles.paragraphText}>
                {item["paragraph" + i]}
              </Text>
            );
          }
        }
      
        return (
          <View>
            <View style={styles.feedItem}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.blogTitle}</Text>
                {item.blogAuthor == "A Locctocc Original" ? 
                            <Text style={styles.author}>{item.blogAuthor}</Text> 
                            : <Text style={styles.author}>Written by: {item.blogAuthor}</Text>}
                <Text style={styles.date}>
                  {moment(item.blogDate.toDate()).format("MMM Do, YYYY")}
                </Text>
              </View>
              <Image source={{ uri: item.blogImage }} style={styles.logoImage} />
              <Text style={styles.paragraphText}>{item.blogIntro}</Text>
              <Text>{" "}</Text>
              {subHeadings.map((subHeading, index) => {
                return (
                  <React.Fragment key={index}>
                    {subHeading}
                    {paragraphs[index]}
                    <Text>{" "}</Text>
                  </React.Fragment>
                );
              })}
              <Text style={styles.paragraphText}>{item.blogOutro}</Text>
              <Text></Text>
              {item.blogAuthor == "A Locctocc Original" ? 
              null
              :
              <Text style={styles.paragraphText}>Check out more from:</Text>
              }
              {item.blogAuthor == "A Locctocc Original" ? 
              null
              :
              <TouchableOpacity>
                <Text style={styles.linkText}
                  onPress={() => {
                    countExternalBlogClicks(item.blogTitle)
                    Linking.openURL('https://' + item.blogLink);
                  }}
                >
                  {item.blogAuthor}
                </Text>
              </TouchableOpacity>
              }
             
            </View>
          </View>
        );
      };
      
    
    return (
        <View style={styles.textInputContainer}>
            <FlatList
                data = {blogDetails.sort((a, b) => new Date(b.blogDate.toDate()) - new Date(a.blogDate.toDate()))}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}
            />  
            <View style={styles.adView}>
                <BannerAd
                    unitId={bannerAdUnitId}
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
        marginBottom: 20,
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
    },
    blogContainer: {
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    author: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 5,
    },
    subHeadingText: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
    },
    paragraphText: {
        textAlign: 'justify',
        marginLeft: "5%",
        marginRight: "5%",
    },
    date: {
        color: "grey",
        fontSize: 14,
        marginBottom: 5,
    },
    linkText: {
      color: 'blue',
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

export default connect(mapStateToProps)(BlogDetailsScreen);


