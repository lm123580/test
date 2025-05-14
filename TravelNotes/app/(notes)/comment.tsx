import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const comments = [
  {
    avatar: 'http://10.206.1.95:3000/src/user/0000003/notes/0/uyb2p4hg.png',
    nickname: '小明',
    content: '这是第一条评论',
    likes: 5,
  },
  {
    avatar: 'http://10.206.1.95:3000/src/user/0000003/notes/0/uyb2p4hg.png',
    nickname: '小红',
    content: '这是第二条评论，很有意思！',
    likes: 5,
  },
  {
    avatar: 'http://10.206.1.95:3000/src/user/0000003/notes/0/uyb2p4hg.png',
    nickname: '小刚',
    content: '这是第三条评论，学习了！这是第三条评论，学习了！这是第三条评论，学习了！这是第三条评论，学习了！这是第三条评论，学习了！这是第三条评论，学习了！这是第三条评论，学习了！',
    likes: 3,
  },
];

export default function CommentList() {

  // 用于存储每条评论的点赞数
  const [likeCounts, setLikeCounts] = React.useState(comments.map(c => c.likes || 0));

  // 用于存储每条评论是否已被当前用户点赞
  const [liked, setLiked] = React.useState(comments.map(() => false));

  const handleLike = (idx: number) => {
    setLikeCounts(prev => prev.map((count, i) => i === idx ? (liked[idx] ? count - 1 : count + 1) : count));
    setLiked(prev => prev.map((flag, i) => i === idx ? !flag : flag));
  };
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.noteTitle}>评论</Text>
      {comments.map((item, idx) => (
        <View key={idx} style={styles.commentRow}>
          
          {/* 头像 */}
          <Image source={{ uri: item.avatar }} style={styles.avatar} />

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
            {/* 昵称和评论 */}
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={styles.nickname}>{item.nickname}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
            {/* 点赞 */}
            <View>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => handleLike(idx)}
                activeOpacity={0.7}
              >
                <Feather
                  name="thumbs-up"
                  size={14}
                  color={liked[idx] ? 'red' : '#aaa'}
                />
                <Text style={{fontSize: 14, color: '#aaa', marginLeft: 4}}>{likeCounts[idx]}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    paddingHorizontal: 8,
    marginTop: 16,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 8,
    marginTop: 28,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  nickname: {
    fontSize: 12,
    color: '#aaa',
  },
  commentText: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 4,
  },
});