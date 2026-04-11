import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Alarm } from '../types/Alarm';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { getAllAlarms, updateAlarm } from '../database/database';

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

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map((alarm) =>
      alarm.id === id
        ? { ...alarm, enabled: !alarm.enabled }
        : alarm
    ));
  };

  return(
    <View style={styles.container}>
      <View style={styles.header}>
  <Text style={styles.title}>Alarms</Text>
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => navigation.navigate('SetAlarm')}
  >
    <Text style={styles.addButtonText}>+</Text>
  </TouchableOpacity>
</View>
    
    {alarms.map((alarm) => (
      <View key={alarm.id} style={styles.alarmCard}>
        <View style={styles.cardLeft}>
        <Text style={styles.alarmTime}>
        {String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}
        </Text>
        <Text style={styles.alarmLabel}>{alarm.label}</Text>
        {alarm.photoVerificationOn && (
          <View style={styles.badge}>
          <Text style={styles.badgeText}>Photo Verification On</Text>
        </View>
        )}
      </View>
      <Switch
        value= {alarm.enabled}
        onValueChange={() => toggleAlarm(alarm.id)}
        trackColor={{false: '#3A3A3C', true: '#2962FF'}}
        thumbColor="#FFFFFF"
      />
      </View>
    ))}

     
    </View>
  );
};

const styles = StyleSheet.create ({
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
  debugButton: {
    marginTop: 24,
    padding: 14,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default HomeScreen;