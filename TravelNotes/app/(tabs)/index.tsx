import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, FlatList, Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Provider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getBriefNotes, getSearchBriefNotes } from '@/lib/notes';
import { isUserLogin } from '@/lib/userAuth';
import { router } from 'expo-router';

import SearchInputBar from '@/app/(notes)/searchbar';


export default function Index() {
  type NoteItem = {
    nid: number;
    title: string;
    image: string;
    nickname: string;
    avatar: string;
    likes: number;
  };

  const [data, setData] = React.useState<NoteItem[]>([]);
  const [beforeSearchData, setBeforeSearchData] = React.useState<NoteItem[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchMode, setSearchMode] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  // 划到底部获取新的游记
  const handleLoadNotes = async () => {
    if (!searchMode)
    {
      const res = await getBriefNotes({ notenum: 10 });
      if (Array.isArray(res.data)) {
        setData(prev => {
          // 合并去重，nid为唯一键
          const merged = [...prev, ...res.data];
          const unique = Array.from(new Map(merged.map(item => [item.nid, item])).values());
          return unique;
        });
      }      
    }
  };

  // 刷新游记
  const handleRefrashNotes = async () => {
    if (!searchMode)
    {
      setRefreshing(true);
      
      const res = await getBriefNotes({ notenum: 10 });
      if (res.status === 0) {
        setData(res.data);
      } else {
        console.error(res.message);
      }

      setRefreshing(false);      
    }
  };

  // 如果有相机需求
  const openCamera = async () => {
  }

  // 搜索功能
  const doSearch = async () => {
    setBeforeSearchData(data);
    const res = await getSearchBriefNotes({ searchText });
    if (res.status === 0) {
      setData(res.data);
    } else {
      console.error(res.message);
    }
  }

  // 计算卡片宽度
  const numColumns = 2;
  const cardWidth = (Dimensions.get('window').width - 8) / numColumns;

  // 渲染卡片
  const renderItem: ListRenderItem<NoteItem> = ({ item }) => (
    <TouchableOpacity
      onPress={async () => {
        const Logined = await isUserLogin();
        if (Logined) {
          router.push({ pathname: '/(notes)/detail', params: { nid: item.nid } });
        } else {
          router.push('/(tabs)/profile');
        }
      }}
    >
      <Card key={item.nid} style={[styles.cards, { width: cardWidth }]}>
        {/* 简介图 */}
        <Card.Cover source={{ uri: item.image }} style={styles.cards}/>
        {/* 介绍文本 */}
        <Card.Content style={{ paddingHorizontal: 6 }}>
          <View style={{ flexDirection: 'column' }}>
            {/* 标题 */}
            <Text style={{ fontSize: 12 }} numberOfLines={2}>{item.title}</Text>
            {/* 发布者信息 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                />
                <Text style={{ fontSize: 8, marginLeft: 4, color: '#666' }}>{item.nickname}</Text>                          
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="heart" size={16} color="#666" />
                <Text style={{ fontSize: 10, marginLeft: 4, color: '#666' }}>{item.likes}</Text>                          
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>

  );

  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        {/* 导航栏 */}
        {searchMode ? (
          // 搜索模式的导航栏
          <View>
            <View style={styles.header}>
              <SearchInputBar
                value={searchText}
                placeholder="请输入搜索内容"
                onChangeText={setSearchText}
                onBackPress={() => {
                  setSearchMode(false);
                  setData(beforeSearchData);
                }}
                onCameraPress={openCamera}
                onSearchPress={doSearch}
              />
            </View>
          </View>
        ) : (
          // 非搜索模式的导航栏
          <View>
            <View style={styles.header}>
              <TouchableOpacity style={{padding: 4}}>
                <Feather name="menu" size={28} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 4 }}
                onPress={() => {
                  setSearchMode(true);
                  setSearchText('');
                }}
              >
                <Feather name="search" size={28} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        )}


        {/* FlatList 瀑布流展示游记 */}
        <FlatList
          data={data}
          renderItem={renderItem}
          onEndReached={handleLoadNotes}
          onEndReachedThreshold={0.2}
          onRefresh={handleRefrashNotes}
          refreshing={refreshing}
          keyExtractor={(item) => item.nid.toString()}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 1, justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 16, paddingTop: 4 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  cards: {
    margin: 2,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cardImage: {
    width: '100%',
    borderRadius: 2,
  },
});