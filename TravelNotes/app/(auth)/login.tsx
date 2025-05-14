import { router, useNavigation } from 'expo-router';
import * as React from 'react';
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { login } from '@/lib/userAuth';

export default function MyComponent () {
  const [account, setaccount] = React.useState(''); // 新增：保存账号
  const [password, setPassword] = React.useState(''); // 新增：保存密码
  const [loading, setLoading] = React.useState(false)
  const [loginError, setLoginError] = React.useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
      try {
        setLoading(true);
        const res = await login(account, password);
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false);

        if (res.status === 0) {
          router.canDismiss() && router.dismissAll();
          router.push('/(tabs)/profile');
        } else {
          setLoginError(res.message);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error:', error);
      }
  }

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#fff' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="手机号/邮箱登陆" titleStyle={styles.barText} />
      </Appbar.Header>

      <SafeAreaProvider>
        <PaperProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
            <View style={styles.container}>
              {/* 账号 */}
              <View style={styles.inputRow}>
                <Text style={styles.label}>账号</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入手机号或邮箱"
                  placeholderTextColor="#ddd"
                  value={account}
                  onChangeText={setaccount}
                />
              </View>
              <View style={styles.underline} />
              
              {/* 密码 */}
              <View style={styles.inputRow}>
                <Text style={styles.label}>密码</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入密码"
                  placeholderTextColor="#ddd"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity>
                  <Text style={styles.forgot}>忘记密码</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.underline} />
              
              
              {loginError && (<Text style={styles.logErrorText}>{loginError}</Text>)}

              <Button
                mode="contained" 
                onPress={handleLogin} 
                buttonColor={loading ? '#ffc0cb' : 'red'}
                loading={loading}
                disabled={!account || !password}
                style={styles.loginBtn}
                labelStyle={styles.loginBtnText}
              >
                登陆
              </Button>

              {/* 账号注册 */}
              <TouchableOpacity 
                style={styles.smsLoginBtn}
                onPress={() => {setLoginError(''); router.push('/(auth)/register')}}
              >
                <Text style={styles.smsLoginText}>没有账号？去注册 {'>'}</Text>
              </TouchableOpacity>
            </View>

            {/* 登录遇到问题 */}
            <Text style={styles.tips}>登录遇到问题</Text>
          </SafeAreaView>
        </PaperProvider>
      </SafeAreaProvider>
    </>
  );
};


const styles = StyleSheet.create({
  barText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    left: '15%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    marginBottom: 0,
    height: 48,
  },
  label: {
    fontSize: 16,
    color: '#222',
    width: 60,
    marginRight: 6,
    fontWeight: '400',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  forgot: {
    color: 'red',
    fontSize: 16,
    marginLeft: 8,
  },
  underline: {
    height: 1,
    backgroundColor: '#f4f4f4',
    marginHorizontal: 36,
  },
  loginBtn: {
    marginTop: 10,
    marginHorizontal: 36,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smsLoginBtn: {
    alignSelf: 'center',
    marginTop: 18,
  },
  smsLoginText: {
    color: '#888',
    fontSize: 14,
  },
  logErrorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
  },
  tips: {
    color: '#bbb',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },

});
