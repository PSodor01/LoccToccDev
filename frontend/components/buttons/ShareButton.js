    
    import React from 'react';
    import { StyleSheet, TouchableOpacity, Text } from 'react-native'

    import Icon from 'react-native-vector-icons/Ionicons';

    import Share from 'react-native-share';
    
    const ShareButton = async() => {
        
        const shareOptions = {
            message: 'This is a test message'
        }

        try {
            const ShareResponse = await Share.open(shareOptions);
        } catch(error) {
            console.log('Error => ', error)
        };
        
        return (
            <TouchableOpacity
                style={styles.flagContainer}
                onPress={ShareButton}>
                <Icon name={"ios-flag"} size={20} color={"grey"} marginRight={10} />
                <Text style={styles.flagText}>Report</Text>
            </TouchableOpacity>
        )
    }
    
    export default ShareButton
    
    const styles = StyleSheet.create({
        flagText: {
            marginLeft: 5,
            marginTop: 5,
            color: "grey",
            fontSize: 10,
        },
        flagText: {
            marginLeft: 5,
            marginTop: 5,
            color: "grey",
            fontSize: 10,
        },
    });
    
    

