'use server';

/**
 * @fileOverview Generates performance test cases and JMeter script structures based on Swagger API documentation.
 *
 * - generateTestCases - A function that handles the test case generation process.
 * - GenerateTestCasesInput - The input type for the generateTestCases function.
 * - GenerateTestCasesOutput - The return type for the generateTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestCasesInputSchema = z.object({
  swaggerDoc: z
    .string()
    .describe('Swagger API documentation in JSON or YAML format.'),
});
export type GenerateTestCasesInput = z.infer<typeof GenerateTestCasesInputSchema>;

const GenerateTestCasesOutputSchema = z.object({
  jmeterScript: z
    .string()
    .describe('Generated JMeter script in XML format.'),
  testCases: z
    .string()
    .describe('Generated performance test cases in a human-readable format (e.g., Markdown).'),
});
export type GenerateTestCasesOutput = z.infer<typeof GenerateTestCasesOutputSchema>;

export async function generateTestCases(input: GenerateTestCasesInput): Promise<GenerateTestCasesOutput> {
  return generateTestCasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestCasesPrompt',
  input: {schema: GenerateTestCasesInputSchema},
  output: {schema: GenerateTestCasesOutputSchema},
  prompt: `You are an expert performance test case generator. Your tasks are:
1.  Create a list of human-readable performance test cases in Markdown format.
2.  Create a valid JMeter test plan (.jmx file) in XML format.

Both tasks should be based on the provided Swagger/OpenAPI documentation.

For the JMeter script, the output MUST be a single, valid XML string, starting with \`<?xml version="1.0" encoding="UTF-8"?>\`. Do not include any other text, explanations, or markdown formatting before or after the XML content.

Analyze the following API documentation and generate both the test cases and the JMeter script.

API Documentation:
{{swaggerDoc}}`,
});

const generateTestCasesFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFlow',
    inputSchema: GenerateTestCasesInputSchema,
    outputSchema: GenerateTestCasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
