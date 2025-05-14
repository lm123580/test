import config from '@/lib/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 登录事件
export const login = async (account: string, password: string) => {
    // 发送登录请求
    const response = fetch(`${config.API_BASE_URL}/users/login`, {
      method: 'POST', // 或 'PUT'
      headers: {
        'Content-Type': 'application/json', // 告诉服务器接收 JSON
      },
      body: JSON.stringify({
        account: account,
        password: password,
      }),
    })
    
    // 解析token json
    const data = await (await response).json();

    // 保存 token 到本地
    if (data.data.token) {
      try {
        // 使用 AsyncStorage 保存 token
        await AsyncStorage.setItem('userToken', data.data.token);
      } catch (e) {
        console.error('保存 token 失败:', e);
      }
    }
    // 返回登录响应
    return {
      status:  data.status,    // 0表示成功，1表示失败
      message: data.message,  // data.msg
    };
};

// 注册事件
export const register = async (account: string, password: string) => {
    // 发送登录请求
    const response = fetch(`${config.API_BASE_URL}/users/register`, {
      method: 'POST', // 或 'PUT'
      headers: {
        'Content-Type': 'application/json', // 告诉服务器接收 JSON
      },
      body: JSON.stringify({
        account: account,
        password: password,
      }),
    })
    
    const data = await (await response).json();

    // 返回注册响应
    return {
      status:  data.status,    // 0表示成功，1表示失败
      message: data.message,  // data.msg
    };
};

// 用户是否登陆
export const isUserLogin = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token !== null;
  } catch (e) {
    console.error('获取 token 失败:', e);
    return false;
  }
}

// 获取用户Token
export const getUserToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (e) {
    console.error('获取 token 失败:', e);
    return null;
  }
}

// 用户退出
export const logOut = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (e) {
    console.error('删除 token 失败:', e);
  }
}
