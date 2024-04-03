import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, useWindowDimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';




import { BannerAdSize, TestIds, BannerAd, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';




import HTML from 'react-native-render-html';




function BlogContentScreen(props) {
  const [blogData, setBlogData] = useState(null);
  const [loaded, setLoaded] = useState(false);




  const { blogId, authorId, authorName } = props.route.params;




  const windowDimensions = useWindowDimensions();




  const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8519029912093094/8258310490';
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
    const fetchBlogData = async () => {
      try {
        const blogRef = firestore()
          .collection('blog')
          .doc(authorId)
          .collection('userBlogs')
          .doc(blogId);




        // Get the current blog data
        const blogSnapshot = await blogRef.get();




        if (blogSnapshot.exists) {
          const blogData = blogSnapshot.data();




          // Increment the blogViews field
          const updatedViews = (blogData.blogViews || 0) + 1;




          // Update the blog data with the incremented blogViews
          await blogRef.update({
            blogViews: updatedViews,
          });




          // Set the updated blog data to the state
          setBlogData({ ...blogData, blogViews: updatedViews });
        } else {
          console.warn('Blog not found.');
        }
      } catch (error) {
        console.error('Error fetching/updating blog data:', error);
      }
    };




    fetchBlogData();
  }, [blogId]);




  if (!blogData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }




  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.blogTitle}>{blogData.blogTitle}</Text>
          <Text style={styles.authorId}>{authorName}</Text>
        </View>
        {blogData.blogCoverPhoto && (
          <Image source={{ uri: blogData.blogCoverPhoto }} style={styles.image} />
        )}
        <View style={styles.contentContainer}>
          <HTML source={{ html: blogData.content }} contentWidth={windowDimensions.width} />
        </View>
      </ScrollView>




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
  );
}




  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      marginBottom: 5,
      borderBottomColor: "lightgray",
      borderBottomWidth: 1,
    },
    blogTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    authorId: {
      fontSize: 16,
      color: 'gray',
      paddingBottom: 5,
    },
    contentContainer: {
      marginBottom: 16,
    },
    image: {
      width: '100%',
      height: 300, // Set an appropriate height
      marginBottom: 8,
    },
    content: {
      fontSize: 16,
    },
    adView: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },
});




export default BlogContentScreen;