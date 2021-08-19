import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PostButton = () => {

    const navigation = useNavigation();
    
    const onPress = () => {
        navigation.navigate('NewPost', { gameId: gameId, homeTeam: homeTeam, awayTeam: awayTeam })
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={onPress}
        >
            <MaterialCommunityIcons name={"plus"} size={30} color="white" />
        </TouchableOpacity>
    )
}

export default PostButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#009387",
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: .7,
    },
});

