import config from '@/lib/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 获取用户信息
export const getUserInfo = async () => {
    const tokens = await AsyncStorage.getItem('userToken');
    // console.log('tokens:', tokens);

    // 发送获取用户信息请求
    const response = await fetch(`${config.API_BASE_URL}/userinfo/response`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${tokens}`,
        },
    });

    const data = await response.json();
    // console.log('data:', data);

    // 返回用户信息响应
    return {
        status: data.status,       // 0表示成功，1表示失败
        message: data.message,     // 提示信息
        data: data.data,           // 用户信息数据
    };
};

// 发送用户资料信息
export const sendUserEditInfo = async (userInfo: any) => {
    const tokens = await AsyncStorage.getItem('userToken');
    // console.log('tokens:', tokens);

    // 发送获取用户信息请求
    const response = await fetch(`${config.API_BASE_URL}/userInfo/basic`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${tokens}`,
        },
        body: JSON.stringify(userInfo),
    });

    const data = await response.json();
    // console.log('data:', data);

    // 返回用户信息响应
    return {
        status: data.status,       // 0表示成功，1表示失败
        message: data.message,     // 提示信息
        data: data.data,           // 用户信息数据
    };
}


// 发送用户头像
export const sendUserAvatar = async (uri: string) => {
    const tokens = await AsyncStorage.getItem('userToken');

    // const context = useImageManipulator(uri);
    // const image = await context.renderAsync();
    // const res = await image.saveAsync({
    // format: SaveFormat.PNG,
    // });
    // console.log('res:', res.uri);
    // setSelected(res.uri);

    // 从 uri 获取文件后缀
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    let filename = `avatar.${fileType}`;
    let type = `image/${fileType}`;

    // 构造 FormData
    let formData = new FormData();
    formData.append('avatar', {
        uri,
        name: filename,
        type,
    } as any);

    // 不要写 Content-Type，fetch 会自动生成
    const response = await fetch(`${config.API_BASE_URL}/userInfo/avatar`, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data', // 注释掉
            'Authorization': `${tokens}`,
        },
        body: formData,
    });

    const data = await response.json();
    return {
        status: data.status,
        message: data.message,
        data: data.data,
    };
};

// 获取用户基本信息
export const getUsersimpleInfo = async ( { uid } : {uid : string} ) => {
    // 发送获取用户信息请求
    const response = await fetch(`${config.API_BASE_URL}/userInfo/simple`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
    });

    let res = await response.json();

    if (res.status === 0) {
        res.data.avatar = `${config.API_BASE_URL}${res.data.avatar}`;
    }
    // console.log('data:', res);

    // 返回用户信息响应
    return {
        status: res.status,       // 0表示成功，1表示失败
        message: res.message,     // 提示信息
        data: res.data,           // 用户信息数据
    };
}