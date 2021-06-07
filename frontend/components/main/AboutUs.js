import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function AboutUsScreen() {
    return (
        <View style={styles.container}>
            <Text>About Us</Text>
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

