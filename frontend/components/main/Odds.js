import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            isLoading: true,
            dataSource: null,
        }
    }

    componentDidMount () {

        return fetch('https://facebook.github.io/react-native/movies.json')
            .then ( (response) => response.json() )
            .then( (responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson.movies,
                })
            })

        .catch((error) => {
            console.log(error)
        })
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            )
        } else {

            let movies = this.state.dataSource.map((val, key) => {
                return <View key={key} style={styles.item}>
                    <Text>{val.title}</Text>
                </View>
            })

            return (
                <View style={styles.container}>
                    {movies}
                </View>
            )
        }

        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
 
    },
    item: {
        flex: 1,
        alignSelf: 'stretch',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    }
    
})
