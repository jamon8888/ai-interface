import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import pdfParse from 'pdf-parse';

const EMBEDDINGS_MODEL = 'text-embedding-ada-002'
const TXT_CONTENT_TYPE = 'text/plain'
const PDF_CONTENT_TYPE = 'application/pdf'

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

/**
 * Generates embeddings for a given text using the Vercel AI SDK.
 * 
 * @param text - The text to generate embeddings for
 * @returns A promise that resolves to an array of embeddings
 */
export async function generateEmbeddings(text: string): Promise<number[] | null> {
  try {
    const { embedding } = await embed({
      model: openai.embedding(EMBEDDINGS_MODEL),
      value: text,
    });
    return embedding;
  } catch (error) {
    console.error('Failed to generate embeddings:', error);
    return null;
  }
}
