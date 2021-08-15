import React from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'

import { FontAwesome5 } from "@expo/vector-icons";

export default function Landing({ navigation }) {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.circleContainer}>
                <View style={styles.leftCircle}></View>
                <View style={styles.rightCircle}></View>
            </View>
            <View style={{ alignItems: 'center', paddingBottom: 120,}}>
                <View style={{ justifyContent: 'center', flexDirection: 'row', paddingTop: 20 }}>
                    <Text style={styles.loadingLogo}>locctocc </Text>
                    <FontAwesome5 name="comment-dollar" color="#009387" size={30} />
                </View>
                <Text style={{
                    fontSize: 16,
                    color: "#009387",
                }}> Community for sports bettors
                </Text>
            </View>
            

            <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate("Register")} 
                    style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}> Register </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => navigation.navigate("Login")} 
                    style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}> Login </Text>
                </TouchableOpacity>
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
        paddingHorizontal: 12,
        width: "75%",
        alignSelf: "center",
        marginBottom: '5%',
    },
    appButtonText: {
        color: "#ffffff",
        fontSize: 25,
        alignSelf: "center",
    },
    headerText: {
        color: "#fff",
        marginTop: 50,
        fontSize: 30,
        fontWeight: "bold",
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 40,
        alignSelf: 'center',
        marginTop: 16,
        overflow: 'hidden',
        marginBottom: 10,
    },
    leftCircle: {
        backgroundColor: "#0066cc",
        width: 200,
        height: 200,
        borderRadius: 200,
        left: -50,
        right: -50,
        top: -50,
    },
    rightCircle: {
        backgroundColor: "#009387",
        width: 400,
        height: 400,
        borderRadius: 200,
        left: 100,
        right: 200,
        top: -400,
    },
    circleContainer: {
        flex: 1,
        top: -50,
    },
    disclaimerContainer: {
        flex: 1,
        alignSelf: 'center',
    },
    disclaimerText: {
        fontSize: 10,
        alignSelf: 'center',
        width: "70%",
    },
    loadingLogo: {
        color: "#009387",
        fontWeight: "bold",
        fontSize: 30,
        fontStyle: 'italic'
        
    }, 
    
})


