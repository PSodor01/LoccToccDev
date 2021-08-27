import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

import { Feather } from "@expo/vector-icons";

export default function HouseGuidelinesScreen() {
    return (
        <ScrollView style={{ backgroundColor: "#fff" }}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Do's and Don'ts</Text>
                </View>
                <View style={styles.dontHeader}>
                    <Feather name="check-circle" size={28} color ="green" />
                    <Text style={styles.doHeaderText}> DO</Text>
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.textRowContainer}>
                        <Text style={styles.doText}>DO </Text>
                        <Text style={styles.textBody}>{`share your ideas, insights and picks on upcoming games with the rest of the locctocc community.`}</Text>
                    </View>
                    <View style={styles.textRowContainer}>
                        <Text style={styles.doText}>DO </Text>
                        <Text style={styles.textBody}>{`throw a hammer on a post if you are taking the same bet.`}</Text>
                    </View>
                    <View style={styles.textRowContainer}>
                        <Text style={styles.doText}>DO </Text>
                        <Text style={styles.textBody}>{`gloat when you get something right.`}</Text>
                    </View>
                    <View style={styles.textRowContainer}>
                        <Text style={styles.doText}>DO </Text>
                        <Text style={styles.textBody}>{`keep the conversation relevant to that game’s message board.`}</Text>
                    </View>
                    <View style={styles.textRowContainer}>
                        <Text style={styles.doText}>DO </Text>
                        <Text style={styles.textBody}>{`call out others on their questionable picks.`}</Text>
                    </View>
                </View>
                <View style={styles.dontHeader}>
                    <Feather name="x-circle" size={28} color ="red" />
                    <Text style={styles.dontHeaderText}> DON'T</Text>
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.textRowContainer}>
                        <Text style={styles.doText}>DON'T </Text>
                        <Text style={styles.textBody}>{`spam the message boards.`}</Text>
                    </View>
                    <View style={styles.textRowContainer}>
                        <Text style={styles.doText}>DON'T </Text>
                        <Text style={styles.textBody}>{`talk politics. Not the right place and no, we don’t care about who you voted for.`}</Text>
                    </View>
                    <View style={styles.textRowContainer}>
                        <Text style={styles.doText}>DON'T </Text>
                        <Text style={styles.textBody}>{`unit shame. All ideas are welcome whether you are betting $10 or $10k.`}</Text>
                    </View>
                </View>
                    

                
                
            </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center'
    },
    headerContainer: {
        alignItems: 'center',
    },
    header: {
        margin: 10,
        fontSize: 24,
        textAlign: 'center',
        marginTop: "5%",
        marginBottom: "5%",
        fontWeight: 'bold',
    },
    textContainer: {
        width: "95%",
    },
    textBody: {
        flexShrink: 1
    },
    textRowContainer: {
        flexDirection: 'row',
        marginBottom: "5%",
    },
    doText: {
        fontWeight: 'bold',
    },
    dontHeader: {
        flexDirection: 'row',
        marginBottom: "5%",
        alignItems: 'center',
    },
    dontHeaderText: {
        color: "red",
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    doHeaderText: {
        color: "green",
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    }

    
})

