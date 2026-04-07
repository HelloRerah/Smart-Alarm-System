import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

type Alarm = {
  id: number;
  time: string;
  label: string;
  enabled: boolean;
};

const initialAlarms: Alarm[] = [
  { id: 1, time: '06:30', label: 'Weekdays', enabled: true },
  { id: 2, time: '07:00', label: 'Weekends', enabled: false },
  { id: 3, time: '05:45', label: 'Mon, Wed', enabled: true },
];

export default function HomeScreen({ navigation }: Props) {
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms);

  const toggleAlarm = (id: number) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Alarms</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('SetAlarm')}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Alarm List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {alarms.map((alarm, index) => (
          <View
            key={alarm.id}
            style={[
              styles.alarmRow,
              index === alarms.length - 1 && styles.alarmRowLast,
            ]}>
            <View style={styles.alarmLeft}>
              <Text style={[styles.alarmTime, !alarm.enabled && styles.alarmTimeOff]}>
                {alarm.time}
              </Text>
              <Text style={styles.alarmLabel}>{alarm.label}</Text>
              <View style={styles.alarmTag}>
                <Text style={styles.alarmTagText}>Photo Verification On</Text>
              </View>
            </View>
            <Switch
              value={alarm.enabled}
              onValueChange={() => toggleAlarm(alarm.id)}
              trackColor={{ false: '#1a1a1a', true: '#fff' }}
              thumbColor={alarm.enabled ? '#000' : '#2e2e2e'}
            />
          </View>
        ))}

        {/* Temporary test button — remove when alarm engine is built */}
        <TouchableOpacity
          style={styles.testBtn}
          onPress={() => navigation.navigate('AlarmRinging')}>
          <Text style={styles.testBtnText}>Test Alarm Screen</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 22,
    color: '#000',
    lineHeight: 26,
    fontWeight: '300',
  },
  alarmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#151515',
  },
  alarmRowLast: {
    borderBottomWidth: 0,
  },
  alarmLeft: {
    rowGap: 2,
  },
  alarmTime: {
    fontSize: 36,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: -1,
  },
  alarmTimeOff: {
    color: '#2a2a2a',
  },
  alarmLabel: {
    fontSize: 12,
    color: '#555',
  },
  alarmTag: {
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: '#1e1e1e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 4,
  },
  alarmTagText: {
    fontSize: 9,
    color: '#555',
  },
  testBtn: {
    borderWidth: 0.5,
    borderColor: '#222',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  testBtnText: {
    fontSize: 13,
    color: '#444',
  },
});