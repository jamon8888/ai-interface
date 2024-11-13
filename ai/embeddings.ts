import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import pdf from 'pdf-parse';

/**
 * Extracts text content from a file.
 * Supports plain text files and PDFs. Extend for other file types as needed.
 * 
 * @param file - The file to extract text from
 * @returns A promise that resolves to the extracted text
 */
export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'text/plain') {
    return await file.text();
  } else if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);
    //const pdfText = pdfParse(dataBuffer);
    console.log(dataBuffer)
    //return pdfText.text;
    //console.log(pdf(dataBuffer))
    return "yada"
  }
  //throw new Error('Unsupported file type for text extraction');
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
      model: openai.embedding('text-embedding-3-small'), // Adjust model name as needed
      value: text,
    });
    return embedding;
  } catch (error) {
    console.error('Failed to generate embeddings:', error);
    return null;
  }
}
