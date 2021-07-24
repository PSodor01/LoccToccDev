import React, {useState} from 'react';
import {View, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Text} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

// do not forget to add fresco animation to build.gradle


const GifButton = () => {
    const [gifs, setGifs] = useState([]);
    const [term, updateTerm] = useState('');
    const [image, setImage] = useState(null);

    async function fetchGifs() {
    
    try {
        const API_KEY = '17HE4ZOjp4kGtW49q3cnlJzkvDNZBJzh';
        const BASE_URL = 'http://api.giphy.com/v1/gifs/search';
        const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
        const res = await resJson.json();
        setGifs(res.data);
        } catch (error) {
            console.warn(error);
        }
    } /// add facebook fresco
    
    function onEdit(newTerm) {
        updateTerm(newTerm);
        fetchGifs();
    }

    pickGif = (url) => {
    let result = (url);
    console.log(result);

    if (!result.cancelled) {
        setImage(result.url);
    }
    };

    let Image_Http_URL ={ uri: 'https://media4.giphy.com/media/Xgjoi3XC5bU392OskL/giphy.gif?cid=89b8a824zfw4sf77jbw3f5kpwl630ukpamc4waq881nnt8q6&rid=giphy.gif&ct=g'};


    renderInner = () => (
        <View style={styles.panel}>
            <FlatList
                data={gifs}
                renderItem={({item}) => ( 
                    <View style={styles.containerImage}>
                        <TouchableOpacity onPress={()=>this.pickGif(item.images.original.url)}>
                            <Image
                            style={styles.image}
                            source={{uri: item.images.original.url}}
                            numColumns={1}
                            />
                        </TouchableOpacity>
                    </View>
                      
                )}
            />
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => this.bs.current.snapTo(1)}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    
      renderHeader = () => (
        <View style={styles.header}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
            <View style={styles.searchSection}>
                <FontAwesome5 name="search-dollar" color="grey" size={20} alignItems='center' />
                <TextInput
                    placeholder="Search Giphy"
                    style={styles.textInput}
                    onChangeText={(text) => onEdit(text)}
                />
            </View>
          </View>
        </View>
      );

    bs = React.createRef();
    fall = new Animated.Value(1);

    

return (
    <View style={styles.container}>
        <BottomSheet 
            ref={this.bs}
            snapPoints={[450, -5]}
            renderContent={this.renderInner}
            renderHeader={this.renderHeader}
            initialSnap={1}
            callbackNode={this.fall}
            enabledGestureInteraction={true}       
        />
        <Animated.View style={{margin: 20, 
        opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
        }}>
            <View>
                <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                    <MaterialCommunityIcons name="gif" size={24} justifyContent='center'/>
                </TouchableOpacity>
                <Text>hello</Text>
                <Image source={Image_Http_URL} style = {{height: 200, resizeMode : 'stretch', margin: 5 }} />
            </View>
         </Animated.View>
    </View>

    );
}

export default GifButton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    textInput: {
        height: 30,
        width: "75%",
        marginBottom: "5%",
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#e5e7e9"

    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        width: '100%',
      },
      header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      panelHeader: {
        alignItems: 'center',
      },
      panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
      },
      panelTitle: {
        fontSize: 27,
        height: 35,
      },
      panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
      },
      panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#2e64e5',
        alignItems: 'center',
        marginVertical: 7,
      },
      panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
      },
      image: {
        width: 200,
        height: 150,
        marginBottom: 5,
        borderRadius: 10,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    profilePhotoContainer: {
        width: 100,
        height: 100,
        borderRadius: 40,
        alignSelf: 'center',
        marginTop: 16,
        overflow: 'hidden',
        marginBottom: 10,

    },
    
        
});

  
