import React from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'

export default function Landing({ navigation }) {
    return (
        <View style={styles.mainContainer}>
            <View style={{ marginLeft: "10%", paddingBottom: "5%", paddingTop: "40%"}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: "#009387", paddingTop:"30%"}}>Never Miss a Lock Again</Text>
            </View>
            <View>
                <TouchableOpacity 
                    onPress={() => navigation.navigate("Register")} 
                    style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>Get Started</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginLeft: "10%", paddingTop:"15%", paddingBottom: "40%" }}>
                    <Text>Already a member?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")} 
                        >
                        <Text style={styles.signInText}> Sign in here</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.disclaimerContainer}>
                        <Text style={styles.disclaimerText}>
                            If you or someone you know has a gambling problem
                        </Text>
                        <Text style={styles.disclaimerText}>
                            and wants help, call 1-800-GAMBLER
                        </Text>
                    </View>
            </View>
        </View>        
        
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    appButtonContainer: {
        backgroundColor: "#009387",
        borderRadius: 6,
        paddingVertical: 10,
        marginLeft: "10%",
        width: "40%",
        marginBottom: '5%',
    },
    appButtonText: {
        color: "#ffffff",
        fontSize: 16,
        alignSelf: "center",
    },
    disclaimerContainer: {
        alignSelf: 'center',
    },
    disclaimerText: {
        fontSize: 10,
        alignSelf: 'center',
        width: "70%",
    },
    signInText: {
        color: 'blue',
    },
    
})


