import { openai } from '@ai-sdk/openai';

const MAX_TOKENS = 150

/**
 * Summarise lengthy context to key points
 * 
 * @param queryDocuments
 * @returns 
 */
export async function summariseContext(queryDocuments) {
  const rawContext = queryDocuments.matches.map(match => match.metadata.text).join("\n");
  if (rawContext.length > 500){
    const context = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Summarise the following text into key points:\n\n${context}`,
      max_tokens: MAX_TOKENS,
    });
    return context.choices[0].text.trim();
  }

  return rawContext
}
