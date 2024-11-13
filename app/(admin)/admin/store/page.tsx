'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { FileUploader } from '@/components/custom/file-uploader';

export default function StorePage() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch('/api/vector');
      const data = await response.json();
      setDocuments(data);
    };

    fetchDocuments();
  }, []);

  return (
    <div>
      <h1>Store</h1>
      <ul>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <li key={doc.id}>
              <strong>ID:</strong> {doc.id} <br />
              <strong>Score:</strong> {doc.score} <br />
              <strong>Metadata:</strong> {JSON.stringify(doc.metadata)}
            </li>
          ))
        ) : (
          <p>No documents found in Store.</p>
        )}
      </ul>

      <FileUploader />

      <ul>
        <li>
          <Link href="/admin">Back</Link>
        </li>
      </ul>
    </div>
  );
}
