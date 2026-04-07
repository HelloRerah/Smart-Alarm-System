import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SetAlarm'>;
};

const HOURS = ['04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function SetAlarmScreen({ navigation }: Props) {
  const [selectedHour, setSelectedHour] = useState('06');
  const [selectedMinute, setSelectedMinute] = useState('30');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [label, setLabel] = useState('');
  const [stage2Delay, setStage2Delay] = useState(30);

  const toggleDay = (index: number) => {
    setSelectedDays(prev =>
      prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBack}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Alarm</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerSave}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Time Picker */}
        <View style={styles.pickerWrapper}>
          <ScrollView
            style={styles.pickerCol}
            showsVerticalScrollIndicator={false}>
            {HOURS.map(h => (
              <TouchableOpacity key={h} onPress={() => setSelectedHour(h)}>
                <Text style={[
                  styles.pickerItem,
                  selectedHour === h && styles.pickerItemSelected,
                ]}>
                  {h}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.pickerSep}>:</Text>

          <ScrollView
            style={styles.pickerCol}
            showsVerticalScrollIndicator={false}>
            {MINUTES.map((m, i) => (
              <TouchableOpacity key={i} onPress={() => setSelectedMinute(m)}>
                <Text style={[
                  styles.pickerItem,
                  selectedMinute === m && styles.pickerItemSelected,
                ]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AM / PM */}
        <View style={styles.ampmRow}>
          <TouchableOpacity
            style={[styles.ampmBtn, ampm === 'AM' && styles.ampmBtnActive]}
            onPress={() => setAmpm('AM')}>
            <Text style={[styles.ampmText, ampm === 'AM' && styles.ampmTextActive]}>
              AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ampmBtn, ampm === 'PM' && styles.ampmBtnActive]}
            onPress={() => setAmpm('PM')}>
            <Text style={[styles.ampmText, ampm === 'PM' && styles.ampmTextActive]}>
              PM
            </Text>
          </TouchableOpacity>
        </View>

        {/* Repeat Days */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>REPEAT</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayBtn,
                  selectedDays.includes(index) && styles.dayBtnActive,
                ]}
                onPress={() => toggleDay(index)}>
                <Text style={[
                  styles.dayText,
                  selectedDays.includes(index) && styles.dayTextActive,
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stage 2 Delay */}
        <View style={styles.section}>
          <View style={styles.stage2Header}>
            <Text style={styles.sectionLabel}>STAGE 2 DELAY</Text>
            <View style={styles.delayBadge}>
              <Text style={styles.delayBadgeText}>{stage2Delay} min</Text>
            </View>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={60}
            step={1}
            value={stage2Delay}
            onValueChange={(val: number) => setStage2Delay(Math.round(val))}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#1a1a1a"
            thumbTintColor="#fff"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1 min</Text>
            <Text style={styles.sliderLabel}>60 min</Text>
          </View>
          <Text style={styles.stage2Sub}>
            Stage 2 alarm rings {stage2Delay} minute{stage2Delay > 1 ? 's' : ''} after Stage 1 is dismissed.
          </Text>
        </View>

        {/* Label */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LABEL</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Wake up, Gym..."
              placeholderTextColor="#333"
              value={label}
              onChangeText={setLabel}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>Save Alarm</Text>
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
  headerBack: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerSave: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  pickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
    marginBottom: 20,
  },
  pickerCol: {
    width: 80,
  },
  pickerItem: {
    fontSize: 18,
    fontWeight: '300',
    color: '#2a2a2a',
    textAlign: 'center',
    paddingVertical: 8,
  },
  pickerItemSelected: {
    fontSize: 44,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: -1,
    paddingVertical: 0,
  },
  pickerSep: {
    fontSize: 40,
    fontWeight: '200',
    color: '#fff',
    marginHorizontal: 6,
    marginBottom: 6,
  },
  ampmRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  ampmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#1a1a1a',
  },
  ampmBtnActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  ampmText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  ampmTextActive: {
    color: '#000',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 9,
    color: '#555',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 12,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#1a1a1a',
  },
  dayBtnActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#444',
  },
  dayTextActive: {
    color: '#000',
  },
  stage2Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  delayBadge: {
    borderWidth: 0.5,
    borderColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  delayBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 36,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 9,
    color: '#444',
  },
  stage2Sub: {
    fontSize: 11,
    color: '#444',
    marginTop: 8,
    lineHeight: 17,
  },
  inputBox: {
    backgroundColor: '#0a0a0a',
    borderWidth: 0.5,
    borderColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  input: {
    fontSize: 14,
    color: '#fff',
    paddingVertical: 12,
  },
  saveBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
});