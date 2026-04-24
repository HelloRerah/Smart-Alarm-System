import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchCamera } from 'react-native-image-picker';
import { RootStackParamList } from '../App';
import { verifyPhoto } from '../services/aiVerification';

const CameraScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Camera'>>();
  const { mode, targetName } = route.params;

  const handleCapture = async () => {
    launchCamera({ mediaType: 'photo', cameraType: 'back' }, async (response) => {
      if (response.didCancel || response.errorCode) {
        console.log('Camera cancelled or error:', response.errorMessage);
        return;
      }

      const uri = response.assets?.[0]?.uri;
      if (!uri) return;

      console.log('📸 Photo captured at:', uri);
      Alert.alert('Verifying...', 'Checking your photo...');

      const result = await verifyPhoto(uri, targetName);

      if (result.passed) {
        Alert.alert(
          '✅ Verified!',
          `Confidence: ${(result.confidence * 100).toFixed(0)}%`,
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      } else {
        Alert.alert(
          '❌ Not recognised',
          `Confidence too low (${(result.confidence * 100).toFixed(0)}%). Try again.`,
          [{ text: 'Retry', style: 'cancel' }]
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        Tap the button to open your camera and photograph the{' '}
        {mode === 'stage1' ? 'object' : 'activity'}
      </Text>

      <Text style={styles.target}>{targetName}</Text>

      <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
        <View style={styles.captureInner} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000010',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  instruction: {
    color: '#8E8E93',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  target: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#2962FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFFFFF',
  },
  cancelText: {
    color: '#8E8E93',
    fontSize: 16,
  },
});

export default CameraScreen;