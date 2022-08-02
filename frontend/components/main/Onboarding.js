import React, { useEffect, useState } from 'react'
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native'

import { useNavigation } from '@react-navigation/native';

import Onboarding from 'react-native-onboarding-swiper';

import * as Analytics from 'expo-firebase-analytics';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

function OnboardingScreen(props) {

useEffect(() => {

    Analytics.logEvent('screen_view', { screen_name: 'Onboarding', user_name: props.currentUser.name })

}, [])

const navigation = useNavigation();

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
        title=''
        color="#009387"
        {...props}
    />
)

const Next = ({...props}) => (
    <Button 
        title='Next'
        color="#fff"
        {...props}
    />
)

const Done = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal:8, }}
        {...props}
        >
        <Text style={{fontSize: 16, color:"#fff"}}>Done</Text>
    </TouchableOpacity>
)

    return (
        <Onboarding
        NextButtonComponent={Next}
        SkipButtonComponent={Skip}
        DoneButtonComponent={Done}
        //DotComponent={Dots}
        onSkip={() => navigation.goBack()}
        onDone={() => navigation.goBack()}
        pages={[
            {
                backgroundColor: '#009387',
                image: <Image 
                    source={require('../../assets/locctocclogo.png')}
                    style={styles.imageStyle}
                    />,
                title: 'Welcome to Locctocc',
                subtitle: 'The leading social network for sports bettors',
            },
            {
                backgroundColor: '#009387',
                image: <Image 
                    source={require('../../assets/howToOdds.jpg')}
                    style={styles.imageStyle}
                    resizeMode="contain"
                    />,
                title: 'Live Odds and Scores',
                subtitle: 'Choose from our list of sports!',
            },
            {
                backgroundColor: '#009387',
                image: <Image 
                    source={require('../../assets/howToGame.jpg')}
                    style={styles.imageStyle}
                    resizeMode="contain"
                    />,
                title: 'Pick a Game',
                subtitle: 'Click a game to see all the locks for that game!',
            },
            {
                backgroundColor: '#009387',
                image: <Image 
                    source={require('../../assets/howToPost.jpg')}
                    style={{ width: 300, height: 290 }}
                    resizeMode="contain"
                    />,
                title: 'Share a lock with the world',
                subtitle: 'Add a picture, gif or tag a friend!',
            },
            {
                backgroundColor: '#009387',
                image: <Image 
                    source={require('../../assets/howToFeed.jpg')}
                    style={styles.imageStyle}
                    resizeMode="contain"
                    />,
                title: 'See all the locks in one place!',
                subtitle: '',
            },
        ]}
        />
    );
}

const styles = StyleSheet.create({
    container: {
    },
    imageStyle: {
        width: 250,
        height: 290,
        borderRadius: 10,
      },
})

const mapStateToProps = (store) => ({

    currentUser: store.userState.currentUser,

})

export default connect(mapStateToProps)(OnboardingScreen);