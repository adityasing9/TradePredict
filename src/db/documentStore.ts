import { getDB } from './index';
import { RAGDocument } from '../types/ai';

export async function saveDocument(doc: RAGDocument): Promise<void> {
  const db = await getDB();
  await db.put('documents', doc);
}

export async function getAllDocuments(): Promise<RAGDocument[]> {
  const db = await getDB();
  const all = await db.getAll('documents');
  return all.sort((a, b) => b.uploadedAt - a.uploadedAt);
}

export async function getDocumentsByAsset(symbol: string): Promise<RAGDocument[]> {
  const db = await getDB();
  const clean = symbol.toUpperCase().trim();
  const all = await db.getAll('documents');
  return all.filter((d) => !d.assetSymbol || d.assetSymbol.toUpperCase() === clean);
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('documents', id);
}
