import React, { useEffect, useState } from 'react'
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native'

import Onboarding from 'react-native-onboarding-swiper';

import * as Analytics from 'expo-firebase-analytics';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

/*import AsyncStorage from '@react-native-community/async-storage'

const [isFirstLaunch, setIsFirstLaunch] = useState(null)

useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
        if(value == null ) {
            AsyncStorage.setItem('alreadyLaunched', 'true');
            setIsFirstLaunch(true)
        } else {
            setIsFirstLaunch(false);
        }
    });
}, []);

*/

/*const Dots = ({selected}) => {
    let backgroundColor;

    backgroundColor = selected ? 'rgba(0, 0, 0.8)' : 'rgba(0, 0, 0.3)'

    return (
        <View>
            style={{
                width: 5,
                height: 5,
                marginHorizontal: 3,
                backgroundColor
            }}
        </View>
    )
} */

const Skip = (...props) => (
    <Button 
        title='Skip'
        color="#000000"
        {...props}
    />
)

const Next = ({...props}) => (
    <Button 
        title='Next'
        color="#000000"
        {...props}
    />
)

const Done = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:8, }}
        {...props}
        >
        <Text style={{fontSize: 16}}>Done</Text>
    </TouchableOpacity>
)

const OnboardingScreen = ({navigation}) => {
    return (
        <Onboarding
        NextButtonComponent={Next}
        SkipButtonComponent={Skip}
        DoneButtonComponent={Done}
        //DotComponent={Dots}
        onSkip={() => navigation.replace("Login")}
        onDone={() => navigation.navigate("Login")}
        pages={[
            {
                backgroundColor: '#009387',
                image: <Image 
                    source={require('../../assets/locctocclogo.png')} 
                    style={styles.imageStyle}
                    />,
                title: 'Welcome to the community',
                subtitle: 'See live odds and scores for your sport of choice',
            },
            {
                backgroundColor: '#fff',
                image: <Image source={require('../../assets/betOpenlyLogo.png')} />,
                title: 'Odds',
                subtitle: 'See live odds and scores for your sport of choice',
            },
            {
                backgroundColor: '#009387',
                image: <Image 
                    source={require('../../assets/howToGame.jpg')} 
                    style={styles.imageStyle}
                />,
                title: 'Drill Down to a Single Game',
                subtitle: 'See all the locks for that event',
            },
            {
                backgroundColor: '#009387',
                image: <Image 
                    source={require('../../assets/howToGame.jpg')} 
                    style={styles.imageStyle}
                />,
                title: 'new post',
                subtitle: 'See all the locks for that event',
            },
            {
                backgroundColor: '#fff',
                image: <Image 
                    source={require('../../assets/howToPost.jpg')} 
                    style={styles.imageStyle}
                />,
                title: 'feed',
                subtitle: 'See posts from your friends or from all users',
            },
            {
                backgroundColor: '#009387',
                image: <Image source={require('../../assets/betOpenlyLogo.png')} />,
                title: 'Profile',
                subtitle: 'See posts from your friends or from all users',
            },
        ]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
    },
    imageStyle: {
        width: "70%",
        height: "70%",
      },
})

const mapStateToProps = (store) => ({

    currentUser: store.userState.currentUser,

})

export default connect(mapStateToProps)(OnboardingScreen);