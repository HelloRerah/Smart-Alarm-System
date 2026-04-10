import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SetAlarmScreen from './screens/SetAlarmScreen';
import { Alarm } from './types/Alarm';
import AlarmRingingScreen from './screens/AlarmRingingScreen';
import Stage2AlarmRingingScreen from './screens/Stage2AlarmRingingScreen';
import CameraScreen from './screens/CameraScreen';

export type RootStackParamList = {
  Home: undefined;
  SetAlarm: { onSave: (alarm: Alarm) => void };
  AlarmRinging: { alarm: Alarm; verificationObject: string };
  Stage2AlarmRinging: { alarm: Alarm; activityName: string };
  Camera: { mode: 'stage1' | 'stage2'; targetName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#000010"/>
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      >
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