import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import { Alarm } from '../types/Alarm';

const CHANNEL_ID = 'smart_alarm_v2';

const VERIFICATION_OBJECTS = [
  'Water Bottle',
  'House Keys',
  'TV Remote',
  'Charger',
  'Coffee Mug',
  'Shoes',
  'Wallet',
  'Book',
];

const MORNING_ACTIVITIES = [
  'Brushing Teeth',
  'Making Bed',
  'Eating Breakfast',
  'Washing Face',
];

export const getRandomObject = () =>
  VERIFICATION_OBJECTS[Math.floor(Math.random() * VERIFICATION_OBJECTS.length)];

export const getRandomActivity = () =>
  MORNING_ACTIVITIES[Math.floor(Math.random() * MORNING_ACTIVITIES.length)];

const createChannel = async () => {
  const channels = await notifee.getChannels();
  const exists = channels.find(c => c.id === CHANNEL_ID);
  if (!exists) {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Alarm Notifications',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: 'alarm_sound',
      vibration: true,
    });
  }
};

export const scheduleAlarm = async (alarm: Alarm): Promise<void> => {
  await createChannel();

  const now = new Date();
  const trigger = new Date();
  trigger.setHours(alarm.hour, alarm.minute, 0, 0);

  if (trigger <= now) {
    trigger.setDate(trigger.getDate() + 1);
  }

  const verificationObject = getRandomObject();

  const timestampTrigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: trigger.getTime(),
  };

  await notifee.createTriggerNotification(
    {
      id: alarm.id,
      title: '⏰ Wake Up!',
      body: `Find and photograph your ${verificationObject}`,
      data: {
        alarmId: alarm.id,
        verificationObject,
        stage: 'stage1',
        alarmHour: String(alarm.hour),
        alarmMinute: String(alarm.minute),
        alarmLabel: alarm.label,
        stage2DelayMinutes: String(alarm.stage2DelayMinutes),
      },
      android: {
        channelId: CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        fullScreenAction: { id: 'default' },
        pressAction: { id: 'default', launchActivity: 'default' },
        sound: 'alarm_sound',
        vibrationPattern: [300, 500, 300, 500],
        asForegroundService: true,
        loopSound: true,
      },
    },
    timestampTrigger
  );

  console.log(`✅ Alarm scheduled for ${trigger.toLocaleTimeString()} — object: ${verificationObject}`);
};

export const scheduleStage2 = async (alarm: Alarm, delayMinutes: number): Promise<void> => {
  await createChannel();

  const trigger = new Date(Date.now() + delayMinutes * 60 * 1000);
  const activityName = getRandomActivity();

  const timestampTrigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: trigger.getTime(),
  };

  await notifee.createTriggerNotification(
    {
      id: `${alarm.id}_stage2`,
      title: '⏰ Stage 2 — Morning Check',
      body: `Photograph yourself: ${activityName}`,
      data: {
        alarmId: alarm.id,
        activityName,
        stage: 'stage2',
        alarmHour: String(alarm.hour),
        alarmMinute: String(alarm.minute),
        alarmLabel: alarm.label,
      },
      android: {
        channelId: CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        fullScreenAction: { id: 'default' },
        pressAction: { id: 'default', launchActivity: 'default' },
        sound: 'alarm_sound',
        vibrationPattern: [300, 500, 300, 500],
        asForegroundService: true,
        loopSound: true,
      },
    },
    timestampTrigger
  );

  console.log(`✅ Stage 2 scheduled in ${delayMinutes} minutes — activity: ${activityName}`);
};

export const cancelAlarm = async (alarmId: string): Promise<void> => {
  await notifee.cancelNotification(alarmId);
  await notifee.cancelNotification(`${alarmId}_stage2`);
  console.log(`🗑️ Alarm cancelled: ${alarmId}`);
};