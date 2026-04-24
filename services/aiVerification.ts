// services/aiVerification.ts
// TODO: Replace mock with real react-native-fast-tflite model

export type VerificationResult = {
  passed: boolean;
  confidence: number;
};

export const verifyPhoto = async (
  photoPath: string,
  targetName: string
): Promise<VerificationResult> => {
  // Simulate network/model delay
  await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));

  // Mock: 70% chance of passing (realistic for testing)
  const confidence = Math.random();
  const passed = confidence >= 0.25;

  console.log(`🤖 AI mock — target: "${targetName}", confidence: ${(confidence * 100).toFixed(1)}%, passed: ${passed}`);

  return { passed, confidence };
};