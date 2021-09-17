
import React from 'react';
import { Text, View, StyleSheet, Linking } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';



export default function LegalDocsScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.documentRow}>
                <FontAwesome name={"pencil-square-o"} color={"black"} size={16}/>
                <Text style={styles.disclaimerText}>
                    {' '}
                        <Text
                            style={styles.hyperlinkStyle}
                            onPress={() => {
                            Linking.openURL('https://locctocc.flycricket.io/privacy.html');
                            }}>
                            Privacy Policy 
                        </Text>
                </Text>
            </View>
            <View style={styles.documentRow}>
                <FontAwesome name={"pencil-square-o"} color={"black"} size={16}/>
                <Text style={styles.disclaimerText}>
                    {' '}
                        <Text
                            style={styles.hyperlinkStyle}
                            onPress={() => {
                            Linking.openURL('https://locctocc.flycricket.io/terms.html');
                            }}>
                            Terms and Conditions 
                        </Text>
                </Text>
            </View>
            <View style={styles.documentRow}>
                <FontAwesome name={"pencil-square-o"} color={"black"} size={16}/>
                <Text style={styles.disclaimerText}>
                    {' '}
                        <Text
                            style={styles.hyperlinkStyle}
                            onPress={() => {
                            Linking.openURL('https://www.termsfeed.com/live/b4eefe2f-ded8-405c-bf83-3e9272e2eb34');
                            }}>
                            End-User License Agreement 
                        </Text>
                </Text>
            </View>
            
            
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    documentRow: {
        flexDirection: 'row',
        padding: 10,
        marginRight: "5%",
        borderBottomColor: "#e1e2e6",
        borderBottomWidth: 1,
    },
    hyperlinkStyle: {
        fontSize: 16,
  },
    
})

