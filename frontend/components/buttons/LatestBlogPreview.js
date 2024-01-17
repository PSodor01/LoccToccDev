import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

import moment from 'moment';

import { useNavigation } from '@react-navigation/native';

import analytics from "@react-native-firebase/analytics";

import { connect } from 'react-redux'

const LatestBlogPreview = (props) => {
    const [blogDetails, setBlogDetails] = useState([]);
    const [blogPreview, setBlogPreview] = useState()

    const navigation = useNavigation();

    useEffect(() => {
      fetchBlogs()
      setBlogPreview(true)

    }, [props.blogDetails]);

    
  
    const fetchBlogs = () => {
      try {
        const featuredBlogs = props.blogDetails.filter((blog) => blog.aFeaturedBlog === true)
          .map((blog) => {
             const matchingUser = props.allUsers.find(user => user.id === blog.authorId);
    
          return {
            id: blog.id, // Assuming the ID is available in the blog details
            ...blog,
            authorName: matchingUser ? matchingUser.name : '',
            authorPicture: matchingUser ? matchingUser.userImg : '',
          };
        });
    
        setBlogDetails(featuredBlogs);
        console.log()

        
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
  
    if (blogDetails.length === 0) {
      // Handle the case when there are no blog details available
      return null;
    }

  // Find the latest blog by sorting the blogDetails array by date
  const featuredBlog = blogDetails[0];

  const storeBlogClickHome = (blogTitle) => {

    analytics().logEvent('blogClickHome', {user_name: props.currentUser.name, blogName: blogTitle});
        
}

return blogDetails && blogPreview ? (
  <View style={styles.container}>
    <Text style={styles.featuredTitle}>Featured Blog</Text>
    <View style={styles.blogItem}>
      <TouchableOpacity
        onPress={() => {
          storeBlogClickHome();
          navigation.navigate('BlogContent', {
            blogId: featuredBlog.id,
            authorId: featuredBlog.authorId,
            authorName: featuredBlog.authorName,
          });
        }}>
        <View style={styles.authorContainer}>
          {featuredBlog.authorPicture ? (
            <Image source={{ uri: featuredBlog.authorPicture }} style={styles.authorImage} />
          ) : (
            <View style={[styles.avatarContainer, { backgroundColor: '#95B9C7' }]}>
              <Ionicons name="person" size={30} color="white" />
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.blogTitle}>{featuredBlog.blogTitle}</Text>
            <Text style={styles.authorId}>Author: {featuredBlog.authorName}</Text>
            <Text style={styles.blogDateText}>
              {featuredBlog.createdAt ? moment(featuredBlog.createdAt.toDate()).format('MMM Do, YYYY') : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  </View>
) : null;
};

const styles = StyleSheet.create({
container: {
  paddingHorizontal: 16,
  paddingBottom: 16,
  borderBottomWidth: 1,
  borderBottomColor: 'lightgray',
  borderTopWidth: 1,
  borderTopColor: 'lightgray',
},
featuredTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 5,
  marginBottom: 5,
  fontStyle: 'italic',
},
blogItem: {
},
blogTitle: {
  fontSize: 18,
  fontWeight: 'bold',
},
authorId: {
  marginTop: 5,
  color: 'gray',
  fontWeight: 'bold',
},
blogDateText: {
  marginTop: 5,
  color: 'gray',
},
authorContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
authorImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginRight: 10,
},
textContainer: {
  flex: 1,
},
avatarContainer: {
  width: 60,
  height: 60,
  borderRadius: 40,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '5%',
},
});


const mapStateToProps = (store) => ({
    blogDetails: store.blogDetailsState.blogDetails,
    currentUser: store.userState.currentUser,
    allUsers: store.userState.allUsers,
})

export default connect(mapStateToProps)(LatestBlogPreview);

