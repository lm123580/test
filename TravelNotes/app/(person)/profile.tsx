import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Provider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import AvatarPickerDialog from '@/app/(person)/editavaster';
import config from '@/lib/config';
import { isUserLogin, logOut } from '@/lib/userAuth';
import { getUserInfo, sendUserAvatar } from '@/lib/userInfo';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';


export default function UserProfileScreen() {
  const [activeTab, setActiveTab] = React.useState('published');
  const [nickname, setNickname] = React.useState('默认昵称');
  const [userId, setUserId] = React.useState('00000000');
  const [gender, setGender] = React.useState('男');
  const [bio, setBio] = React.useState('点击这里，填写简介');
  const [region, setRegion] = React.useState('未知');
  const [avatar, setAvatar] = React.useState('');
  const [numofconcerns, setNumofConcerns] = React.useState(0);
  const [numoffans, setNumofFans] = React.useState(0);
  const [numoflikes, setNumofLikes] = React.useState(0);


  const [editAvatarDialogVisible, setEditAvatarDialogVisible] = React.useState(false);

  // 获取用户信息
  useEffect(
    React.useCallback(() => {
      const fetchUserInfo = async () => {
        const isLogin = await isUserLogin();
        if (isLogin) {
          const userInfo = await getUserInfo();
          if (userInfo.status === 0) {
            setUserId(userInfo.data.uid);

            setNickname(userInfo.data.nickname);

            if (userInfo.data.gender !== '') {
              setGender(userInfo.data.gender);
            }
            
            if (userInfo.data.bio !== '') {
              setBio(userInfo.data.bio);
            }
            
            if (userInfo.data.region !== '') {
              setRegion(userInfo.data.region);
            }
            
            if (userInfo.data.avatar !== '') {
              setAvatar(`${config.API_BASE_URL}${userInfo.data.avatar}`);
              // console.log('avatar:', `${config.API_BASE_URL}${userInfo.data.avatar}`);
            }
            else {
              setAvatar('http://10.206.1.95:3000/images/2.jpg');
            }

            // if (userInfo.data.numofconcerns !== 0) {
            //   setNumofConcerns(userInfo.data.numofconcerns);
            // }
            
            // if (userInfo.data.numoffans !== 0) {
            //   setNumofFans(userInfo.data.numoffans);
            // }
            
            // if (userInfo.data.numoflikes !== 0) {
            //   setNumofLikes(userInfo.data.numoflikes);
            // }
          } else {
            console.error('Failed to fetch user info:', userInfo.message);
          }
        } 
      };
      fetchUserInfo();
    }, [])
  );
  
  // 退出登录
  const handleLogout = async () => {
    try {
    await logOut();
      router.canDismiss() && router.dismissAll();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  // 处理头像编辑
  const handleAvatarComplete = async (uri: string) => {
    try {
        // 压缩头像
        const context = ImageManipulator.manipulate(uri)
        context.resize({width:128});
        const image = await context.renderAsync();
        const ress = await image.saveAsync({
        format: SaveFormat.PNG,
      });

      // 上传头像
      const res = await sendUserAvatar(ress.uri);
      if (res.status === 0) {
        setAvatar(res.data.avatar);
      } else {
        console.error('Failed to upload avatar:', res.message);
      }
    }
    catch (error) {
      console.error('Error during avatar upload:', error);
    }

    setEditAvatarDialogVisible(false);
  };


  return (
    <Provider>
      <SafeAreaView style={{flex: 1, backgroundColor: '#666'}}>
        {/* 导航栏 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuBtn}>
            <Feather name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.menuBtn} onPress={handleLogout}>
              <Feather name="log-out" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{  flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
        >
        
        {/* 个人信息 */}
        <View style={{ flex: 1 }}>
          {/* 基础信息 */}
          <View style={styles.profileSection}>
            {/* 头像和按钮 */}
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: avatar }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.avatarAdd} onPress={() => setEditAvatarDialogVisible(true)}>
                <Ionicons name="add-circle" size={20} color="#FFD600" />
              </TouchableOpacity>
            </View>

            {/* 性别、昵称、UID和地区 */}
            <View style={{ flex: 1, marginLeft: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons 
                  name={gender === '男' ? "male" : "female"} 
                  size={20} 
                  color={gender == '男' ? "#96BFF5": "#EE82EE"}
                />
                <Text style={styles.nickname}>{nickname}</Text>
              </View>

              <View style={{ marginTop: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather name="award" size={14} color="#b2b2b2" />
                  <Text style={styles.userId}>UID: {userId}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Feather name="info" size={14} color="#b2b2b2" />
                  <Text style={styles.userId}>居住地: {region}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 个人简介 */}
          <TouchableOpacity onPress={() => router.push('/editinfo')}>
            <Text style={styles.bio}>{bio}</Text>
          </TouchableOpacity>

          {/* 关注、编辑资料和设置 */}
          <View style={styles.statsRow}>

            {/* Stats */}
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{numofconcerns}</Text>
              <Text style={styles.statLabel}>关注</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{numoffans}</Text>
              <Text style={styles.statLabel}>粉丝</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{numoflikes}</Text>
              <Text style={styles.statLabel}>获赞与收藏</Text>
            </View>
            {/* Edit & Settings Buttons */}
            <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/editinfo')}>
              <Text style={styles.editBtnText}>编辑资料</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingBtn}>
              <Feather name="settings" size={20} color="#444" />
            </TouchableOpacity>
          </View>
          <View style={{ height: 30}} />
        </View>

        {/* 发表帖子 */}
        <View>
          <View style={styles.tabsRow}>
            {/* 已发布 */}
            <TouchableOpacity onPress={() => setActiveTab('published')}>
              <Text style={[styles.tab, activeTab === 'published' && styles.tabActive]}>已发布</Text>
            </TouchableOpacity>
            <View style={styles.tabDivider} />

            {/* 待审核 */}
            <TouchableOpacity style={styles.lockWrap} onPress={() => setActiveTab('review')}>
              <Text style={[styles.tab, activeTab === 'review' && styles.tabActive]}>待审核</Text>
            </TouchableOpacity>
            <View style={styles.tabDivider} />

            {/* 草稿箱 */}
            <TouchableOpacity onPress={() => setActiveTab('draft')}>
              <Text style={[styles.tab, activeTab === 'draft' && styles.tabActive]}>草稿箱</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />

            {/* 搜索按钮 */}
            <Feather name="search" size={20} color="#bcbcbc" style={{ marginRight: 12 }} />
          </View>
        </View>

          {/* Empty Content */}
          <View style={styles.emptyBox}>
            <Text style={{ color: '#888', fontSize: 16, marginTop: 100 }}>
              哦哦那些大开眼界的神反转 😱
            </Text>
            <TouchableOpacity style={styles.emptyBtn}>
              <Text style={{ color: '#444', fontSize: 16 }}>去分享</Text>
            </TouchableOpacity>
          </View>

          <AvatarPickerDialog
            visible={editAvatarDialogVisible}
            onDismiss={() => setEditAvatarDialogVisible(false)}
            onComplete={uri => {
              handleAvatarComplete(uri);
            }}
          />
          
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    height: 52,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBtn: {
    padding: 4,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  avatarAdd: {
    position: 'absolute',
    bottom: 4,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  nickname: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
    marginLeft: 8,
  },
  userId: {
    fontSize: 13,
    color: '#e0e0e0',
    marginRight: 2,
  },
  dot: {
    color: '#b2b2b2',
    marginHorizontal: 4,
    fontSize: 15,
  },
  bio: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    marginRight: 18,
  },
  statNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    color: '#d8d8d8',
    fontSize: 12,
    marginTop: 2,
  },
  editBtn: {
    marginLeft: 22,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtnText: {
    color: '#333',
    fontSize: 15,
    fontWeight: 'bold',
  },
  settingBtn: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  actionRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  actionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  actionDesc: {
    color: '#bcbcbc',
    fontSize: 12,
  },
  tabsRow: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 44,
    paddingLeft: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  tab: {
    fontSize: 14,
    color: '#727272',
    marginRight: 22,
    fontWeight: 'bold',
  },
  tabActive: {
    fontSize: 14,
    color: '#df2d2d',
    borderBottomWidth: 3,
    borderColor: '#df2d2d',
  },
  lockWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#ededed',
    marginHorizontal: 8,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 1000,
    backgroundColor: '#fff',
  },
  emptyBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 22,
    marginTop: 10,
    backgroundColor: '#fff',
  },
});