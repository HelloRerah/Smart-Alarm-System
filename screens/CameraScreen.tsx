import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Vibration,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AlarmRinging'>;
};

const RANDOM_OBJECTS = [
  'House Keys',
  'TV Remote',
  'Water Bottle',
  'Toothbrush',
  'Charger',
  'Notebook',
  'Coffee Mug',
  'Umbrella',
];

export default function AlarmRingingScreen({ navigation }: Props) {
  const [objectToFind] = useState(
    RANDOM_OBJECTS[Math.floor(Math.random() * RANDOM_OBJECTS.length)],
  );

  useEffect(() => {
    Vibration.vibrate([500, 500, 500, 500], true);
    return () => Vibration.cancel();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Time */}
      <View style={styles.topSection}>
        <Text style={styles.timeText}>06:30</Text>
        <Text style={styles.labelText}>Weekdays</Text>
      </View>

      {/* Object Card */}
      <View style={styles.middleSection}>
        <Text style={styles.instructionLabel}>
          FIND AND PHOTOGRAPH THIS OBJECT
        </Text>
        <View style={styles.objectCard}>
          <Text style={styles.objectName}>{objectToFind}</Text>
        </View>
        <Text style={styles.subInstruction}>
          Get up and find this object anywhere in your home. You cannot dismiss
          this alarm without photographing it.
        </Text>
      </View>

      {/* Dismiss Button */}
      <TouchableOpacity
        style={styles.dismissBtn}
        onPress={() => navigation.navigate('Camera')}>
        <Text style={styles.dismissBtnText}>Open Camera to Dismiss</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 80,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: -3,
  },
  labelText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  middleSection: {
    alignItems: 'center',
    gap: 20,
  },
  instructionLabel: {
    fontSize: 10,
    color: '#555',
    letterSpacing: 2,
    fontWeight: '700',
    textAlign: 'center',
  },
  objectCard: {
    backgroundColor: '#0a0a0a',
    borderWidth: 0.5,
    borderColor: '#222',
    borderRadius: 20,
    paddingVertical: 48,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '100%',
  },
  objectName: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  subInstruction: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    lineHeight: 20,
  },
  dismissBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  dismissBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
});