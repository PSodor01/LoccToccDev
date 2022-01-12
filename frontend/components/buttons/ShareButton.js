    
    import React, { useRef } from 'react';
    import { StyleSheet, TouchableOpacity, View, Text, Share } from 'react-native'

    import Ionicons from 'react-native-vector-icons/Ionicons';

    import { captureRef } from 'react-native-view-shot';


    
    const ShareButton = () => {
        const viewRef = useRef();
        const shareDummyImage = async () => {
            try {
                const uri = await captureRef(viewRef, {
                    format: 'png',
                    quality: 0.7
                });
                await Share.share({ url: uri });
            } catch(err) { 
                console.error(err);
            }
        };  

      return (
          <View>
            <View ref={viewRef}>
                <Text>@locctocc</Text>
                
            </View>
                <TouchableOpacity
                    onPress={shareDummyImage}>
                    <Ionicons name={"ios-share"} size={20} color={"grey"} marginRight={10} />
                </TouchableOpacity>
          </View>
          
      )
  }
    
    export default ShareButton
    
    const styles = StyleSheet.create({
        
    });
    
    

