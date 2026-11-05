import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, ScrollView, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ArrowLeft, ArrowRight, Cart, Del } from '@nutui/icons-react-taro';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { type PurchaseRecord, usePurchaseRecords } from '@/hooks/usePurchaseRecords';
import styles from './index.module.scss';

const ITEM_NAME_MAX_LENGTH = 30;
const MAX_AMOUNT = 999999.99;
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const DailyRecordPage: React.FC = () => {
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [itemError, setItemError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => dayjs().startOf('month'));
  const [selectedDay, setSelectedDay] = useState(() => dayjs().date());
  const [currentDate, setCurrentDate] = useState(() => dayjs());
  const { records, storageError, addRecord, removeRecord } = usePurchaseRecords();
  const currentMonth = currentDate.startOf('month');
  const isCurrentMonth = selectedMonth.isSame(currentMonth, 'month');

  useEffect(() => {
    const nextDay = currentDate.add(1, 'day').startOf('day');
    const timer = setTimeout(
      () => setCurrentDate(dayjs()),
      Math.max(nextDay.diff(dayjs()) + 100, 100)
    );

    return () => clearTimeout(timer);
  }, [currentDate]);

  const {
    calendarDays,
    dailyRecords,
    monthlyRecords,
    monthlyTotalAmountCents,
  } = useMemo(() => {
      const monthEnd = selectedMonth.add(1, 'month');
      const nextMonthlyRecords = records.filter((record) => {
        const createdAt = dayjs(record.createdAt);
        return (
          !createdAt.isBefore(selectedMonth) &&
          createdAt.isBefore(monthEnd)
        );
      });
      const leadingBlankCount = selectedMonth.day();
      const daysInMonth = selectedMonth.daysInMonth();
      const nextCalendarDays = Array.from({ length: 42 }, (_, index) => {
        const date = index - leadingBlankCount + 1;
        return date > 0 && date <= daysInMonth ? date : null;
      });

      return {
        calendarDays: nextCalendarDays,
        dailyRecords: nextMonthlyRecords.filter(
          (record) => dayjs(record.createdAt).date() === selectedDay
        ),
        monthlyRecords: nextMonthlyRecords,
        monthlyTotalAmountCents: nextMonthlyRecords.reduce(
          (total, record) => total + record.amountCents,
          0
        ),
      };
    }, [records, selectedDay, selectedMonth]);
  const switchMonth = (offset: number) => {
    const nextMonth = selectedMonth.add(offset, 'month');
    if (nextMonth.isAfter(currentMonth, 'month')) {
      return;
    }
    setSelectedMonth(nextMonth);
    setSelectedDay(
      Math.min(
        selectedDay,
        nextMonth.isSame(currentMonth, 'month')
          ? currentDate.date()
          : nextMonth.daysInMonth()
      )
    );
  };

  const switchToHome = () => {
    Taro.switchTab({ url: '/pages/index/index' }).catch((error: unknown) => {
      console.error('[DailyRecord] failed to switch to home', { error });
    });
  };

  const handleBack = () => {
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack().catch(switchToHome);
      return;
    }

    switchToHome();
  };

  const validate = () => {
    const normalizedName = itemName.trim();
    const normalizedAmount = amount.trim();
    let nextItemError = '';
    let nextAmountError = '';

    if (!normalizedName) {
      nextItemError = '请输入购买的物品';
    } else if (normalizedName.length > ITEM_NAME_MAX_LENGTH) {
      nextItemError = `物品名称不能超过 ${ITEM_NAME_MAX_LENGTH} 个字`;
    }

    if (!normalizedAmount) {
      nextAmountError = '请输入购买金额';
    } else if (!/^\d+(\.\d{1,2})?$/.test(normalizedAmount)) {
      nextAmountError = '金额最多保留两位小数';
    } else {
      const numericAmount = Number(normalizedAmount);
      if (numericAmount <= 0) {
        nextAmountError = '金额必须大于 0';
      } else if (numericAmount > MAX_AMOUNT) {
        nextAmountError = `金额不能超过 ${MAX_AMOUNT.toFixed(2)} 元`;
      }
    }

    setItemError(nextItemError);
    setAmountError(nextAmountError);
    return !nextItemError && !nextAmountError;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const now = dayjs();
    const selectedDateTime = selectedMonth
      .date(selectedDay)
      .hour(now.hour())
      .minute(now.minute())
      .second(now.second())
      .millisecond(now.millisecond());
    const saved = addRecord(
      itemName.trim(),
      Math.round(Number(amount) * 100),
      selectedDateTime.valueOf()
    );
    if (!saved) {
      return;
    }

    setItemName('');
    setAmount('');
    Taro.showToast({ title: '已保存', icon: 'success' });
  };

  const handleRemove = async (record: PurchaseRecord) => {
    const result = await Taro.showModal({
      title: '删除记录',
      content: `确认删除“${record.itemName}”吗？`,
      confirmColor: '#f53f3f',
    });

    if (result.confirm) {
      removeRecord(record.id);
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.calendarCard}>
        <View className={styles.calendarHeader}>
          <View
            className={styles.monthButton}
            role="button"
            ariaLabel="上一个月"
            onClick={() => switchMonth(-1)}
          >
            <ArrowLeft name="arrow-left" size="28rpx" color="#ffffff" fallback />
          </View>
          <Text className={styles.monthTitle}>
            {selectedMonth.format('YYYY年M月')}
          </Text>
          <View
            className={`${styles.monthButton} ${
              isCurrentMonth ? styles.monthButtonDisabled : ''
            }`}
            role="button"
            ariaLabel="下一个月"
            onClick={() => switchMonth(1)}
          >
            <ArrowRight name="arrow-right" size="28rpx" color="#ffffff" fallback />
          </View>
        </View>

        <View className={styles.summary}>
          <View>
            <Text className={styles.summaryLabel}>本月消费</Text>
            <Text className={styles.summaryAmount}>
              ¥{(monthlyTotalAmountCents / 100).toFixed(2)}
            </Text>
          </View>
          <View className={styles.summaryCount}>
            <Text className={styles.summaryCountValue}>{monthlyRecords.length}</Text>
            <Text className={styles.summaryCountLabel}>条记录</Text>
          </View>
        </View>

        <View className={styles.calendarGrid}>
          {WEEKDAYS.map((weekday) => (
            <Text className={styles.weekday} key={weekday}>
              {weekday}
            </Text>
          ))}
          {calendarDays.map((date, index) => {
            const isSelected = date === selectedDay;
            const isToday = isCurrentMonth && date === currentDate.date();
            const isFuture = isCurrentMonth && Boolean(date && date > currentDate.date());

            return (
              <View
                className={classNames(
                  styles.calendarDay,
                  isSelected && styles.calendarDaySelected,
                  isToday && styles.calendarDayToday,
                  isFuture && styles.calendarDayDisabled
                )}
                key={`${date ?? 'blank'}-${index}`}
                role={date ? 'button' : undefined}
                ariaLabel={date ? `查看${selectedMonth.month() + 1}月${date}日记录` : undefined}
                onClick={() => {
                  if (date && !isFuture) {
                    setSelectedDay(date);
                  }
                }}
              >
                {date ? (
                  <View className={styles.dayContent}>
                    <Text className={styles.dayNumber}>{date}</Text>
                    {isToday && <View className={styles.recordDot} />}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      <Text className={styles.sectionTitle}>记一笔</Text>

      <ScrollView
        className={styles.contentScroll}
        scrollY
        enhanced
        showScrollbar={false}
      >
        <Form className={styles.formCard} onSubmit={handleSubmit}>
          <View className={styles.field}>
            <Text className={styles.fieldLabel}>买了什么</Text>
            <Input
              className={itemError ? styles.inputError : styles.input}
              value={itemName}
              maxlength={ITEM_NAME_MAX_LENGTH}
              placeholder="例如：牛奶"
              onInput={(event) => {
                setItemName(event.detail.value);
                if (itemError) setItemError('');
              }}
            />
            <Text className={styles.fieldError}>{itemError}</Text>
          </View>

          <View className={styles.field}>
            <Text className={styles.fieldLabel}>花了多少钱</Text>
            <View className={amountError ? styles.amountInputError : styles.amountInput}>
              <Text className={styles.currency}>¥</Text>
              <Input
                className={styles.amountControl}
                value={amount}
                type="digit"
                maxlength={9}
                placeholder="0.00"
                onInput={(event) => {
                  setAmount(event.detail.value);
                  if (amountError) setAmountError('');
                }}
              />
            </View>
            <Text className={styles.fieldError}>{amountError}</Text>
          </View>

          {/* <Text className={styles.storageError}>{storageError}</Text> */}
          <View
            className={styles.submitButton}
            role="button"
            ariaLabel="保存记录"
            onClick={handleSubmit}
          >
            保存记录
          </View>
        </Form>

        <View className={styles.recordsSection}>
          <View className={styles.recordsHeader}>
            <Text className={styles.sectionTitle}>
              {selectedMonth.format('M月')}
              {selectedDay}日记录
            </Text>
            <Text className={styles.recordsCaption}>
              {dailyRecords.length ? `${dailyRecords.length}条 · 按时间倒序` : '暂无记录'}
            </Text>
          </View>

          {dailyRecords.length ? (
            <View className={styles.recordList}>
              {dailyRecords.map((record) => (
                <View className={styles.recordCard} key={record.id}>
                  <View className={styles.recordIcon}>
                    <Cart size="32rpx" color="#0f766e" fallback />
                  </View>
                  <View className={styles.recordContent}>
                    <Text className={styles.recordName}>{record.itemName}</Text>
                    <Text className={styles.recordTime}>
                      {dayjs(record.createdAt).format('MM月DD日 HH:mm')}
                    </Text>
                  </View>
                  <Text className={styles.recordAmount}>
                    ¥{(record.amountCents / 100).toFixed(2)}
                  </Text>
                  <View
                    className={styles.deleteButton}
                    role="button"
                    ariaLabel={`删除${record.itemName}`}
                    onClick={() => handleRemove(record)}
                  >
                    <Del size="28rpx" color="#86909c" fallback />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Cart size="56rpx" color="#c9cdd4" fallback />
              <Text className={styles.emptyTitle}>
                {selectedMonth.format('M月')}
                {selectedDay}日还没有购买记录
              </Text>
              <Text className={styles.emptyDescription}>
                {isCurrentMonth && selectedDay === currentDate.date()
                  ? '填写上方信息，保存你的第一笔消费。'
                  : '可以点击其他日期查看消费记录。'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DailyRecordPage;
