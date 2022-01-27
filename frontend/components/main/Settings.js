import React, {useState} from 'react'
import { StyleSheet, TouchableOpacity, Switch, View, Text } from 'react-native'

const SettingsScreen = () => {

    const [switchValue, setSwitchValue] = useState(false);

    const toggleSwitch = (value) => {
        //onValueChange of the swithc this function will be called
        setSwitchValue(value)
            //state changes which will result in re-render the text
        
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={styles.titleText}>Notifications</Text>
                <Text>
                    {switchValue ? 'Switch is ON' : 'Switch is OFF'}
                </Text>
                <Switch 
                    style={{ marginTop: 30 }}
                    onValueChange={toggleSwitch}
                    value={switchValue}
                />
            </View>
            
        </View>
        
    )
    
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
        flexDirection: 'row'
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 20,
        paddingBottom: 10,
    },
    comingSoonText: {
        alignSelf: 'center',
        color: 'red',
    },
    text: {
        paddingBottom: 10,
    },
})

export default SettingsScreen;