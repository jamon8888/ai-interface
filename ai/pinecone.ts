import { Pinecone, type ScoredPineconeRecord } from "@pinecone-database/pinecone";

let pinecone: Pinecone | null = null;

/**
 * Initializes and retrieves the Pinecone client.
 * 
 * @returns {Promise<Pinecone>} The initialized Pinecone client
 */
export async function getPinecone(): Promise<Pinecone> {

  const apiKey = process.env.PINECONE_API_KEY
  if (!apiKey){
    throw new Error(`Pinecone API KEY not present.`);
  }

  if (!pinecone) {
    pinecone = new Pinecone({apiKey});
  }
  return pinecone;
}

/**
 * Retrieves an existing index from Pinecone.
 *
 * @param {string} indexName - The name of the index to retrieve
 * @param {string} namespace - The namespace to retrieve within the index
 * @returns {Promise<any>} The Pinecone index if it exists
 * @throws Will throw an error if the index does not exist
 */
export async function getIndex(indexName = process.env.PINECONE_INDEX, namespace = process.env.PINECONE_NAMESPACE): Promise<any> {
  const pinecone = await getPinecone();
  const indexes = (await pinecone.listIndexes())?.indexes;

  const existingIndex = indexes?.find((index) => index.name === indexName);

  if (!existingIndex) {
    throw new Error(`Index ${indexName} does not exist in Pinecone.`);
  }

  let index = pinecone.Index(indexName)

  if (namespace) {
    index = index.namespace(namespace)
  }
  return index;
}

/**
 * Retrieves all document IDs in the specified Pinecone index.
 *
 * @param {string} indexName - The name of the index
 * @param {string} namespace - The namespace in the index
 * @param {number} batchSize - The number of IDs to retrieve per page
 * @returns {Promise<string[]>} A list of all document IDs in the index
 */
export async function getAllDocumentIds(batchSize = 100): Promise<string[]> {
  const index = await getIndex();

  const allIds: string[] = [];
  let paginationToken: string | undefined;

  try {
    do {
      // Fetch a page of IDs
      const response = await index.listPaginated({
        limit: batchSize,
        paginationToken,
      });

      // Collect IDs from the current page
      allIds.push(...response.vectors.map(v => v.id));

      // Update pagination token for the next page
      paginationToken = response.pagination?.next;
    } while (paginationToken); // Continue until no more pages are left

    return allIds;
  } catch (error) {
    console.error("Error retrieving document IDs:", error);
    throw new Error(`Error retrieving document IDs: ${error.message}`);
  }
}

/**
 * Fetches all documents in the specified Pinecone index given a list of document IDs.
 *
 * @param {string} indexName - The name of the index
 * @param {string[]} documentIds - An array of document IDs to fetch
 * @param {string} namespace - The namespace in the index
 * @param {number} batchSize - The number of documents to fetch per batch
 * @returns {Promise<PineconeRecord[]>} A list of all documents with metadata
 */
export async function getAllDocuments(batchSize = 1000): Promise<PineconeRecord[]> {
  const index = await getIndex();
  const documentIds = await getAllDocumentIds();
  const allDocuments: PineconeRecord[] = [];

  // Process IDs in batches
  for (let i = 0; i < documentIds.length; i += batchSize) {
    const batchIds = documentIds.slice(i, i + batchSize);

    try {
      // Fetch the current batch of documents
      const fetchResponse = await index.fetch(batchIds);

      // Collect fetched documents
      if (fetchResponse) {
        allDocuments.push(...Object.values(fetchResponse.records));
      }
    } catch (error) {
      console.error(`Error fetching documents for batch starting at index ${i}:`, error);
    }
  }
  return allDocuments;
}

/**
 * Fetches queried documents in the specified Pinecone index given a query embedding.
 *
 * @param {array} queryEmbedding - vector
 * @param {number} batchSize - The number of documents to fetch per batch
 * @returns {Promise<PineconeRecord[]>} A list of the top matching documents with metadata
 */
export async function getQueryDocuments(queryEmbedding, batchSize = 5): Promise<PineconeRecord[]> {
  const index = await getIndex();

  const matchingDocuments = await index.query({
    vector: queryEmbedding.data[0].embedding,
    topK: batchSize,
    includeValues: true,
    includeMetadata: true,
  });

  return matchingDocuments;
}

/**
 * Adds a document to the specified Pinecone index.
 *
 * @param {string} id - The unique identifier for the document
 * @param {number[]} vector - The vector representation of the document
 * @param {Record<string, any>} metadata - Metadata associated with the document
 * @returns {Promise<void>}
 */
export async function addDocument(id: string, vector: number[], metadata: Record<string, any>) {
  const index = await getIndex();
  await index.upsert([
    { id, values: vector, metadata }
  ]);
}

/**
 * Deletes a document by ID from the specified Pinecone index.
 *
 * @param {string} id - The unique identifier of the document to delete
 * @returns {Promise<void>}
 */
export async function deleteDocument(id: string) {
  const index = await getIndex();
  await index.deleteOne(id);
}
