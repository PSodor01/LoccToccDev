    
    import React, { useRef } from 'react';
    import { StyleSheet, TouchableOpacity, View, Text, Share } from 'react-native'

    import Ionicons from 'react-native-vector-icons/Ionicons';

    import { captureRef } from 'react-native-view-shot';


    
    const ShareButton = () => {
        const viewRef = useRef();
        const shareFunction = async () => {
            try {
                const uri = await captureRef(viewRef, {
                    format: 'png',
                    quality: 0.7
                });
                if(showInstagramStory){
                    await Share.shareSingle({
                        stickerImage: uri,
                        method: Share.InstagramStories.SHARE_STICKER_IMAGE,
                        social: Share.Social.INSTAGRAM_STORIES,
                        backgroundBottomColor: '#FF0000',
                        backgroundTopCOlor: '#FF0000',
                    })
                }
                await Share.share({ url: uri });
            } catch(err) { 
                console.error(err);
            }
        };  

        const testButton = (name, caption) => {
            console.log(name, caption)
        }

      return (
          <View>
                <TouchableOpacity
                    >
                    <Ionicons name={"ios-share"} size={20} color={"grey"} marginRight={10} />
                </TouchableOpacity>
          </View>
          
      )
  }
    
    export default ShareButton
    
    const styles = StyleSheet.create({
        
    });
    
    

