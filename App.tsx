import { initDatabase } from './database/database';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SetAlarmScreen from './screens/SetAlarmScreen';
import { Alarm } from './types/Alarm';
import AlarmRingingScreen from './screens/AlarmRingingScreen';
import Stage2AlarmRingingScreen from './screens/Stage2AlarmRingingScreen';
import CameraScreen from './screens/CameraScreen';
import notifee, { EventType } from '@notifee/react-native';
import { navigationRef, navigate } from './services/navigationRef';

export type RootStackParamList = {
  Home: undefined;
  SetAlarm: { editAlarm?: Alarm };
  AlarmRinging: { alarm: Alarm; verificationObject: string };
  Stage2AlarmRinging: { alarm: Alarm; activityName: string };
  Camera: { mode: 'stage1' | 'stage2'; targetName: string ; alarm: Alarm};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const handleNotificationPress = (data: any) => {
  if (!data) return;
  if (data.stage === 'stage1') {
    navigate('AlarmRinging', {
      alarm: {
        id: String(data.alarmId),
        hour: Number(data.alarmHour),
        minute: Number(data.alarmMinute),
        label: String(data.alarmLabel),
        enabled: true,
        repeatDays: [],
        stage2DelayMinutes: Number(data.stage2DelayMinutes),
        photoVerificationOn: true,
      },
      verificationObject: String(data.verificationObject),
    });
  } else if (data.stage === 'stage2') {
    navigate('Stage2AlarmRinging', {
      alarm: {
        id: String(data.alarmId),
        hour: Number(data.alarmHour),
        minute: Number(data.alarmMinute),
        label: String(data.alarmLabel),
        enabled: true,
        repeatDays: [],
        stage2DelayMinutes: 30,
        photoVerificationOn: true,
      },
      activityName: String(data.activityName),
    });
  }
};

const App = () => {

  useEffect(() => {
    // Init database
    initDatabase()
      .then(() => console.log('✅ Database ready'))
      .catch((err) => console.log('❌ Database init failed:', err));

    // Request notification permission
    notifee.requestPermission().then((settings) => {
      console.log('🔔 Notification permission:', settings.authorizationStatus);
    });

    // Foreground event handler
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        handleNotificationPress(detail.notification?.data);
      }
    });

    // Handle notification that launched the app from killed state
    notifee.getInitialNotification().then((initialNotification) => {
      if (initialNotification) {
        handleNotificationPress(initialNotification.notification.data);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle="light-content" backgroundColor="#000010" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SetAlarm" component={SetAlarmScreen} />
        <Stack.Screen name="AlarmRinging" component={AlarmRingingScreen} />
        <Stack.Screen name="Stage2AlarmRinging" component={Stage2AlarmRingingScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;