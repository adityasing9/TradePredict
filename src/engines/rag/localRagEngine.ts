import { RAGDocument, DocumentChunk } from '../../types/ai';

export function chunkDocumentText(
  text: string,
  chunkSize = 600,
  overlap = 100
): DocumentChunk[] {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const chunks: DocumentChunk[] = [];
  let index = 0;
  let chunkId = 1;

  while (index < words.length) {
    const chunkWords = words.slice(index, index + chunkSize);
    const chunkText = chunkWords.join(' ');

    // Extract top keywords for inverted index
    const keywords = Array.from(
      new Set(
        chunkText
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .split(/\s+/)
          .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
      )
    ).slice(0, 15);

    chunks.push({
      id: `chunk-${chunkId++}`,
      text: chunkText,
      keywords,
      tokenEstimate: Math.round(chunkWords.length * 1.3)
    });

    index += chunkSize - overlap;
  }

  return chunks;
}

const STOP_WORDS = new Set([
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
  'his', 'from', 'they', 'say', 'her', 'she', 'will', 'one', 'all', 'would',
  'there', 'their', 'what', 'about', 'which', 'when', 'make', 'can', 'like',
  'time', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your'
]);

/**
 * Searches chunks using TF-IDF / term frequency matching.
 */
export function queryLocalDocuments(
  query: string,
  documents: RAGDocument[],
  maxResults = 3
): { text: string; documentTitle: string; relevanceScore: number }[] {
  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (queryTerms.length === 0) return [];

  const matchedChunks: { text: string; documentTitle: string; relevanceScore: number }[] = [];

  for (const doc of documents) {
    for (const chunk of doc.chunks) {
      let score = 0;
      const lowerChunk = chunk.text.toLowerCase();

      for (const term of queryTerms) {
        if (chunk.keywords.includes(term)) score += 3;
        const occurrences = (lowerChunk.match(new RegExp(term, 'g')) || []).length;
        score += occurrences;
      }

      if (score > 0) {
        matchedChunks.push({
          text: chunk.text,
          documentTitle: doc.title,
          relevanceScore: score
        });
      }
    }
  }

  return matchedChunks
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}
