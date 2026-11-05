import { useMemo, useState } from 'react';
import Taro from '@tarojs/taro';

const STORAGE_KEY = 'daily-record:purchase-records';

export interface PurchaseRecord {
  id: string;
  itemName: string;
  amountCents: number;
  createdAt: number;
}

const readRecords = (): PurchaseRecord[] => {
  try {
    const value = Taro.getStorageSync<PurchaseRecord[]>(STORAGE_KEY);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.error('[PurchaseRecords] failed to read records', { error });
    return [];
  }
};

export const usePurchaseRecords = () => {
  const [records, setRecords] = useState<PurchaseRecord[]>(readRecords);
  const [storageError, setStorageError] = useState('');

  const totalAmountCents = useMemo(
    () => records.reduce((total, record) => total + record.amountCents, 0),
    [records]
  );

  const persistRecords = (nextRecords: PurchaseRecord[]) => {
    try {
      Taro.setStorageSync(STORAGE_KEY, nextRecords);
      setRecords(nextRecords);
      setStorageError('');
      return true;
    } catch (error) {
      console.error('[PurchaseRecords] failed to persist records', { error });
      setStorageError('保存失败，请检查存储空间后重试');
      return false;
    }
  };

  const addRecord = (
    itemName: string,
    amountCents: number,
    createdAt = Date.now()
  ) => {
    const nextRecord: PurchaseRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      itemName,
      amountCents,
      createdAt,
    };

    return persistRecords([nextRecord, ...records]);
  };

  const removeRecord = (recordId: string) => {
    return persistRecords(records.filter((record) => record.id !== recordId));
  };

  return {
    records,
    totalAmountCents,
    storageError,
    addRecord,
    removeRecord,
  };
};
