//not to be used

import { NextResponse } from "next/server";
import { generateEmbeddings } from "@/ai/embeddings";
import { getQueryDocuments } from "@/ai/pinecone";
import { summariseContext } from "@/ai/summarisation";
import { createPrompt, systemPrompt } from "@/ai/prompts";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing required field: 'query'" }, { status: 400 });
    }
    // Step 1: Generate embedding for the query
    const queryEmbedding = await generateEmbeddings(query);
    // Step 2: Retrieve relevant documents from Pinecone
    const queryDocuments = await getQueryDocuments(queryEmbedding)
    // Step 3: Summarize or select key points if context is lengthy
    const summarisedContext = await summariseContext(queryDocuments)
    // Step 4: Define few-shot examples (optional)
    const examples = [
      //{ question: "What is RAG?", answer: "Retrieval-Augmented Generation (RAG) combines external data sources with model-generated answers." },
      //{ question: "How does RAG improve AI?", answer: "RAG enhances answer relevance by using retrieved information tailored to the query." }
    ];
    // Step 5: Create a structured prompt with the context, instructions, and question
    const prompt = createPrompt(context, query, examples);
    // Step 6: Set up system instruction (if using chat API)
    const systemMessage = { role: "system", content: systemPrompt };

    // Step 7: Get the answer using OpenAI
    const response = await openai.chat.create({
      model: 'gpt-4',
      messages: [
        systemMessage,
        { role: "user", content: prompt },
      ],
    });

    return NextResponse.json({ message: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error adding document to Pinecone:", error);
    return NextResponse.json({ error: "Failed to add document to Pinecone" }, { status: 500 });
  }
}
