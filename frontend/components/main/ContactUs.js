import React from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import email from 'react-native-email'

export default class ContactUsScreen extends React.Component {


    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Technical difficulties?</Text>
                    <Text style={styles.text}>Click the link below to contact our support team. We will address your issue right away.</Text>
                    <TouchableOpacity onPress={this.handleSupportEmail} style={styles.postButton}>
                        <Text style={styles.shareText}>Support</Text>
                    </TouchableOpacity> 
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Advertising Inquiries</Text>
                    <Text style={styles.text}>Interested in partnering with us?</Text>
                    <TouchableOpacity onPress={this.handleAdvertisingEmail} style={styles.postButton}>
                        <Text style={styles.shareText}>Partners</Text>
                    </TouchableOpacity> 
                </View>
                <View style={styles.container}>
                    <Text style={styles.titleText}>Have feedback?</Text>
                    <Text style={styles.text}>Good, bad or ugly, we'd love to hear from you.</Text>
                    <TouchableOpacity onPress={this.handleFeedbackEmail} style={styles.postButton}>
                        <Text style={styles.shareText}>Feedback</Text>
                    </TouchableOpacity> 
                </View>
            </View>
            
        )
    }
 
    handleSupportEmail = () => {
        const to = ['support@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'LoccTocc Support Ticket',
            body: ''
        }).catch(console.error)
    }

    handleFeedbackEmail = () => {
        const to = ['feedback@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'LoccTocc Feedback',
            body: ''
        }).catch(console.error)
    }

    handleAdvertisingEmail = () => {
        const to = ['partnerships@locctocc.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'LoccTocc Partners',
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
        flex: 1/3,
    },
    postButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#33A8FF',
        borderRadius: 6,
        paddingVertical: 3,
        paddingHorizontal: 8,
        marginBottom: 10,
      },
      titleText: {
        fontSize: 22,
        fontWeight: "bold",
        paddingTop: 20,
        paddingBottom: 10,
      },
      shareText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        alignSelf: 'center',
      },
      text: {
          paddingBottom: 10,
      },
})
