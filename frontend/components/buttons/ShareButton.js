    
    import React from 'react';
    import { StyleSheet, TouchableOpacity, Text, Share } from 'react-native'

    import Ionicons from 'react-native-vector-icons/Ionicons';

    
    const ShareButton = () => {
        
        const onShare = async () => {
            try {
              const result = await Share.share({
                message:
                  'React Native | A framework for building native apps using React',
              });
              if (result.action === Share.sharedAction) {
                if (result.activityType) {
                  // shared with activity type of result.activityType
                } else {
                  // shared
                }
              } else if (result.action === Share.dismissedAction) {
                // dismissed
              }
            } catch (error) {
              alert(error.message);
            }
          };
        
        return (
            <TouchableOpacity
                onPress={onShare}>
                <Ionicons name={"ios-share"} size={20} color={"grey"} marginRight={10} />
            </TouchableOpacity>
        )
    }
    
    export default ShareButton
    
    const styles = StyleSheet.create({
        
    });
    
    

