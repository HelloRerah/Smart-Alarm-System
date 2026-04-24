import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const AlarmRingingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AlarmRinging'>>();
  const { alarm, verificationObject } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}
      </Text>
      <Text style={styles.label}>{alarm.label}</Text>
      <Text style={styles.heading}>FIND AND PHOTOGRAPH THIS OBJECT</Text>
      <View style={styles.objectCard}>
        <Text style={styles.objectIcon}>🔑</Text>
        <Text style={styles.objectName}>{verificationObject}</Text>
      </View>
      <Text style={styles.description}>
        Get up and find this object anywhere in your home.
      </Text>
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate('Camera', {
          mode: 'stage1',
          targetName: verificationObject,
          alarm: alarm,
        })}
      >
        <Text style={styles.cameraButtonText}>Open Camera to Dismiss</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Stage 1 Alarm</Text>
        <Text style={styles.footerCaption}>Random object revealed</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000010', padding: 24, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 60 },
  time: { color: '#FFFFFF', fontSize: 72, fontWeight: '300', letterSpacing: 2 },
  label: { color: '#8E8E93', fontSize: 16, marginTop: 4 },
  heading: { color: '#8E8E93', fontSize: 12, fontWeight: '600', letterSpacing: 1.5, marginTop: 40, marginBottom: 20, textAlign: 'center' },
  objectCard: { backgroundColor: '#1C1C1E', borderRadius: 20, paddingVertical: 40, paddingHorizontal: 30, alignItems: 'center', width: '80%' },
  objectIcon: { fontSize: 64, marginBottom: 12 },
  objectName: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  description: { color: '#8E8E93', fontSize: 13, textAlign: 'center', marginTop: 24, marginBottom: 32, paddingHorizontal: 20 },
  cameraButton: { backgroundColor: '#2962FF', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, width: '80%', alignItems: 'center' },
  cameraButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footer: { marginTop: 40, alignItems: 'center' },
  footerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  footerCaption: { color: '#8E8E93', fontSize: 12, marginTop: 2 },
});

export default AlarmRingingScreen;