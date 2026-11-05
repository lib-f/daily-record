import React from 'react';
import { Text, View } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  caption?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, caption }) => (
  <View className={styles.header}>
    <Text className={styles.title}>{title}</Text>
    {caption ? <Text className={styles.caption}>{caption}</Text> : null}
  </View>
);

export default SectionHeader;
