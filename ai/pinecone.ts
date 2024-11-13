import { Pinecone, type ScoredPineconeRecord } from "@pinecone-database/pinecone";

let pinecone: Pinecone | null = null;

/**
 * Initializes and retrieves the Pinecone client.
 * 
 * @returns {Promise<Pinecone>} The initialized Pinecone client
 */
export async function getPinecone(): Promise<Pinecone> {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });
  }
  return pinecone;
}

/**
 * Retrieves an existing index from Pinecone.
 *
 * @param {string} indexName - The name of the index to retrieve
 * @returns {Promise<any>} The Pinecone index if it exists
 * @throws Will throw an error if the index does not exist
 */
export async function getIndex(indexName: string): Promise<any> {
  const pinecone = await getPinecone();
  const indexes = (await pinecone.listIndexes())?.indexes;
  const existingIndex = indexes?.find((index) => index.name === indexName);

  if (!existingIndex) {
    throw new Error(`Index ${indexName} does not exist in Pinecone.`);
  }

  return pinecone.Index(indexName);
}

/**
 * Lists all documents in the specified Pinecone index.
 *
 * @param {string} indexName - The name of the index
 * @param {number} topK - The number of documents to retrieve
 * @returns {Promise<ScoredPineconeRecord[]>} A list of documents with metadata
 */
export async function listAllDocuments(indexName: string, topK = 1000): Promise<ScoredPineconeRecord[]> {
  const index = await getIndex(indexName);

  try {
    const queryResult = await index.query({
      topK,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.error("Error listing all documents in Pinecone index:", error);
    throw new Error(`Error listing documents: ${error}`);
  }
}

/**
 * Adds a document to the specified Pinecone index.
 *
 * @param {string} indexName - The name of the index
 * @param {string} id - The unique identifier for the document
 * @param {number[]} vector - The vector representation of the document
 * @param {Record<string, any>} metadata - Metadata associated with the document
 * @returns {Promise<void>}
 */
export async function addDocument(indexName: string, id: string, vector: number[], metadata: Record<string, any>) {
  const index = await getIndex(indexName);
  await index.upsert({
    vectors: [{ id, values: vector, metadata }],
  });
}

/**
 * Deletes a document by ID from the specified Pinecone index.
 *
 * @param {string} indexName - The name of the index
 * @param {string} id - The unique identifier of the document to delete
 * @returns {Promise<void>}
 */
export async function deleteDocument(indexName: string, id: string) {
  const index = await getIndex(indexName);
  await index.delete({ ids: [id] });
}
