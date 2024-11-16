import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const SUMMARISATION_MODEL = 'gpt-4-turbo';
const MAX_TOKENS = 50;
const MODEL_TEMPERATURE = 0.8;
const SUMMARY_SYSTEM_PROMPT = 'Summarise the following text into key points.'

/**
 * Summarise lengthy context to key points
 * 
 * @param queryDocuments
 * @returns 
 */
export async function summariseContext(queryDocuments) {
  try {
    const rawContext = queryDocuments.matches.map(match => match.metadata.textContent).join("\n");

    if (rawContext.length > 500){
      const { text } = await generateText({
        model: openai(SUMMARISATION_MODEL),
        system: SUMMARY_SYSTEM_PROMPT,
        prompt: rawContext,
        max_tokens: MAX_TOKENS,
        temperature: MODEL_TEMPERATURE,
      });
      console.log('summary', text)
      return text;
    }
  } catch(error) {
    console.error(error)
  }
}
