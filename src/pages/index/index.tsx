import React from 'react';
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ArrowRight } from '@nutui/icons-react-taro';
import styles from './index.module.scss';

interface HomeEntry {
  id: string;
  title: string;
  description: string;
  symbol: string;
  theme: 'record' | 'storage';
}

const homeEntries: HomeEntry[] = [
  {
    id: 'daily-record',
    title: '日常记录',
    description: '记录每天的重要时刻与生活片段',
    symbol: '记',
    theme: 'record',
  },
  {
    id: 'home-storage',
    title: '家物品摆放',
    description: '快速查找家中物品的收纳位置',
    symbol: '物',
    theme: 'storage',
  },
];

const IndexPage: React.FC = () => {
  const handleOpen = (entry: HomeEntry) => {
    const url =
      entry.id === 'daily-record'
        ? '/pages/daily-record/index'
        : `/pages/detail/index?title=${encodeURIComponent(entry.title)}`;

    Taro.navigateTo({
      url,
    }).catch((error: unknown) => {
      console.error('[Home] failed to open entry', { error, entryId: entry.id });
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.eyebrow}>生活助手</Text>
        <Text className={styles.title}>今天想做什么？</Text>
        <Text className={styles.description}>记录生活，也让家里的每件物品都有迹可循。</Text>
      </View>

      <View className={styles.entryGrid}>
        {homeEntries.map((entry) => (
          <View
            className={`${styles.entryCard} ${styles[entry.theme]}`}
            key={entry.id}
            role="button"
            ariaLabel={`打开${entry.title}`}
            onClick={() => handleOpen(entry)}
          >
            <View className={styles.cardTop}>
              <View className={styles.entryIcon}>
                <Text>{entry.symbol}</Text>
              </View>
              <ArrowRight
                className={styles.arrow}
                name="arrow-right"
                size="32rpx"
                color="#4e5969"
                fallback
              />
            </View>
            <View>
              <Text className={styles.entryTitle}>{entry.title}</Text>
              <Text className={styles.entryDescription}>{entry.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default IndexPage;
