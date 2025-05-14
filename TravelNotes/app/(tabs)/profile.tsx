
import UserLoginScreen from '@/app/(person)/login';
import UserProfileScreen from '@/app/(person)/profile';
import React from 'react';
import { View } from 'react-native';

import { isUserLogin as checkUserLogin } from '@/lib/userAuth';
import { useFocusEffect } from 'expo-router';

export default function profile () {
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkLogin = async () => {
        const res = await checkUserLogin();
        setUserLoggedIn(res);
      };
      checkLogin();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      {userLoggedIn ? <UserProfileScreen /> : <UserLoginScreen />}
    </View>
  );
};

