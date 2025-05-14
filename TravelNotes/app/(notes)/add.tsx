import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Provider, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sendNote } from '@/lib/notes';
import { router } from 'expo-router';

export default function PublishNoteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<{ uri: string }[]>([]);
  
  const handleAddImage = async () => {
    // 请求权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('需要访问相册权限！');
      return;
    }
    // 打开系统相册
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
      allowsEditing: false,
    });

    // 用户未取消且有图片
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([
        ...images,
        { uri: result.assets[0].uri }
      ]);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handlePublish = async () => {
    const response = await sendNote({
      images: images,
      title: title,
      content: content,
    });
    if (response.status === 0) {
      router.back();
    } else {
      alert('发布失败：' + response.message);
    }
    // console.log('response:', response);
  };


  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        {/* 导航栏 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => {router.back()}}>
            <Feather name="arrow-left" size={28} color="#666" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>发布游记</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollArea} keyboardShouldPersistTaps="handled">
          {/* 图片与视频行 */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.imagesRow}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {images.map((img, idx) => (
              <View key={idx} style={styles.imageWrapper}>
                <Image source={img} style={styles.image} />
                {/* 删除图片按钮 */}
                <TouchableOpacity style={styles.imageDelete} onPress={() => handleRemoveImage(idx)}>
                  <Feather name="x-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}

            {/* 增加图片的按钮 */}
            <TouchableOpacity style={styles.addImageBtn } onPress={handleAddImage}>
              <Feather name="plus" size={36} color="#666" />
            </TouchableOpacity>
          </ScrollView>

          {/* 游记标题和内容 */}
          <View style={styles.textInputs}>
            <TextInput
              placeholder="添加标题"
              placeholderTextColor="#bfbfbf"
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
              underlineColor="transparent"
              mode="flat"
              theme={{ colors: { text: "#222", placeholder: "#bfbfbf", primary: "#fff" } }}
            />
            <TextInput
              placeholder="添加正文"
              placeholderTextColor="#bfbfbf"
              value={content}
              onChangeText={setContent}
              style={styles.contentInput}
              underlineColor="transparent"
              mode="flat"
              multiline
              theme={{ colors: { text: "#222", placeholder: "#bfbfbf", primary: "#fff" } }}
            />
          </View>
        </ScrollView>

        {/* 底部发布按钮 */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.draftBtn}>
            <Feather name="clipboard" size={24} color="#666" />
            <Text style={styles.draftLabel}>存草稿</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={ title && content && images.length !== 0 ? styles.publishBtn : styles.disPublishBtn} 
            disabled={!title || !content || images.length === 0}
            onPress={handlePublish}
          >
            <Text style={styles.publishLabel}>发布游记</Text>
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
    paddingBottom: 80
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 0,
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  scrollArea: {
    paddingBottom: 24, // 防止内容太长被遮挡
  },
  imagesRow: {
    marginTop: 8,
    paddingLeft: 16,
    flexDirection: 'row',
    minHeight: 100,
  },
  imageWrapper: {
    marginRight: 8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    width: 96,
    height: 96,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#f3f3f3',
  },
  imageDelete: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  imageNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addImageBtn: {
    width: 96,
    height: 96,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ededed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputs: {
    marginTop: 12,
    paddingHorizontal: 22,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginBottom: 10,
    paddingHorizontal: 0,
    elevation: 0,
  },
  contentInput: {
    fontSize: 18,
    backgroundColor: 'transparent',
    minHeight: 44,
    paddingHorizontal: 0,
    elevation: 0,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: 'center',
    shadowColor: "#000",
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 5,
  },
  draftBtn: {
    backgroundColor: '#fff',
    minWidth: 100,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 50,
  },
  draftLabel: {
    color: '#666',
    fontSize: 12,
  },
  publishBtn: {
    backgroundColor: 'red',
    borderRadius: 28,
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
  },
  disPublishBtn: {
    backgroundColor: '#ccc',
    borderRadius: 28,
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
  },
  publishLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});