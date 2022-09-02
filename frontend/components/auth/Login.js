import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Alert, Text, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'

import { FontAwesome5 } from "@expo/vector-icons";
import Fontisto from 'react-native-vector-icons/Fontisto';

import email from 'react-native-email'

import firebase from 'firebase'

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>

)

export class Login extends Component {
    
    
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
            })
            .catch(error => {   
                alert(error.message);
             })
           }catch(err){
              alert(err);
    }

    handleSupportEmail = () => {
        const to = ['support@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'LoccTocc Support Ticket',
            body: ''
        }).catch(console.error)
    }

    render() {
        return (
            <DismissKeyboard>
                <View style={styles.mainContainer}>
                    <View style={styles.topContainer}>
                        <TouchableOpacity 
                            style= {{marginTop: "15%", marginLeft: '5%'}}
                            onPress={() => this.props.navigation.goBack()}
                            >
                            <FontAwesome5 name="chevron-left" size={24} color="#009387" />
                        </TouchableOpacity>
                        <View style={styles.appTextContainer}>
                            <Text style={{fontSize: 24, color: "#009387",}}> Welcome back.</Text>
                            <Text style={{fontSize: 16, color: "#009387"}}> Here we go again</Text>
                        </View>
                    </View>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Email"
                            placeholderTextColor= "navy"
                            onChangeText={(email) => this.setState({ email })}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Password"
                            placeholderTextColor= "navy"
                            secureTextEntry={true}
                            onChangeText={(password) => this.setState({ password })}
                        />
                        <Text style={styles.forgotPasswordText}></Text>
                        <Text style={styles.forgotPasswordText}></Text>
                        <TouchableOpacity 
                            style={styles.forgotPasswordButton}
                            onPress={() => this.props.navigation.navigate("ResetPassword")}
                            >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.handleSupportEmail} style={styles.linkButton}>
                            <Fontisto name={"email"} color={"blue"} />
                            <Text style={styles.linkText}>  Support</Text>
                        </TouchableOpacity> 
                        <TouchableOpacity
                            onPress={() => this.onSignUp()}
                            title="Sign In"
                            style={styles.appButtonContainer}>
                                <Text style={styles.appButtonText}> Sign In </Text>
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
            </DismissKeyboard>
            
        )
    };
};

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        marginRight: "15%",
        marginLeft: "15%",
        marginBottom: "5%",
        paddingHorizontal: 30,
        borderColor: "#009387",
        borderWidth: 1,
        borderRadius: 20,

    },
    appButtonContainer: {
        borderColor: "#009387",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: "75%",
        alignSelf: "center",
        marginBottom: '10%',
        marginTop: '10%',
    },
    appButtonText: {
        color: "#666",
        fontSize: 18,
        alignSelf: "center",
        textTransform: "uppercase"
    },
    appText: {
        color: "#000080",
        alignItems: "center",
    },
    appTextContainer: {
        alignItems: "center",
        paddingTop: "10%",
        paddingBottom: "10%",
    },
    topContainer: {
        paddingBottom: "10%",
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    disclaimerContainer: {
        paddingTop: "10%",
        alignSelf: 'center',
    },
    disclaimerText: {
        fontSize: 10,
        alignSelf: 'center',
        width: "70%",
    },
    forgotPasswordButton: {
        alignItems: 'center'
    },
    forgotPasswordText: {
        color: 'blue',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkText: {
        alignSelf: 'center',
        color: 'blue',
    },
    
})

export default Login
