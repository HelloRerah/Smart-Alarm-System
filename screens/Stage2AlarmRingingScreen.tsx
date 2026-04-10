import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const Stage2AlarmRingingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Stage2AlarmRinging'>>();
  const { alarm, activityName } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.stageBadge}>
        <Text style={styles.stageBadgeText}>STAGE 2</Text>
      </View>

      <Text style={styles.time}>
        {String(alarm.hour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}
      </Text>
      <Text style={styles.label}>Morning Verification</Text>

      <Text style={styles.heading}>PROVE YOU STARTED YOUR MORNING</Text>

      <View style={styles.activityCard}>
        <Text style={styles.activityIcon}>🪥</Text>
        <Text style={styles.activityName}>{activityName}</Text>
      </View>

      <Text style={styles.description}>
        Take a photo showing you have completed this activity.
      </Text>

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => 
            navigation.navigate('Camera', {
                mode: 'stage2',
                targetName: activityName,
            })
        }
      >
        <Text style={styles.cameraButtonText}>Open Camera to Dismiss</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Stage 2 Alarm</Text>
        <Text style={styles.footerCaption}>Morning activity verify</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000010',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  stageBadge: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginBottom: 24,
  },
  stageBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  time: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: '300',
    letterSpacing: 2,
  },
  label: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 4,
  },
  heading: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: '80%',
  },
  activityIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  activityName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  cameraButton: {
    backgroundColor: '#2962FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  footerCaption: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
});

export default Stage2AlarmRingingScreen;
