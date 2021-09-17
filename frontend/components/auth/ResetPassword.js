import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Alert, Button, TextInput, TouchableOpacity } from 'react-native';

import { FontAwesome5 } from "@expo/vector-icons";

import firebase from 'firebase'

export default function ResetPasswordScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [showLoading, setShowLoading] = useState(false);

    const reset = async() => {
        setShowLoading(true);
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            setShowLoading(false);
        } catch (e) {
            setShowLoading(false);
            Alert.alert(
                e.message
            );
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity 
                    style={{ alignItems: "flex-start", marginLeft:16, marginTop: "15%" }}
                    onPress={() => {navigation.navigate('Login');}}>
                    <FontAwesome5 name="chevron-left" size={24} color="#009387" />
                </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
                <View style={styles.formContainer}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ fontSize: 28, height: 40, color:'#009387' }}>Forgot your password?</Text>
                        <Text style={{ fontSize: 20, color:'#009387' }}>We've got you covered...</Text>
                    </View>
                    <View style={styles.subContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Your Email'
                            
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={styles.subContainer}>
                        <TouchableOpacity
                            style={styles.appButtonContainer}
                            onPress={() => reset()}>
                            <Text style={styles.appButtonText}> Reset </Text>
                        </TouchableOpacity>
                    </View>
                    {showLoading &&
                        <View style={styles.activity}>
                            <ActivityIndicator size="large" />
                        </View>
                    }
                </View>
            </View>
            
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    formContainer: {
        height: 400,
        padding: 20
    },
    subContainer: {
        marginBottom: 20,
        padding: 5,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        height: 40,
        marginRight: "5%",
        marginLeft: "5%",
        marginBottom: "5%",
        paddingHorizontal: 30,
        borderColor: "#009387",
        borderWidth: 1,
        borderRadius: 20,
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
        fontSize: 20,
        alignSelf: "center",
    },
})
