import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";


type SearchInputBarProps = {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onBackPress: () => void;
  onCameraPress: () => void;
  onSearchPress: () => void;
};

function SearchInputBar({
  value,
  placeholder,
  onChangeText,
  onBackPress,
  onCameraPress,
  onSearchPress,
}: SearchInputBarProps) {
  return (
    <View style={styles.container}>
      {/* 返回箭头 */}
      <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
        <Feather name="arrow-left" size={26} color="#666" />
      </TouchableOpacity>
      {/* 圆角输入框 */}
      <View style={styles.inputWrapper}>
        <Feather name="search" size={20} color="#b0b0b0" style={{ marginLeft: 10 }} />
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          style={styles.input}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          selectionColor="#aaa"
          dense
          mode="flat"
          theme={{
            colors: { background: "transparent", text: "#222", placeholder: "#b0b0b0" },
          }}
        />
        <TouchableOpacity onPress={onCameraPress} style={styles.iconBtn}>
          <Feather name="maximize" size={22} color="#b0b0b0" />
        </TouchableOpacity>
      </View>
      {/* 右侧搜索按钮 */}
      <TouchableOpacity style={styles.searchBtn} onPress={onSearchPress}>
        <Text style={styles.searchBtnText}>搜索</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backBtn: {
    padding: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 22,
    height: 40,
    marginLeft: 12,
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  iconBtn: {
    padding: 6,
    marginRight: 8,
  },
  searchBtn: {
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: {
    fontSize: 16,
    color: "#666",
  },
});

export default SearchInputBar;