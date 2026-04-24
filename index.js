/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import { navigate } from './services/navigationRef';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    const data = detail.notification?.data;
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
  }
});

AppRegistry.registerComponent(appName, () => App);