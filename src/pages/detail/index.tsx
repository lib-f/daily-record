import React from 'react';
import { Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const title = decodeURIComponent(router.params.title || '模块');

  const handleBack = () => {
    Taro.navigateBack().catch((error: unknown) => {
      console.error('[Detail] failed to navigate back', { error });
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.placeholder}>
        <View className={styles.symbol}>
          <Text>+</Text>
        </View>
        <Text className={styles.title}>{title}功能</Text>
        <Text className={styles.description}>功能正在开发中...</Text>
        <View className={styles.backButton} onClick={handleBack}>
          <Text>返回模块列表</Text>
        </View>
      </View>
    </View>
  );
};

export default DetailPage;
