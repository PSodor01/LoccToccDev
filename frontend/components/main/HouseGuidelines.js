import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function HouseGuidlinesScreen() {
    return (
        <View style={styles.container}>
            <Text>Site Rules Screen</Text>
            <Text>no unit shaming</Text>
            <Text>no politics</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
 
    },
    
})
