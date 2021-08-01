import React, { Component } from 'react'
import { View, TouchableOpacity, Text, TextInput, StyleSheet, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'

import { FontAwesome5 } from "@expo/vector-icons";

import firebase from 'firebase'
import "firebase/firestore";

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>

)

export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            birthday: '',
            gender: '',
            name: '',
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            aboutMe: '',
            location: '',
            userImg: null,

        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, birthday, gender, name, aboutMe, location, userImg, createdAt } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        email,
                        birthday,
                        gender,
                        aboutMe,
                        location,
                        userImg,
                        createdAt
                    })
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    render() {
        return (
            <DismissKeyboard>
                <View style={styles.mainContainer}>
                    <View style={styles.appTextContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.headerName}>locctocc </Text>
                            <FontAwesome5 name="comment-dollar" color="#009387" size={26} />
                        </View>
                        <Text style={{
                            fontSize: 20,
                            color: "#009387",
                        }}> New here?
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: "#009387",
                        }}> Join the family
                        </Text>
                    </View>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Username"
                            autoCorrect={false}
                            onChangeText={(name) => this.setState({ name })}
                        />
                        <TextInput 
                            style={styles.textInput}
                            placeholder="Email"
                            autoCorrect={false}
                            onChangeText={(email) => this.setState({ email })}
                            keyboardType="email-address"
                        />
                        <TextInput  
                            style={styles.textInput}
                            placeholder="Password"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(password) => this.setState({ password })}
                        />
                        <TextInput  
                            style={styles.textInput}
                            placeholder="Gender"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(gender) => this.setState({ gender })}
                        />
                        <TextInput  
                            style={styles.textInput}
                            placeholder="Birthday"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(birthday) => this.setState({ birthday })}
                        />
                        <TouchableOpacity
                            onPress={() => this.onSignUp()}
                            title="Sign Up"
                            style={styles.appButtonContainer}>
                                <Text style={styles.appButtonText}> Sign Up </Text>
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
    }
};

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        marginRight: "15%",
        marginLeft: "15%",
        marginBottom: "3%",
        paddingHorizontal: 30,
        borderColor: "#009387",
        borderWidth: 1,
        borderRadius: 20,

    },
    textInputContainer: {
        flex: 1,
        paddingTop: 40,
    },
    appButtonContainer: {
        borderColor: "#009387",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: "75%",
        alignSelf: "center",
        marginTop: "5%",
        marginBottom: '5%',
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
        marginTop: "5%",
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    logo: {
        width: 125,
        height: 125,
        borderRadius: 40,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    leftCircle: {
        backgroundColor: "#0066cc",
        width: 250,
        height: 250,
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
        flex: .25,
        top: -75,
    },
    topContainer: {
        flex: 1,
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
    headerName: {
        alignSelf: 'center',
        color: "#009387",
        fontWeight: "bold",
        fontSize: 28,
        fontStyle: 'italic'
    
    }, 
    
})


    

export default Register
