import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

const BadgeCount = ({ count }) => {
  if (count > 0) {
    return (
      <View
        style={{
          position: 'absolute',
          top: -5,
          right: -5,
          backgroundColor: 'red',
          borderRadius: 10,
          width: 20,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12 }}>{count}</Text>
      </View>
    );
  }
  return null;
};

const HeaderRight = () => {
  const navigation = useNavigation();
  const [badgeCount, setBadgeCount] = useState(0);

  const getNotificationBadgeCount = async () => {
    const badgeNumber = await Notifications.getBadgeCountAsync();
    setBadgeCount(badgeNumber);
  };

  useEffect(() => {
    getNotificationBadgeCount();
  }, []);

  const handleNotificationsPress = async () => {
    await Notifications.setBadgeCountAsync(0);
    setBadgeCount(0);
    navigation.navigate('Notifications');
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        style={{ alignItems: 'flex-end', marginRight: 8 }}
        onPress={() => navigation.navigate('Search')}
      >
        <MaterialCommunityIcons name="magnify" color="#fff" size={26} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ alignItems: 'flex-end', marginRight: 16 }}
        onPress={handleNotificationsPress}
      >
        <FontAwesome5 name="heart" size={24} color="#fff" />
        <BadgeCount count={badgeCount} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderRight;