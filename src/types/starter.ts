export interface QuickAction {
  id: string;
  title: string;
  description: string;
  symbol: string;
  background: string;
}

export interface StarterStat {
  label: string;
  value: string;
}

export interface FeatureModule {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'ready' | 'planned';
}
