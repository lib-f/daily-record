import React, { useState } from 'react';
import { Switch, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const ProfilePage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);

  const handleAbout = () => {
    Taro.showModal({
      title: 'Taro Starter',
      content: '基于 Taro 4、React 18 和 TypeScript 构建。',
      showCancel: false
    }).catch((error: unknown) => {
      console.error('[Profile] failed to show about modal', { error });
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.profileCard}>
        <View className={styles.avatar}>
          <Text>TS</Text>
        </View>
        <View className={styles.profileInfo}>
          <Text className={styles.name}>Taro Starter</Text>
          <Text className={styles.subtitle}>微信小程序基础框架</Text>
        </View>
        <Text className={styles.version}>v1.0</Text>
      </View>

      <Text className={styles.groupTitle}>偏好设置</Text>
      <View className={styles.settingGroup}>
        <View className={styles.settingRow}>
          <View className={styles.settingInfo}>
            <Text className={styles.settingTitle}>消息提醒</Text>
            <Text className={styles.settingDescription}>用于演示本地交互状态</Text>
          </View>
          <Switch
            checked={notifications}
            color="#0f766e"
            onChange={(event) => {
              const checked = event.detail.value;
              console.info('[Profile] notification preference changed', { checked });
              setNotifications(checked);
            }}
          />
        </View>
        <View className={styles.divider} />
        <View className={styles.settingRow} onClick={handleAbout}>
          <View className={styles.settingInfo}>
            <Text className={styles.settingTitle}>关于项目</Text>
            <Text className={styles.settingDescription}>查看框架版本和技术栈</Text>
          </View>
          <Text className={styles.chevron}>›</Text>
        </View>
      </View>

      <Text className={styles.groupTitle}>项目结构</Text>
      <View className={styles.structureCard}>
        <Text className={styles.codeLine}>src/pages</Text>
        <Text className={styles.codeHint}>页面与页面配置</Text>
        <Text className={styles.codeLine}>src/components</Text>
        <Text className={styles.codeHint}>跨页面公共组件</Text>
        <Text className={styles.codeLine}>src/data · src/types</Text>
        <Text className={styles.codeHint}>数据与类型定义</Text>
      </View>

      <Text className={styles.footer}>Built with Taro · React · TypeScript</Text>
    </View>
  );
};

export default ProfilePage;
