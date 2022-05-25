import React, { useEffect, useState } from 'react'
import { View, Text, Button, Image, StyleSheet } from 'react-native'

import Onboarding from 'react-native-onboarding-swiper';
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

if( isFirstLaunch == null ) {
    return null;
} else if ( isFirstLaunch == true ) {
    return (
        //put what you want here (app store review)
        <View>

        </View>
    )
} else {
    return null
} */

const Dots = ({selected}) => {
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
}

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
        DotComponent={Dots}
        onSkip={() => navigation.replace("Login")}
        onDone={() => navigation.navigate("Login")}
        pages={[
            {
                backgroundColor: '#009387',
                image: <Image source={require('../../assets/locctocclogo.png')} />,
                title: 'Welcome to the community',
                subtitle: 'See live odds and scores for your sport of choice',
            },
            {
                backgroundColor: '#fff',
                image: <Image source={require('../../assets/locctocclogo.png')} />,
                title: 'Onboarding 2',
                subtitle: 'Done with React Native Onboarding Swiper',
            },
            {
                backgroundColor: '#fff',
                image: <Image source={require('../../assets/locctocclogo.png')} />,
                title: 'Onboarding 3',
                subtitle: 'Done with React Native Onboarding Swiper',
            },
        ]}
        />
    );
};

export default OnboardingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})