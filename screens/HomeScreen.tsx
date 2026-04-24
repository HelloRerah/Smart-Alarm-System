import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Alarm } from '../types/Alarm';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { getAllAlarms, deleteAlarm } from '../database/database';
import { scheduleAlarm, cancelAlarm } from '../services/alarmEngine';

const TEST_ALARM: Alarm = {
  id: 'test-001',
  hour: 7,
  minute: 0,
  repeatDays: [],
  label: 'Test Alarm',
  enabled: true,
  stage2DelayMinutes: 30,
  photoVerificationOn: true,
};

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAllAlarms()
        .then((loaded) => setAlarms(loaded))
        .catch((err) => console.log('Failed to load alarms:', err));
    }, [])
  );

  const toggleAlarm = async (id: string) => {
  const alarm = alarms.find((a) => a.id === id);
  if (!alarm) return;
  const updated = { ...alarm, enabled: !alarm.enabled };
  setAlarms(alarms.map((a) => a.id === id ? updated : a));
  if (updated.enabled) {
    await scheduleAlarm(updated);
  } else {
    await cancelAlarm(id);
  }
};

const handleDelete = (id: string) => {
  Alert.alert(
    'Delete alarm?',
    'This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelAlarm(id);
            await deleteAlarm(id);
            setAlarms(alarms.filter((a) => a.id !== id));
          } catch (err) {
            console.log('Failed to delete alarm:', err);
          }
        },
      },
    ]
  );
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alarms</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('SetAlarm', {})}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {alarms.map((alarm) => (
          <View key={alarm.id} style={styles.alarmCard}>
            <TouchableOpacity
              style={styles.cardLeft}
              onPress={() => navigation.navigate('SetAlarm', { editAlarm: alarm })}
            >
              <Text style={styles.alarmTime}>
                {String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}
              </Text>
              <Text style={styles.alarmLabel}>{alarm.label}</Text>
              {alarm.photoVerificationOn && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Photo Verification On</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.cardRight}>
              <Switch
                value={alarm.enabled}
                onValueChange={() => toggleAlarm(alarm.id)}
                trackColor={{ false: '#3A3A3C', true: '#2962FF' }}
                thumbColor="#FFFFFF"
              />
              <TouchableOpacity onPress={() => handleDelete(alarm.id)} style={styles.deleteButton}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── DEV TEST BUTTONS ── remove before final submission ── */}
      <View style={styles.testSection}>
        <Text style={styles.testLabel}>DEV TESTING</Text>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => navigation.navigate('AlarmRinging', {
            alarm: TEST_ALARM,
            verificationObject: 'Water Bottle',
          })}
        >
          <Text style={styles.testButtonText}>▶ Test Stage 1 Alarm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.testButton, styles.testButton2]}
          onPress={() => navigation.navigate('Stage2AlarmRinging', {
            alarm: TEST_ALARM,
            activityName: 'Brushing Teeth',
          })}
        >
          <Text style={styles.testButtonText}>▶ Test Stage 2 Alarm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000010',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  alarmCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 6,
  },
  deleteIcon: {
    fontSize: 18,
  },
  badge: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#8E8E93',
    fontSize: 11,
  },
  alarmTime: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '600',
  },
  alarmLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#2962FF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
  testSection: {
    borderTopWidth: 0.5,
    borderTopColor: '#2C2C2E',
    paddingTop: 16,
    marginTop: 8,
    gap: 10,
  },
  testLabel: {
    color: '#3A3A3C',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2962FF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  testButton2: {
    borderColor: '#FF9500',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;