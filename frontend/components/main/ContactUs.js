import React from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import email from 'react-native-email'

import Fontisto from 'react-native-vector-icons/Fontisto';

export default class ContactUsScreen extends React.Component {


    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Technical difficulties?</Text>
                    <Text style={styles.text}>Click the link below to contact our support team. We will address your issue right away.</Text>
                    <TouchableOpacity onPress={this.handleSupportEmail} style={styles.linkButton}>
                        <Fontisto name={"email"} color={"blue"} size={16}/>
                        <Text style={styles.linkText}>  Support</Text>
                    </TouchableOpacity> 
                    <Text></Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Advertising Inquiries</Text>
                    <Text style={styles.text}>Interested in partnering with us?</Text>
                    <TouchableOpacity onPress={this.handleAdvertisingEmail} style={styles.linkButton} >
                        <Fontisto name={"email"} color={"blue"} size={16}/>
                        <Text style={styles.linkText}>  Partners</Text>
                    </TouchableOpacity> 
                    <Text></Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Have feedback?</Text>
                    <Text style={styles.text}>Good, bad or ugly, we'd love to hear from you.</Text>
                    <TouchableOpacity onPress={this.handleFeedbackEmail} style={styles.linkButton}>
                        <Fontisto name={"email"} color={"blue"} size={16}/>
                        <Text style={styles.linkText}>  Feedback</Text>
                    </TouchableOpacity> 
                    <Text></Text>
                </View>
            </View>
            
        )
    }
 
    handleSupportEmail = () => {
        const to = ['support@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'Locctocc Support Ticket',
            body: ''
        }).catch(console.error)
    }

    handleFeedbackEmail = () => {
        const to = ['feedback@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'Locctocc Feedback',
            body: ''
        }).catch(console.error)
    }

    handleAdvertisingEmail = () => {
        const to = ['partnerships@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'Locctocc Partners',
            body: ''
        }).catch(console.error)
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
    linkButton: {
        flexDirection: 'row',
        marginLeft: "5%",
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
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
