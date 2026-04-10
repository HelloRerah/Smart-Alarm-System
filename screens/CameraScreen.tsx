import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { RootStackParamList } from '../App';

const CameraScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Camera'>>();
  const { mode, targetName } = route.params;

  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  // Ask for camera permission when the screen opens
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleCapture = async () => {
    if (camera.current == null) {
      console.log('Camera ref not ready');
      return;
    }
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });
      const fullPath = `file://${photo.path}`;
      console.log('📸 Photo captured at:', fullPath);
      console.log('Mode:', mode, 'Target:', targetName);
      Alert.alert('Photo captured!', `Saved to:\n${fullPath}`);
      // TODO: next session — send to AI verification, handle pass/fail
    } catch (error) {
      console.log('Capture failed:', error);
    }
  };

  // Permission not yet granted
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>Requesting camera permission...</Text>
      </View>
    );
  }

  // No camera device found (e.g. emulator without camera)
  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>No camera device found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Happy path — show camera
  return (
    <View style={styles.container}>
      <View style={styles.previewBox}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
      </View>

      <Text style={styles.instruction}>
        Point at the {mode === 'stage1' ? 'object' : 'activity'} and tap to capture
      </Text>

      <View style={styles.captureWrapper}>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>

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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  previewBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    overflow: 'hidden',
  },
  instruction: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  captureWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
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
  fallbackText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 30,
  },
});

export default CameraScreen;