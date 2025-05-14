import { router, useNavigation } from 'expo-router';
import * as React from 'react';
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Checkbox, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { login, register } from '@/lib/userAuth';

export default function MyComponent () {
  const [checked, setChecked] = React.useState(false);
  const [account, setaccount] = React.useState(''); // 新增：保存账号
  const [password, setPassword] = React.useState(''); // 新增：保存密码
  const [registerError, setRegisterError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();
  
  const handleRegister = async () => {
      try {
        setLoading(true);
        const res = await register(account, password);
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false);

        if (res.status === 0) {
          const log_res = await login(account, password);
          if (log_res.status === 0) {
            router.canDismiss() && router.dismissAll();
            router.push('/(tabs)/profile');
            console.log('注册成功，自动登录成功');
          }
          else {
            setRegisterError(log_res.message);
            console.log('注册成功，自动登录失败');
          }
        } else {
          setRegisterError(res.message);
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
        <Appbar.Content title="手机号/邮箱注册" titleStyle={styles.barText} />
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
              </View>
              <View style={styles.underline} />

              {/* 协议 */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.protocolRow}
                onPress={() => setChecked(!checked)}
              >
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  onPress={() => setChecked(!checked)}
                  color="#0096a6"
                  uncheckedColor="#bbb"
                />
                <View style={styles.protocolTextBox}>
                  <Text style={styles.protocolText}>
                    我已阅读并同意
                    <Text style={styles.protocolLink}>《用户协议》</Text>
                    、<Text style={styles.protocolLink}>《隐私政策》</Text>
                    、<Text style={styles.protocolLink}>《儿童/青少年个人信息保护规则》</Text>
                  </Text>
                </View>
              </TouchableOpacity>

              {registerError && (<Text style={styles.logErrorText}>{registerError}</Text>)}

              <Button 
                mode="contained" 
                onPress={handleRegister} 
                buttonColor={loading ? '#ffc0cb' : 'red'}
                loading={loading}
                disabled={!account || !password || !checked}
                style={styles.loginBtn}
                labelStyle={styles.loginBtnText}
              >
                注册
              </Button>
            </View>

            {/* 注册遇到问题 */}
            <Text style={styles.tips}>注册遇到问题</Text>
          </SafeAreaView>
        </PaperProvider>
      </SafeAreaProvider>
    </>
  );
};


const styles = StyleSheet.create({
  textInput : {
    width: 300,
    height: 48,
    backgroundColor: '#fff'
  },
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
   protocolRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',    // 让checkbox和文字顶部对齐
    paddingHorizontal: 36,
    paddingVertical: 10,
  },
  protocolTextBox: {
    flex: 1,                    // 让文本区域自动占满剩余空间
    justifyContent: 'flex-start',
  },
  protocolText: {
    fontSize: 12,
    color: '#bbb',
    lineHeight: 22,
  },
  protocolLink: {
    color: '#0096a6',
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
