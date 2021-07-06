import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const MessagesButton = () => {

    const navigation = useNavigation();
    
    const onPress = () => {
        navigation.navigate('Messages')
    }

    return (
        <TouchableOpacity 
            style={{ alignItems: "flex-end", marginRight:16 }}
            onPress={onPress}>
            <FontAwesome5 name="envelope" size={24} color="#fff" />
        </TouchableOpacity>
    )
}

export default MessagesButton



