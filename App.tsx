import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SetAlarmScreen from './screens/SetAlarmScreen';
import AlarmRingingScreen from './screens/AlarmRingingScreen';
import CameraScreen from './screens/CameraScreen';
import Stage2AlarmRingingScreen from './screens/Stage2AlarmRingingScreen';

export type RootStackParamList = {
  Home: undefined;
  SetAlarm: undefined;
  AlarmRinging: undefined;
  Camera: undefined;
  Stage2Ringing: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SetAlarm" component={SetAlarmScreen} />
        <Stack.Screen name="AlarmRinging" component={AlarmRingingScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Stage2Ringing" component={Stage2AlarmRingingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}