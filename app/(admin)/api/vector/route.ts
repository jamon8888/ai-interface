import { NextResponse } from "next/server";
import { listAllDocuments, addDocument, deleteDocument } from "@/ai/pinecone";

export async function GET() {
  try {
    const indexName = process.env.PINECONE_INDEX || "";
    const topK = 1000; // Adjust based on your dataset size or query limits
    const documents = await listAllDocuments(indexName, topK);

    console.log("Retrieved documents:", documents);

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error retrieving documents from Pinecone:", error);
    return NextResponse.json({ error: "Failed to retrieve documents from Pinecone" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, vector, metadata } = await req.json();
    const indexName = process.env.PINECONE_INDEX || "";

    if (!id || !vector || !metadata) {
      return NextResponse.json({ error: "Missing required fields: 'id', 'vector', or 'metadata'" }, { status: 400 });
    }

    await addDocument(indexName, id, vector, metadata);
    return NextResponse.json({ message: "Document added successfully" });
  } catch (error) {
    console.error("Error adding document to Pinecone:", error);
    return NextResponse.json({ error: "Failed to add document to Pinecone" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const indexName = process.env.PINECONE_INDEX || "";

    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    await deleteDocument(indexName, id);
    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document from Pinecone:", error);
    return NextResponse.json({ error: "Failed to delete document from Pinecone" }, { status: 500 });
  }
}
