import { Feather } from '@expo/vector-icons'; // 需安装 @expo/vector-icons 或 react-native-vector-icons
import * as React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Provider, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getUserInfo, sendUserEditInfo } from '@/lib/userInfo';
import { router } from 'expo-router';

const initialFields = [
  { label: '昵称', value: '编辑昵称' },
  { label: '简介', value: '编辑个人简介' },
  { label: '性别', value: '选择性别' },
  { label: '生日', value: '编辑生日' },
  { label: '职业', value: '编辑职业' },
  { label: '学校', value: '编辑学校' },
  { label: '居住地', value: '编辑居住地' },
];

export default function userEditInfoScreen() {
  const theme = useTheme();
  const [fields, setFields] = React.useState(initialFields);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  // 打开对话框
  const handleItemPress = (idx: number) => {
    setEditIndex(idx);
    setEditValue(fields[idx].value);
    setDialogVisible(true);
  };

  // 保存修改
  const handleSave = () => {
    if (editIndex !== null) {
      const newFields = [...fields];
      newFields[editIndex] = { ...newFields[editIndex], value: editValue };
      setFields(newFields);
    }
    setDialogVisible(false);
  };

  // 读取用户信息getUserInfo
  // 读取用户信息
  React.useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo();
      if (userInfo.status === 0) {
        setFields(fields => {
          const newFields = [...fields];
          newFields[0].value = userInfo.data.nickname || '编辑昵称';
          newFields[1].value = userInfo.data.bio || '编辑个人简介';
          newFields[2].value = userInfo.data.gender || '选择性别';
          newFields[3].value = userInfo.data.birthday || '编辑生日';
          newFields[4].value = userInfo.data.occupation || '编辑职业';
          newFields[5].value = userInfo.data.school || '编辑学校';
          newFields[6].value = userInfo.data.region || '编辑居住地';
          return newFields;
        });
      } else {
        console.error(userInfo.message);
      }
    };
    fetchUserInfo();
  }, []);


    const buildUserInfo = () => {
        return {
            nickname: fields[0].value === '编辑昵称' ? '' : fields[0].value,
            bio: fields[1].value === '编辑个人简介' ? '' : fields[1].value,
            gender: fields[2].value === '选择性别' ? '' : fields[2].value,
            birthday: fields[3].value === '编辑生日' ? '' : fields[3].value,
            occupation: fields[4].value === '编辑职业' ? '' : fields[4].value,
            school: fields[5].value === '编辑学校' ? '' : fields[5].value,
            region: fields[6].value === '编辑居住地' ? '' : fields[6].value,
        };
    };

    // 提交更新事件
    const handleSubmit = async () => {
    const userInfo = buildUserInfo();
    try {
        const res = await sendUserEditInfo(userInfo);
        if (res.status === 0) {
            setVisible(true);
        } else {
            alert(res.message || '资料更新失败');
        }
    } catch (e) {
        alert('网络错误，请重试');
        console.error(e);
    }
    };

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff'}}>
        {/* 导航栏 */}
        <View style={styles.header}>
          {/* 返回 */}
          <TouchableOpacity style={styles.menuBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={28} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>编辑资料</Text>
          {/* 保存修改 */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.menuBtn} onPress={handleSubmit}>
              <Feather name="save" size={28} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1, backgroundColor: '#fff' }}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 0 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            {fields.map((item, idx) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => handleItemPress(idx)}
                  style={styles.row}
                >
                  <Text style={styles.label}>{item.label}</Text>
                  <View style={styles.valueContainer}>
                    <Text style={styles.value} numberOfLines={2} ellipsizeMode="tail">
                      {item.value}
                    </Text>
                    <Feather name="chevron-right" size={22} color="#bbb" />
                  </View>
                </TouchableOpacity>
                <View style={styles.separator} />
              </React.Fragment>
            ))}
          </View>
        </ScrollView>

        {/* 编辑弹窗 */}
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
            style={styles.dialog} 
          >
            <Dialog.Title>
              <Text style={styles.dialogTitle}>
                {editIndex !== null ? fields[editIndex].label : ''}
              </Text>
            </Dialog.Title>
            <Dialog.Content>
              {editIndex !== null && fields[editIndex].label === '性别' ? (
                // 性别用单选框
                <RadioButton.Group
                  onValueChange={setEditValue}
                  value={editValue}
                >
                  <RadioButton.Item label="男" value="男" labelStyle={styles.radioLabel} />
                  <RadioButton.Item label="女" value="女" labelStyle={styles.radioLabel} />
                </RadioButton.Group>
              ) : (
                // 其他用输入框
                <TextInput
                  // value={editValue}
                  onChangeText={setEditValue}
                  mode="outlined"
                  style={styles.input}
                  multiline={editIndex !== null && fields[editIndex].label === '简介'}
                  outlineColor="#666"
                  activeOutlineColor="#666"
                />
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>取消</Button>
              <Button onPress={handleSave}>保存</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title>提示</Dialog.Title>
            <Dialog.Content>
                <Text variant="bodyMedium">资料更新成功</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => setVisible(false)}>
                  关闭
                </Button>
            </Dialog.Actions>
            </Dialog>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
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
  headerTitle: {
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    minWidth: 64,
    flexShrink: 0,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 16,
  },
  value: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    maxWidth: 200,
    flexShrink: 1,
    marginRight: 12,
  },
  separator: {
    height: 1,
    marginLeft: 16,
    backgroundColor: '#f2f2f2',
  },
  dialog: {
    borderWidth: 1,
    borderRadius: 10,
  },
  dialogTitle: {
    fontSize: 18, // label大小
    fontWeight: 'bold',
  },
  input: {
    textAlignVertical: 'center',
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  radioLabel: {
    fontSize: 18,
    color: '#333',
  },
});