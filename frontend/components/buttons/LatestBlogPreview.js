import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

import analytics from "@react-native-firebase/analytics";

import { connect } from 'react-redux'

const LatestBlogPreview = (props) => {
    const [blogDetails, setBlogDetails] = useState([]);
    const [blogPreview, setBlogPreview] = useState()

    const navigation = useNavigation();

    useEffect(() => {

        const liveBlogs = props.blogDetails.filter(blog => blog.blogLive == true);

        setBlogDetails(liveBlogs);
        setBlogPreview(true)

    }, [ props.blogDetails ])


  if (blogDetails.length === 0) {
    // Handle the case when there are no blog details available
    return null;
  }

  // Find the latest blog by sorting the blogDetails array by date
  const latestBlog = blogDetails.reduce((latest, blog) => {
    if (!latest || blog.blogDate > latest.blogDate) {
      return blog;
    }
    return latest;
  }, null);

  const storeBlogClickHome = (blogTitle) => {

    analytics().logEvent('blogClickHome', {user_name: props.currentUser.name, blogName: blogTitle});
        
}

const handleXOut = (blogTitle) => {

    analytics().logEvent('blogXOutHome', {user_name: props.currentUser.name, blogName: blogTitle});
    setBlogPreview(false)
        
}

return latestBlog ? (
    blogPreview == true ? 
    <TouchableOpacity
      onPress={() => {
        storeBlogClickHome(latestBlog.blogTitle);
        navigation.navigate('BlogDetails', { blogId: latestBlog.id });
      }}
    >
      <View style={styles.feedItem}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: latestBlog.blogImage }} style={styles.logoImage} />
          <TouchableOpacity
            onPress={() => {
                handleXOut(latestBlog.blogTitle);
            }}
            style={styles.xButton}
          >
            <Feather name="x-circle"  size={24} color= "red"  />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{latestBlog.blogTitle}</Text>
        </View>
      </View>
    </TouchableOpacity> : <View></View>
  ) : null;
};

const styles = StyleSheet.create({
  feedItem: {
    padding: 5,
    marginVertical: 2,
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  logoImage: {
    resizeMode: 'cover',
    width: '90%',
    aspectRatio: 1.5,
    borderRadius: 5,
  },
  xButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 50,
  },
  xText: {
    color: "white",
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
});


const mapStateToProps = (store) => ({
    blogDetails: store.blogDetailsState.blogDetails,
    currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps)(LatestBlogPreview);

