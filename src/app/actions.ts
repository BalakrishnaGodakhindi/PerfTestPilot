'use server';

import { generateTestCases, GenerateTestCasesInput, GenerateTestCasesOutput } from '@/ai/flows/generate-test-cases';

export async function generateTestCasesAction(
  input: GenerateTestCasesInput
): Promise<{ success: boolean; data?: GenerateTestCasesOutput; error?: string }> {
  try {
    const result = await generateTestCases(input);
    if (!result.jmeterScript && !result.testCases) {
      return { success: false, error: 'AI model did not return any test cases or JMeter script.' };
    }
    return { success: true, data: result };
  } catch (e) {
    console.error('Error in generateTestCasesAction:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during test case generation.';
    return { success: false, error: errorMessage };
  }
}
