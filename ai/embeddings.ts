import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import pdfParse from 'pdf-parse';

import { isSelfContained } from '@/ai/self-containment'

const EMBEDDINGS_MODEL = 'text-embedding-ada-002'
const TXT_CONTENT_TYPE = 'text/plain'
const PDF_CONTENT_TYPE = 'application/pdf'

/**
 * Generates embeddings for a given text using the Vercel AI SDK.
 * 
 * @param coreMessages - The coreMessages to generate embeddings for
 * @returns A promise that resolves to an array of embeddings
 */
export async function generateMessageEmbeddings(userMessage: string, coreMessages: Array): Promise<number[] | null> {

  if (!userMessage || !coreMessages || !coreMessages?.length) {
    throw new Error(`Error generateEmbeddings method parameters not passed`);
  }

  let queryText;

  // whether to use last message from user or full conversation based on Heuristics
  if (isSelfContained(userMessage, coreMessages)) {
    queryText = userMessage.content;
  } else {
    queryText = coreMessages.map(msg => msg.content).join('\n');
  }

  try {
    const embedding = await generateEmbeddings(queryText)
    return embedding;
  } catch (error) {
    console.error('Failed to generate embeddings:', error);
    return null;
  }
}

/**
 * Generates embeddings for a given text using the Vercel AI SDK.
 * 
 * @param coreMessages - The coreMessages to generate embeddings for
 * @returns A promise that resolves to an array of embeddings
 */
export async function generateEmbeddings(text: string): Promise<number[] | null> {

  if (!text) {
    throw new Error(`Error generate embeddings method text parameter not passed`);
  }

  try {
    const { embedding } = await embed({
      model: openai.embedding(EMBEDDINGS_MODEL),
      value: text,
      maxRetries: 3,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
        //functionId: 'get-text-embedding',
        //metadata: { user: 'example-user', queryType: 'embedding' },
      },
    });

    return embedding;
  } catch (error) {
    console.error('Failed to generate embeddings:', error);
    return null;
  }
}

/**
 * Extracts text content from a file.
 * Supports plain text files and PDFs. Extend for other file types as needed.
 * 
 * @param file - The file to extract text from
 * @returns A promise that resolves to the extracted text
 */
export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === TXT_CONTENT_TYPE) {
    return await file.text();
  } else if (file.type === PDF_CONTENT_TYPE) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfText = await pdfParse(Buffer.from(arrayBuffer));
    return pdfText.text;
  }
  throw new Error('Unsupported file type for text extraction');
}

