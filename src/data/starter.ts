import type { FeatureModule, QuickAction, StarterStat } from '@/types/starter';

export const starterStats: StarterStat[] = [
  { label: '页面', value: '4' },
  { label: 'Tab', value: '3' },
  { label: '跨端', value: '4' }
];

export const quickActions: QuickAction[] = [
  {
    id: 'scan',
    title: '扫码能力',
    description: '接入 Taro 扫码 API',
    symbol: '⌗',
    background: '#e9f6f3'
  },
  {
    id: 'location',
    title: '位置服务',
    description: '扩展地图和定位能力',
    symbol: '◎',
    background: '#fff1ee'
  },
  {
    id: 'message',
    title: '消息通知',
    description: '构建订阅消息流程',
    symbol: '◇',
    background: '#eef4ff'
  },
  {
    id: 'storage',
    title: '本地存储',
    description: '保存轻量用户配置',
    symbol: '▣',
    background: '#fff7e6'
  }
];

export const featureModules: FeatureModule[] = [
  {
    id: 'components',
    title: '通用组件',
    description: '公共标题、卡片与反馈状态可按需扩展。',
    category: '界面',
    status: 'ready'
  },
  {
    id: 'data',
    title: '数据分层',
    description: '类型、Mock 与服务层保持独立，便于替换数据源。',
    category: '架构',
    status: 'ready'
  },
  {
    id: 'cloud',
    title: '云开发',
    description: '可继续接入登录、数据库和云函数能力。',
    category: '服务',
    status: 'planned'
  },
  {
    id: 'theme',
    title: '主题系统',
    description: '全局颜色、间距和组件样式集中管理。',
    category: '界面',
    status: 'ready'
  },
  {
    id: 'state',
    title: '状态管理',
    description: '复杂业务可在当前结构中添加 Zustand。',
    category: '架构',
    status: 'planned'
  },
  {
    id: 'cross-platform',
    title: '跨端适配',
    description: '遵循 Taro API，兼容微信、抖音、支付宝和 H5。',
    category: '平台',
    status: 'ready'
  }
];
