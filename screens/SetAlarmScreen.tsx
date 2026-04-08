import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const SetAlarmScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //form state - every field the user can edit on this screen
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(30);
  const [isAM, setIsAM] = useState(true);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [stage2Delay, setStage2Delay] = useState(40);
  const [label, setLabel] = useState('');

  return (
    <View style={styles.container}>
      {/* Header row: BAck | New Alarm | Save */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.headerButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>New Alarm</Text>

      <TouchableOpacity onPress={() => console.log('Save pressed')}>
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
    </View>
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
});

export default SetAlarmScreen;
