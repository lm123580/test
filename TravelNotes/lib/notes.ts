import config from '@/lib/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

function getNameAndTypeFromUri(uri: string, idx: number = 0) {
  let uriParts = uri.split('/');
  let fileType  = uriParts[uriParts.length - 1];
  let filename = `img_${idx}.${fileType}`;
  let type = `image/${fileType}`;

  return { name: filename, type: type };
}

export const sendNote = async ({
  images,   // 图片数组，形如 [{ uri }]
  title,
  content,
}: {
  images: { uri: string }[],
  title: string,
  content: string,
}) => {
  const tokens = await AsyncStorage.getItem('userToken');
  let formData = new FormData();

  // 多张图片
  images.forEach((img, idx) => {
    // 关键：所有图片都 append 到同一个字段名（如 images[]），后端要用数组方式接收
    const { name, type } = getNameAndTypeFromUri(img.uri, idx);
    formData.append('images', {
      uri: img.uri,
      name: name,
      type: type
    } as any);
  });

  // 文本字段
  formData.append('title', title);
  formData.append('content', content);

  const response = await fetch(`${config.API_BASE_URL}/notes/addNote`, {
    method: 'POST',
    headers: {
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

export const getDetailNote = async ({
  nid,
}: { nid: any }) => {
  const tokens = await AsyncStorage.getItem('userToken');
  const response = await fetch(`${config.API_BASE_URL}/notes/getNoteDetail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${tokens}`,
    },
    body: JSON.stringify({ nid }), 
  });

  let res = await response.json();

  if (res.status === 0) {
    res.data.images = res.data.images.map((item: string) => `${config.API_BASE_URL}${item}`);
  }

  // console.log('getDetailNote data:', res);

  return res; // 返回后端响应
};

export const getBriefNotes = async ({
  notenum,
}: { notenum: any }) => {
  const response = await fetch(`${config.API_BASE_URL}/notes/getBriefNotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notenum }), 
  });

  let res = await response.json();

  if (res.status === 0 && Array.isArray(res.data)) {
    res.data = res.data.map((item: any) => ({
      ...item,
      avatar: `${config.API_BASE_URL}${item.avatar}`,
      image: `${config.API_BASE_URL}${item.image}`
    }));
  }

  // console.log('getNote data:', res);

  return res; // 返回后端响应
};

export const getSearchBriefNotes = async ({
  searchText,
}: { searchText: string }) => {
  const response = await fetch(`${config.API_BASE_URL}/notes/getSearchBriefNotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ searchText }), 
  });

  let res = await response.json();

  if (res.status === 0 && Array.isArray(res.data)) {
    res.data = res.data.map((item: any) => ({
      ...item,
      avatar: `${config.API_BASE_URL}${item.avatar}`,
      image: `${config.API_BASE_URL}${item.image}`
    }));
  }

  console.log('getNote data:', res);

  return res; // 返回后端响应
};
