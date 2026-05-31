// services/realAiVerification.ts
// Real AI verification using react-native-fast-tflite + Teachable Machine model
import { loadTensorflowModel } from 'react-native-fast-tflite';
import { VerificationResult } from './aiVerification';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

// Labels must match Sam's model exactly (labels.txt index order)
const LABELS = [
  'Grass',         // 0
  'Chair',         // 1
  'Dustbin',       // 2
  'Tree',          // 3
  'Keys',          // 4
  'Stove',         // 5
  'Fridge',        // 6
  'Microwave',     // 7
  'Sky',           // 8
  'Kettle',        // 9
  'Light Switch',  // 10
  'Door Handle',   // 11
  'TV',            // 12
  'Broom',         // 13
  'Shoes',         // 14
  'Water Bottle',  // 15
  'TV Remote',     // 16
  'Brick Wall',    // 17
];

const CONFIDENCE_THRESHOLD = 0.75;
const MODEL_INPUT_SIZE = 224;

let model: Awaited<ReturnType<typeof loadTensorflowModel>> | null = null;

const getModel = async () => {
  if (model) return model;
  model = await loadTensorflowModel(
    require('../assets/model_unquant.tflite') as any,
    []
  );
  return model;
};

const imageUriToInputBuffer = async (uri: string): Promise<ArrayBuffer> => {
  // Step 1: Resize longest side to 224 (aspect ratio preserved by resizer)
  const resized = await ImageResizer.createResizedImage(
    uri,
    MODEL_INPUT_SIZE,
    MODEL_INPUT_SIZE,
    'JPEG',
    90,
    0
  );

  // Step 2: Read the resized file as base64
  const cleanPath = resized.uri.replace('file://', '');
  const base64 = await RNFS.readFile(cleanPath, 'base64');

  // Step 3: Decode JPEG to raw RGBA pixels
  const buffer = Buffer.from(base64, 'base64');
  const decoded = jpeg.decode(buffer, { useTArray: true });

  const srcWidth = decoded.width;
  const srcHeight = decoded.height;
  console.log(`📐 Decoded: ${srcWidth}x${srcHeight}, data length: ${decoded.data.length}`);

  // Step 4: Center the source image into a 224x224 canvas with black padding.
  // This mirrors how Teachable Machine handles non-square images.
  const dstSize = MODEL_INPUT_SIZE;
  const offsetX = Math.floor((dstSize - srcWidth) / 2);
  const offsetY = Math.floor((dstSize - srcHeight) / 2);

  const outputBuffer = new ArrayBuffer(dstSize * dstSize * 3 * 4);
  const float32 = new Float32Array(outputBuffer); // zeros = black padding by default

  for (let y = 0; y < srcHeight; y++) {
    for (let x = 0; x < srcWidth; x++) {
      const srcIdx = (y * srcWidth + x) * 4; // RGBA source
      const dstX = x + offsetX;
      const dstY = y + offsetY;
      const dstIdx = (dstY * dstSize + dstX) * 3; // RGB destination
      float32[dstIdx] = decoded.data[srcIdx] / 255.0;
      float32[dstIdx + 1] = decoded.data[srcIdx + 1] / 255.0;
      float32[dstIdx + 2] = decoded.data[srcIdx + 2] / 255.0;
    }
  }

  return outputBuffer;
};

export const verifyPhotoReal = async (
  photoUri: string,
  targetName: string
): Promise<VerificationResult> => {
  try {
    const tflite = await getModel();
    const inputData = await imageUriToInputBuffer(photoUri);
    const outputs = await (tflite as any).run([inputData]);

    console.log('🔍 outputs length:', outputs?.length);
    console.log('🔍 outputs[0] type:', typeof outputs?.[0], '| length:', outputs?.[0]?.length);
    console.log('🔍 outputs[0] value:', JSON.stringify(outputs?.[0]));

    const scores = Array.from(new Float32Array(outputs[0] as ArrayBuffer));

    console.log(
      '🤖 AI scores:',
      scores.map((s, i) => `${LABELS[i]}: ${(s * 100).toFixed(1)}%`).join(', ')
    );

    // Find the label the model is most confident about
    const topIndex = scores.indexOf(Math.max(...scores));
    const topLabel = LABELS[topIndex];
    const topConfidence = scores[topIndex];

    // Find the index of what we're actually looking for
    const targetIndex = LABELS.findIndex(
      label => label.toLowerCase() === targetName.toLowerCase()
    );

    if (targetIndex === -1) {
      console.warn(`⚠️ Label "${targetName}" not found in model labels`);
      return { passed: false, confidence: 0 };
    }

    const targetConfidence = scores[targetIndex];

    // Top predicted class must BE the target AND exceed threshold.
    // Prevents false pass when model is confused but target sneaks above 75%
    // while something else scores higher.
    const isTopClass = topIndex === targetIndex;
    const passed = isTopClass && targetConfidence >= CONFIDENCE_THRESHOLD;

    console.log(`🏆 Top prediction: "${topLabel}" (${(topConfidence * 100).toFixed(1)}%)`);
    console.log(
      `🎯 Target: "${targetName}" | Confidence: ${(targetConfidence * 100).toFixed(1)}% | Top class match: ${isTopClass ? '✅' : '❌'} | ${passed ? 'PASS ✅' : 'FAIL ❌'}`
    );

    return { passed, confidence: targetConfidence };
  } catch (error) {
    console.error('❌ Real AI verification failed:', error);
    return { passed: false, confidence: 0 };
  }
};
