import React from 'react'
import { StyleSheet, Linking, View, Text, ScrollView} from 'react-native'


export default class PartnersScreen extends React.Component {

    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>We are proud to present our trusted partners:</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Bet Openly</Text>
                    <Text style={styles.text}>Create Your Own Lines, Only 1% Juice!</Text>
                    <Text
                        style={styles.linkText}
                        onPress={() => {
                        Linking.openURL('https://betopenly.com');
                        }}>
                        Bet Openly
                    </Text>
                    <Text></Text>
                </View>
            </ScrollView>
            
        )
    }
}
 
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        backgroundColor: '#fff',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e2e6",
        marginLeft: "2%",
    },
    titleContainer: {
        padding: 10
    },
    linkButton: {
        flexDirection: 'row',
        marginLeft: "5%",
    },
    titleText: {
        fontSize: 16,
        paddingTop: 20,
        paddingBottom: 10,
    },
    linkText: {
        alignSelf: 'center',
        color: 'blue',
    },
    text: {
        paddingBottom: 10,
    },
    
})
