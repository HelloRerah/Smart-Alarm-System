const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    assetExts: [
      ...require('@react-native/metro-config').getDefaultConfig(__dirname).resolver.assetExts,
      'tflite',
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);