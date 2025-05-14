import { router } from 'expo-router';

import * as React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export default function UserLoginScreen () {
  return (
      <SafeAreaProvider>
        <PaperProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
            <View style={styles.container}>
              {/* 提示 */}
              <Text style={styles.tips}>登录即可体验完整功能</Text>

              <Button
                mode="contained" 
                onPress={() => router.push('/(auth)/login')}
                buttonColor={'red'}
                style={styles.loginBtn}
                labelStyle={styles.loginBtnText}
              >
                我要登录
              </Button>

              <TouchableOpacity 
                style={styles.smsLoginBtn}
                onPress={() => router.push('/(auth)/register')}
              >
                <Text style={styles.smsLoginText}>没有账号？去注册 {'>'}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </PaperProvider>
      </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',    
    alignItems: 'center',        
  },
  tips: {
    color: '#000',              
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',          
  },
  loginBtn: {
    marginTop: 20,
    marginHorizontal: 60,
    alignSelf: 'stretch',
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  smsLoginBtn: {
    alignSelf: 'center',
    marginTop: 20,
  },
  smsLoginText: {
    color: '#888',
    fontSize: 14,
  },
});
