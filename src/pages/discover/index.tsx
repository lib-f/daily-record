import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import { featureModules } from '@/data/starter';
import styles from './index.module.scss';

const categories = ['全部', '界面', '架构', '服务', '平台'];

const DiscoverPage: React.FC = () => {
  const [category, setCategory] = useState('全部');
  const modules = useMemo(
    () =>
      category === '全部'
        ? featureModules
        : featureModules.filter((item) => item.category === category),
    [category]
  );

  const handleOpen = (title: string) => {
    console.info('[Discover] opening feature detail', { title });
    Taro.navigateTo({ url: `/pages/detail/index?title=${encodeURIComponent(title)}` }).catch(
      (error: unknown) => {
        console.error('[Discover] failed to open detail', { error, title });
      }
    );
  };

  return (
    <View className={styles.page}>
      <View className={styles.intro}>
        <Text className={styles.eyebrow}>STARTER MODULES</Text>
        <Text className={styles.title}>按业务需要组合能力</Text>
        <Text className={styles.description}>
          基础目录和跨端规范已经配置，可在现有边界内持续扩展。
        </Text>
      </View>

      <ScrollView className={styles.filters} scrollX enhanced showScrollbar={false}>
        {categories.map((item) => (
          <View
            className={category === item ? styles.filterActive : styles.filter}
            key={item}
            onClick={() => setCategory(item)}
          >
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>

      <SectionHeader title="模块清单" caption={`${modules.length} 项`} />
      <View className={styles.moduleList}>
        {modules.map((item, index) => (
          <View className={styles.moduleCard} key={item.id} onClick={() => handleOpen(item.title)}>
            <View className={styles.moduleIndex}>
              <Text>{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <View className={styles.moduleContent}>
              <View className={styles.moduleHeader}>
                <Text className={styles.moduleTitle}>{item.title}</Text>
                <Text className={item.status === 'ready' ? styles.statusReady : styles.statusPlanned}>
                  {item.status === 'ready' ? '可用' : '待扩展'}
                </Text>
              </View>
              <Text className={styles.moduleDescription}>{item.description}</Text>
              <Text className={styles.moduleCategory}>{item.category}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default DiscoverPage;
