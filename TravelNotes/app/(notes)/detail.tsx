import { Feather, FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Provider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import CommentList from '@/app/(notes)/comment';
import ImageGallerySwiper from '@/app/(notes)/imagegaller';
import { getDetailNote } from '@/lib/notes';
import { getUsersimpleInfo } from '@/lib/userInfo';

export default function CCFCardLayout() {
  const params = useLocalSearchParams();
  const nid = Number(params.nid);
  
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [noteImages, setNoteImages] = React.useState([]);
  const [pubUserAvatar, setPubUserAvatar] = React.useState('');
  const [pubUserName, setPubUserName] = React.useState('');
  const [pubUid, setPubUid] = React.useState('');

  // 获取游记详情
  const fetchNoteDetail = async (noteId: Number) => {
    const response = await getDetailNote({ nid: noteId });

    if (response.status === 0 && response.data) {
      setTitle(response.data.title);
      setContent(response.data.content);
      setNoteImages(response.data.images);
      setPubUid(response.data.uid);

      const userInfo = await getUsersimpleInfo({ uid: response.data.uid });
      if (userInfo.status === 0 && userInfo.data) {
        setPubUserAvatar(userInfo.data.avatar);
        setPubUserName(userInfo.data.nickname);
      }
    } else {
      console.error(response.message);
    }
  };

  React.useEffect(() => {
    fetchNoteDetail(nid);
  }, [nid]);
  
  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        {/* 导航栏 */}
        <View style={styles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => {router.back()}}>
              <Feather name="arrow-left" size={28} color="#666" />
            </TouchableOpacity>
            <Image
              source={{ uri: pubUserAvatar }} 
              style={styles.pubUserAvatar}
            />
            <Text style={styles.pubUserName}>{pubUserName}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => {router.back()}}>
              <Feather name="share-2" size={28} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollArea} keyboardShouldPersistTaps="handled">
        
          {/* 图片区域 */}
          < ImageGallerySwiper noteImages={noteImages}/>

          {/* 文字区域 */}
          <View style={{paddingHorizontal: 16}}>
            <Text style={styles.noteTitle}>{title}</Text>
            <Text style={styles.noteContent}>{content}</Text>
          </View>

          {/* 横线 */}
          <View style={{
            height: 1,
            backgroundColor: '#ddd', 
            marginTop: 16,
            width: '90%',          
            alignSelf: 'center', 
          }} />

          {/* 评论区域 */}
          <CommentList />

        </ScrollView>

        {/* 底部栏 */}
        <View style={styles.bottomBar}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder="说点什么吧…"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.iconButton} >
          <FontAwesome name="send" size={22} color="#fff" />
        </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 52
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 0,
    backgroundColor: '#fff',
    justifyContent: 'space-between', 
  },
  headerBtn: {
    padding: 4,
  },
  pubUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 6,
  },
  pubUserName: {
    fontSize: 16,
    marginLeft: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  scrollArea: {
    paddingBottom: 24, // 防止内容太长被遮挡
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    color: '#333',
    marginTop: 16,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 24,
    color: '#666',
    marginTop: 8,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    height: 52, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.50,            
    shadowRadius: 12,               
    elevation: 16,                    
  },
  textInput: {
    fontSize: 16,
    color: '#222',
  },
  iconButton: {
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,           
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  }
});