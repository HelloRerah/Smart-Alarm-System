import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Slider from '@react-native-community/slider';
import { Alarm } from '../types/Alarm';
import { insertAlarm, updateAlarm } from '../database/database';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { scheduleAlarm, cancelAlarm } from '../services/alarmEngine';

const SetAlarmScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SetAlarm'>>();
  const editAlarm = route.params?.editAlarm;
  const isEditing = editAlarm !== undefined;

  const computeInitialFormState = () => {
    if (!editAlarm) return { hour: 7, minute: 30, isAM: true };
    const h24 = editAlarm.hour;
    let h12 = h24;
    let am = true;
    if (h24 === 0) { h12 = 12; am = true; }
    else if (h24 < 12) { h12 = h24; am = true; }
    else if (h24 === 12) { h12 = 12; am = false; }
    else { h12 = h24 - 12; am = false; }
    return { hour: h12, minute: editAlarm.minute, isAM: am };
  };

  const initial = computeInitialFormState();
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [isAM, setIsAM] = useState(initial.isAM);
  const [repeatDays, setRepeatDays] = useState<number[]>(editAlarm?.repeatDays ?? []);
  const [stage2Delay, setStage2Delay] = useState(editAlarm?.stage2DelayMinutes ?? 40);
  const [label, setLabel] = useState(editAlarm?.label ?? '');
  const [showPicker, setShowPicker] = useState(false);

  const toggleDay = (dayIndex: number) => {
    if (repeatDays.includes(dayIndex)) {
      setRepeatDays(repeatDays.filter((d) => d !== dayIndex));
    } else {
      setRepeatDays([...repeatDays, dayIndex]);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      const selectedHour24 = selectedDate.getHours();
      const selectedMinute = selectedDate.getMinutes();
      if (selectedHour24 === 0) { setHour(12); setIsAM(true); }
      else if (selectedHour24 < 12) { setHour(selectedHour24); setIsAM(true); }
      else if (selectedHour24 === 12) { setHour(12); setIsAM(false); }
      else { setHour(selectedHour24 - 12); setIsAM(false); }
      setMinute(selectedMinute);
    }
  };

  const handleSave = async () => {
    let finalHour = hour;
    if (!isAM && hour !== 12) finalHour = hour + 12;
    if (isAM && hour === 12) finalHour = 0;

    const alarmData: Alarm = {
      id: editAlarm?.id ?? Date.now().toString(),
      hour: finalHour,
      minute,
      repeatDays,
      label: label || 'Alarm',
      enabled: true,
      stage2DelayMinutes: stage2Delay,
      photoVerificationOn: true,
    };

    try {
      if (isEditing) {
        await cancelAlarm(alarmData.id); // cancel old schedule first
        await updateAlarm(alarmData);
      } else {
        await insertAlarm(alarmData);
      }
      await scheduleAlarm(alarmData); // schedule the new one
      navigation.goBack();
    } catch (err) {
      console.log('Failed to save alarm:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Alarm' : 'New Alarm'}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.timeDisplay} onPress={() => setShowPicker(true)}>
        <Text style={styles.timeText}>
          {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
        </Text>
      </TouchableOpacity>

      <View style={styles.ampmRow}>
        <TouchableOpacity
          style={[styles.ampmButton, isAM && styles.ampmButtonActive]}
          onPress={() => setIsAM(true)}
        >
          <Text style={[styles.ampmText, isAM && styles.ampmTextActive]}>AM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ampmButton, !isAM && styles.ampmButtonActive]}
          onPress={() => setIsAM(false)}
        >
          <Text style={[styles.ampmText, !isAM && styles.ampmTextActive]}>PM</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>REPEAT</Text>
      <View style={styles.daysRow}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
          const isSelected = repeatDays.includes(index);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
              onPress={() => toggleDay(index)}
            >
              <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>{day}</Text>
            </TouchableOpacity>
          );
        })}
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
        placeholder="e.g Wake up, Gym..."
        placeholderTextColor="#6C6C70"
        value={label}
        onChangeText={setLabel}
        maxLength={30}
      />

      {showPicker && (
        <DateTimePicker
          value={(() => {
            const date = new Date();
            let h24 = hour;
            if (!isAM && hour !== 12) h24 = hour + 12;
            if (isAM && hour === 12) h24 = 0;
            date.setHours(h24);
            date.setMinutes(minute);
            return date;
          })()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000010', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  headerButton: { color: '#FFFFFF', fontSize: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  timeDisplay: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  timeText: { color: '#FFFFFF', fontSize: 72, fontWeight: '300', letterSpacing: 2 },
  ampmRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 30 },
  ampmButton: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 20, backgroundColor: '#1C1C1E', borderWidth: 1, borderColor: '#2C2C2E' },
  ampmButtonActive: { backgroundColor: '#2962FF', borderColor: '#2962FF' },
  ampmText: { color: '#8E8E93', fontSize: 16, fontWeight: '600' },
  ampmTextActive: { color: '#FFFFFF' },
  sectionLabel: { color: '#8E8E93', fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 12 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  dayCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1C1C1E', borderWidth: 1, borderColor: '#2C2C2E', justifyContent: 'center', alignItems: 'center' },
  dayCircleActive: { backgroundColor: '#2962FF', borderColor: '#2962FF' },
  dayText: { color: '#8E8E93', fontSize: 14, fontWeight: '600' },
  dayTextActive: { color: '#FFFFFF' },
  stage2Card: { backgroundColor: '#1C1C1E', borderRadius: 16, padding: 16, marginBottom: 24 },
  stage2Header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stage2ValueBox: { backgroundColor: '#2C2C2E', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6 },
  stage2ValueText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  slider: { width: '100%', height: 40 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  sliderLabelText: { color: '#8E8E93', fontSize: 12 },
  labelInput: { backgroundColor: '#1C1C1E', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#FFFFFF', fontSize: 16, borderWidth: 1, borderColor: '#2C2C2E', marginBottom: 24 },
});

export default SetAlarmScreen;