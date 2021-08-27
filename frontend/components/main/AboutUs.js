import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

export default function AboutUsScreen() {
    return (
        <ScrollView style={{ backgroundColor: "#fff" }}>
            <View style={styles.container}>
                <Text></Text>
                <Text style={styles.header}>Welcome to locctocc</Text>
                <Text style={styles.textBody}>{`Like to bet on sports but not sure who to take tonight? Or are you on a hot streak and everything you touch hits? Either way you've come to the right place.`}</Text>
                <Text></Text>
                <Text style={styles.textBody}>{`locctocc is an interactive community designed for professional and casual sports bettors to collaborate and share ideas.`}</Text>
                <Text></Text>
                <Text style={styles.textBody}>{`Started by two guys who would frequently see "who ya got" and "who do we like tonight" group texts every day, but too often found that the next morning would be filled with "mush", "bad beat", and "need some winners today".`}</Text>
                <Text></Text>
                <Text style={styles.textBody}>{`Our goal is to provide a platform for sports bettors of all levels to share ideas, statistics, or strategies that could help give members of our community an edge.`}</Text>
                <Text></Text>
                <Text style={styles.textBody}>{`We are looking forward to sharing locks and collaborating with everyone.`}</Text>
            </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#fff",
    },
    header: {
        margin: 10,
        fontSize: 24,
        textAlign: 'center',
        marginTop: "5%",
        marginBottom: "10%",
    },
    textBody: {
        marginLeft: "5%",
        marginRight: "5%",
        textAlign: 'justify'
    }
    
})

