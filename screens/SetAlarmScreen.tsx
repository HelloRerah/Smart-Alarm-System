import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Slider from '@react-native-community/slider'
import { Alarm } from '../types/Alarm';

const SetAlarmScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SetAlarm'>>();

  //form state - every field the user can edit on this screen
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(30);
  const [isAM, setIsAM] = useState(true);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [stage2Delay, setStage2Delay] = useState(40);
  const [label, setLabel] = useState('');

  const toggleDay = (dayIndex: number) => {
    if (repeatDays.includes(dayIndex)) {
      setRepeatDays(repeatDays.filter((d) => d !== dayIndex));
    } else {
      setRepeatDays([...repeatDays, dayIndex]);
    }
  };

  const handleSave = () => {
    //Convert 12-hour + AM/PM -> 24 hour
    let finalHour = hour;
    if (!isAM && hour !== 12 ) finalHour = hour +12;
    if(isAM && hour === 12 ) finalHour = 0;

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      hour: finalHour,
      minute,
      repeatDays,
      label: label || 'Alarm',
      enabled: true,
      stage2DelayMinutes: stage2Delay,
      photoVerificationOn: true,
    };

    route.params.onSave(newAlarm);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header row: BAck | New Alarm | Save */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.headerButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>New Alarm</Text>

      <TouchableOpacity onPress={() =>{handleSave}}>
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
    </View>
    
    <View style={styles.timeDisplay}>
      <Text style={styles.timeText}>
        {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
      </Text>
    </View>

    <View style={styles.ampmRow}>
      <TouchableOpacity
      style={[styles.ampmButton, isAM && styles.ampmButtonActive]}
      onPress={() => setIsAM(true)}
      >
        <Text style={[styles.ampmText, isAM && styles.ampmTextActive]}>
          AM
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
      style={[styles.ampmButton, !isAM && styles.ampmButtonActive]}
      onPress={() => setIsAM(false)}
      >
        <Text style={[styles.ampmText, !isAM && styles.ampmTextActive]}>
          PM
        </Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.sectionLabel}>REPEAT</Text>
    <View style={styles.daysRow}>
      {['M','T','W','T','F','S','S'].map((day, index) => {
        const isSelected = repeatDays.includes(index);
        return(
          <TouchableOpacity
          key={index}
          style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
          onPress={() => toggleDay(index)}
          >
            <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>
              {day}
            </Text>
          </TouchableOpacity>
        );
      }
      )}
    </View>

    <View style={styles.stage2Card}>
        <View style={styles.stage2Header}>
          <Text style={styles.sectionLabel}>STAGE 2 DELAY</Text>
          <View style={styles.stage2ValueBox}>
            <Text style={styles.stage2ValueText}>{stage2Delay} min</Text>
          </View>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={60}
          step={1}
          value={stage2Delay}
          onValueChange={setStage2Delay}
          minimumTrackTintColor="#2962FF"
          maximumTrackTintColor="#3A3A3C"
          thumbTintColor="#FFFFFF"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabelText}>1 min</Text>
          <Text style={styles.sliderLabelText}>60 min</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>LABEL</Text>
      <TextInput
        style={styles.labelInput}
        placeholder='e.g Wake up, Gym...'
        placeholderTextColor={'#6C6C70'}
        value={label}
        onChangeText={setLabel}
        maxLength={30}
      />
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000010',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerButton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  timeDisplay: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: '300',
    letterSpacing: 2,
  },
  ampmRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  ampmButton: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  ampmButtonActive: {
    backgroundColor: '#2962FF',
    borderColor: '#2962FF',
  },
  ampmText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  ampmTextActive: {
    color: '#FFFFFF',
  },
  sectionLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#2962FF',
    borderColor: '#2962FF',
  },
  dayText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  stage2Card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  stage2Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stage2ValueBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  stage2ValueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabelText: {
    color: '#8E8E93',
    fontSize: 12,
  },
  labelInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 24,
  },
});

export default SetAlarmScreen;
