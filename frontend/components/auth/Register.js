import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Linking, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'

import { FontAwesome5 } from "@expo/vector-icons";

import { CheckBox } from 'react-native-elements';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-community/picker';

import PassMeter from "react-native-passmeter";

import firebase from 'firebase'
import "firebase/firestore";

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>

)

const MAX_LEN = 15,
  MIN_LEN = 6,
  PASS_LABELS = ["Too Short", "Weak Sauce", "Better", "There we go!", "YES!!"];

/*
<View style={styles.datePicker}>
    <Button 
        title="Choose Birthday" 
        onPress={this.onPressButton} 
    />
    <Text>{this.state.DateDisplay}</Text>
    <DateTimePickerModal 
        isVisible={this.state.visibility}
        onConfirm={this.handleConfirm}
        onCancel={this.onPressCancel}
        mode="date"
    />

</View>
<View style={{ paddingTop: 10, marginTop: 30 }}>
    <Picker
    style={{ justifyContent: 'center', height: 100}}
    itemStyle={{ fontSize: 14, }}
    selectedValue={this.state.gender}
    onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}
    >
        <Picker.Item
            label='Female'
            value='female'
        />
        <Picker.Item
            label='Male'
            value='male'
        />
    </Picker>
</View>
    */

export class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: '',
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            aboutMe: '',
            location: '',
            userImg: null,
            checked: false,

        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    state={
        visibility:false,
        DateDisplay:"",
        checked: false,


    }

    handleConfirm=(date) => {
        this.setState({ DateDisplay:date.toUTCString() }, 
        this.setState({ visibility: false }),
        console.log("Date picked:", date.toUTCString())

        )
    }

    onPressCancel= () => {
        this.setState({ visibility: false })
    }

    onPressButton = () => {
        this.setState({ visibility: true })
    }

    onChangeCheck() {
        this.setState({ checked: !this.state.checked })
    }

    incompleteAlert = () => {
        alert('Oops! Please fill out all fields')
    }

    async onSignUp() {
        const { email, password, name, aboutMe, location, userImg, createdAt } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        email,
                        aboutMe,
                        location,
                        userImg,
                        createdAt,
                        followerCount: 0,
                        followingCount: 0,
                        postsCount: 0,
                    })
                console.log(result)
            })
            .catch(error => {   
                alert(error.message)
                console.log(error.message)
             })
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
                        style= {{marginTop: "12.5%", marginLeft: '7.5%'}}
                        onPress={() => this.props.navigation.goBack()}
                        >
                        <FontAwesome5 name="chevron-left" size={24} color="#009387" />
                    </TouchableOpacity>
                    <View style= {{flexDirection: 'row', marginTop: '30%',justifyContent: 'center'}}>
                        <Text style={styles.loadingLogo}>locctocc </Text>
                        <FontAwesome5 name="comment-dollar" color="#009387" size={30} />
                    </View>
                    <View style={styles.appTextContainer}>
                        <Text style={{
                            fontSize: 26,
                            fontWeight: 'bold',
                            color: "#009387",
                        }}> New here?
                        </Text>
                        <Text style={{
                            fontSize: 18,
                            color: "#009387",
                        }}> Join the family
                        </Text>
                    </View>
                </View>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Username"
                            maxLength={30}
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
                            maxLength={15}
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={(password) => this.setState({ password })}
                        />
                        {this.state.password ? 
                        <PassMeter
                            showLabels
                            password={this.state.password}
                            maxLength={MAX_LEN}
                            minLength={MIN_LEN}
                            labels={PASS_LABELS}
                            useNativeDriver={true}
                        />
                        : null
                        }
                        
                        
                        <View style={styles.agreementContainer}>
                            <CheckBox 
                                checked={this.state.checked}
                                onPress={() => this.setState({checked: !this.state.checked})}
                            />
                            <Text style={styles.disclaimerText}>
                                I have read and agree to the{' '}
                                    <Text
                                        style={styles.hyperlinkStyle}
                                        onPress={() => {
                                        Linking.openURL('https://locctocc.flycricket.io/privacy.html');
                                        }}>
                                        Privacy Policy 
                                    </Text><Text></Text>
                                ,{' '}
                                    <Text
                                        style={styles.hyperlinkStyle}
                                        onPress={() => {
                                        Linking.openURL('https://locctocc.flycricket.io/terms.html');
                                        }}>
                                        Terms & Conditions
                                    </Text><Text> </Text>
                                and the{' '}
                                <Text
                                    style={styles.hyperlinkStyle}
                                    onPress={() => {
                                    Linking.openURL('https://www.termsfeed.com/live/b4eefe2f-ded8-405c-bf83-3e9272e2eb34');
                                    }}>
                                    End-User License Agreement
                                </Text>
                                </Text>
                        </View>
                        
                        {!this.state.checked ? 
                        <TouchableOpacity
                            onPress={() => this.incompleteAlert()}
                            title="Sign Up"
                            style={styles.appButtonContainerDummy}>
                                <Text style={styles.appButtonTextDummy}> Sign Up </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => this.onSignUp()}
                            title="Sign Up"
                            style={styles.appButtonContainer}>
                                <Text style={styles.appButtonText}> Sign Up </Text>
                        </TouchableOpacity>
                        }
                        
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
    },
    textInput: {
        height: 40,
        marginRight: "15%",
        marginLeft: "15%",
        marginBottom: "2%",
        paddingHorizontal: 30,
        borderColor: "#009387",
        borderWidth: 1,
        borderRadius: 20,
    },
    appButtonContainer: {
        borderColor: "#009387",
        borderWidth: 2,
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: "75%",
        alignSelf: "center",
        marginBottom: '5%',
        marginTop: "2%",
    },
    appButtonContainerDummy: {
        borderColor: "#666",
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: "75%",
        alignSelf: "center",
        marginBottom: '5%',
        marginTop: "2%",
    },
    appButtonText: {
        color: "#009387",
        fontSize: 18,
        alignSelf: "center",
        textTransform: "uppercase"
    },
    appButtonTextDummy: {
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
        paddingBottom: 20,
    },
    mainContainer: {
        backgroundColor: "#ffffff",
        flex: 1,
    },
    headerName: {
        alignSelf: 'center',
        color: "#009387",
        fontWeight: "bold",
        fontSize: 28,
        fontStyle: 'italic'
    }, 
    disclaimerContainer: {
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
    datePicker: {
        alignItems: 'center',
        marginBottom: 20,
    },
    hyperlinkStyle: {
        color: 'blue',
        fontSize: 10,
  },
  agreementContainer: {
      flexDirection: 'row',
      paddingBottom: 20,
  }
    
    
    
})


    

export default Register
