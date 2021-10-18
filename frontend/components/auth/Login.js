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
                console.log(result)
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
                        <View style={styles.circleContainer}>
                            <View style={styles.leftCircle}></View>
                            <View style={styles.rightCircle}></View>
                        </View>
                        <TouchableOpacity 
                            style={{ alignItems: "flex-start", marginLeft: '7.5%', top: -50 }}
                            onPress={() => this.props.navigation.goBack()}
                            >
                            <FontAwesome5 name="chevron-left" size={24} color="#009387" />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingTop: 40, paddingBottom: 20,}}>
                            <Text style={styles.loadingLogo}>locctocc </Text>
                            <FontAwesome5 name="comment-dollar" color="#009387" size={30} />
                        </View>
                        <View style={styles.appTextContainer}>
                            <Text style={{
                                fontSize: 26,
                                fontWeight: 'bold',
                                color: "#009387",
                            }}> Welcome back.
                            </Text>
                            <Text style={{
                                fontSize: 18,
                                color: "#009387",
                            }}> Here we go again
                            </Text>
                        </View>
                    </View>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Email"
                            onChangeText={(email) => this.setState({ email })}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={(password) => this.setState({ password })}
                        />
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
    textInputContainer: {
        flex: 1,
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
        paddingBottom: 40,
    },
    
    logo: {
        width: 125,
        height: 125,
        borderRadius: 40,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    logoContainer: {
        flex: 1,
        marginBottom: "10%",
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
    topContainer: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
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
