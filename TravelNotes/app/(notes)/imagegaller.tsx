import React, { useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// noteImages 作为 props 传入
interface ImageGallerySwiperProps {
  noteImages: string[];
}

export default function ImageGallerySwiper ({ noteImages = [] }: ImageGallerySwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const scrollRef = useRef(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(
      (event.nativeEvent.contentOffset.x + slideSize / 2) / slideSize
    );
    setActiveIndex(index);
  };

  // 显示全屏图片
  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalVisible(true);
  };

  // 关闭全屏图片
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.galleryContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {noteImages.map((img, idx) => (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.8}
            onPress={() => openModal(idx)}
          >
            <Image
              source={{ uri: img }}
              style={styles.mainImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {noteImages.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              activeIndex === idx ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>

      {/* 全屏图片 Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <Image
              source={{ uri: noteImages[modalImageIndex] }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    width: width,
    alignSelf: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  scrollView: {
    width: '100%',
  },
  mainImage: {
    width: width,
    height: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'red',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height,
  },
});