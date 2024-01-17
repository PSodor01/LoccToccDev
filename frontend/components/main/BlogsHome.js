import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'

import auth from '@react-native-firebase/auth'; 
import analytics from "@react-native-firebase/analytics";

import { BannerAdSize, TestIds, BannerAd, } from 'react-native-google-mobile-ads';
import moment from 'moment';

import { connect } from 'react-redux' 

const BlogsHomeScreen = (props) => {
  const [blogData, setBlogData] = useState([])
  const [selectedOption, setSelectedOption] = useState('All Blogs')
  
  const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-8519029912093094/8258310490'
  
  useEffect(() => {
    fetchBlogs();
    analytics().logScreenView({ screen_name: 'BlogHome', user_name: props.currentUser.name });
    setSelectedOption('All Blogs')

  }, [props.blogDetails]);

  const fetchBlogs = () => {
    try {
      const mergedBlogsData = props.blogDetails
        .filter(blog => blog.createdAt)
        .map((blog) => {
           const matchingUser = props.allUsers.find(user => user.id === blog.authorId);
  
        return {
          id: blog.id, // Assuming the ID is available in the blog details
          ...blog,
          authorName: matchingUser ? matchingUser.name : '',
          authorPicture: matchingUser ? matchingUser.userImg : '',
        };
      });
  
      setBlogData(mergedBlogsData.sort((a, b) => new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate())));
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleBlogPress = (item) => {
    analytics().logEvent('blogClick', { user_name: props.currentUser.name, blogName: item.blogTitle });
  };

  const renderBlogItem = ({ item }) => (
    <View style={styles.blogItem}>
      <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('BlogContent', { blogId: item.id, authorId: item.authorId, authorName: item.authorName });
              handleBlogPress(item.blogTitle);
                
        }}>
        <View style={styles.authorContainer} >
          {item.authorPicture ? (
            <Image source={{ uri: item.authorPicture }} style={styles.authorImage} />
          ) : (
            <View style={[styles.avatarContainer, { backgroundColor: '#95B9C7' }]}>
            <Ionicons name="person" size={30} color="white" />
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.blogTitle}>{item.blogTitle}</Text>
            <Text style={styles.authorId}>Written by: {item.authorName}</Text>
            <Text style={styles.blogDateText}>{item.createdAt ? moment(item.createdAt.toDate()).format("MMM Do, YYYY") : ''}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderHorizontalListItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.horizontalListItem,
        selectedOption === item ? styles.selectedOption : null,
      ]}
      onPress={() => handleOptionSelection(item)}
    >
      {item === 'Write a Blog' ? (
        <View style={styles.writeBlogContainer}>
          <Text style={[styles.horizontalListItemText, selectedOption === item ? styles.selectedOptionText : null]}>Write </Text>
          <FontAwesome5 name="pencil-alt" size={16} color="gray" />
        </View>
      ) : (
        <Text style={[styles.horizontalListItemText, selectedOption === item ? styles.selectedOptionText : null]}>
          {item}
        </Text>
      )}
    </TouchableOpacity>
  );

  const handleOptionSelection = (option) => {
    switch (option) {
      case 'All Blogs':
        setBlogData(blogData.sort((a, b) => new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate()))); // Use the original unfiltered data
        analytics().logEvent('allBlogsClick', {user_name: props.currentUser.name});
        break;
      case 'Top Blogs':
        setBlogData(blogData.sort((a, b) => parseFloat(b.blogViews) - parseFloat(a.blogViews)));
        analytics().logEvent('topBlogsClick', {user_name: props.currentUser.name});
        break;
      case 'My Blogs':
        setBlogData(blogData.filter(blog => blog.authorId === auth().currentUser.uid));
        analytics().logEvent('myBlogsClick', {user_name: props.currentUser.name});
        break;
      case 'Write a Blog':
        navigateToBlogWrite();
        analytics().logEvent('writeBlogClick', {user_name: props.currentUser.name});
        break;
      default:
        setBlogData(blogData); // Use the original unfiltered data
        break;
    }
    setSelectedOption(option);
  };

  const navigateToBlogWrite = () => {
    props.navigation.navigate('BlogWrite');
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
            data={['All Blogs', 'Top Blogs', 'Write a Blog']}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderHorizontalListItem}
            keyExtractor={(item) => item}
          />
      </View>
      <FlatList
        data={blogData}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.id}
        style={styles.verticalFlatList}
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
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1,
        backgroundColor: "#fff"
      },
      horizontalListItem: {
        padding: 10,
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#2095F2',
      },
      selectedOption: {
        backgroundColor: '#2095F2',
      },
      selectedOptionText: {
        color: 'white',
      },
      horizontalListItemText: {
        color: '#2095F2',
        fontWeight: 'bold',
      },
      blogItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
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
      verticalFlatList: {
        marginTop: 10,
        flex: 1
      },
      writeBlogContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      adView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    authorImage: {
      width: 60,
      height: 60,
      borderRadius: 30, // Make it a circle
      marginRight: 10,
    },
    textContainer: {
      flex: 1, // Take the remaining space
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
  allUsers: store.userState.allUsers,
  currentUser: store.userState.currentUser,
  blogDetails: store.blogDetailsState.blogDetails,
})

export default connect(mapStateToProps)(BlogsHomeScreen);
