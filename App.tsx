import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SetAlarmScreen from './screens/SetAlarmScreen';
import { Alarm } from './types/Alarm';

export type RootStackParamList = {
  Home: undefined;
  SetAlarm: { onSave: (alarm: Alarm) => void };
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;