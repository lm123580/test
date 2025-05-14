import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal } from 'react-native-paper';

export default function AvatarPickerDialog({
  visible,
  onDismiss,
  onComplete,
}: {
  visible: boolean;
  onDismiss: () => void;
  onComplete: (uri: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setLoading(true);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      alert('需要访问相册权限！');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1.0,
      allowsEditing: true,
      aspect: [1, 1],
    });
    setLoading(false);
    if (!result.canceled) {
      setSelected(result.assets[0].uri);
    }
  };

  const handleConfirm = async () => {
    if (selected) {
      onComplete(selected);
      setSelected(null);
    }
  };

  const handleCancel = async () => {
    setSelected(null);
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleCancel} style={styles.dialog}>
        <Dialog.Title style={{ textAlign: 'center', fontSize: 20}}>
          编辑头像
        </Dialog.Title>

        <Dialog.Content style={styles.content}>
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.plusBtn}
              onPress={pickImage}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator animating={true} color="#333" />
              ) : selected ? (
                <Image source={{ uri: selected }} style={styles.avatarPreview} />
              ) : (
                <Feather name="plus" size={50} color="#333" />
              )}
            </TouchableOpacity>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Button onPress={handleCancel} labelStyle={{ fontSize: 16 }}>取消</Button>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Button onPress={ handleConfirm } disabled={!selected} labelStyle={{ fontSize: 16 }}>确定</Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: { borderRadius: 16 },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  plusBtn: {
    width: 96,
    height: 96,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#F6F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarPreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    resizeMode: 'cover',
  },
});