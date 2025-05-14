import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

import { isUserLogin } from '@/lib/userAuth';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // 处理添加按钮点击事件
  const handleAddPress = async () => {
    // 检查是否登陆
    const isLoggedIn = await isUserLogin();

    if (!isLoggedIn) {
      router.push('/(tabs)/profile');
    } else {
      router.push('/(notes)/add');
    }
  };
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#687076',
        headerShown: false,
        tabBarButton: HapticTab,
        animation: 'fade',
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: ({ accessibilityState, accessibilityLabel, testID }) => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                accessibilityState={accessibilityState}
                accessibilityLabel={accessibilityLabel}
                testID={testID}
                onPress={handleAddPress}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: 'red', 
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                {/* 白色十字 */}
                <View
                  style={{
                    position: 'absolute',
                    width: 30,
                    height: 6,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    width: 6,
                    height: 30,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
          ),
          tabBarLabelStyle: {
            display: 'none',
          },
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
