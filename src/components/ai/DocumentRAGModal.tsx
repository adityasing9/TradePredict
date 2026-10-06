import React, { useState, useEffect } from 'react';
import { RAGDocument } from '../../types/ai';
import { chunkDocumentText, queryLocalDocuments } from '../../engines/rag/localRagEngine';
import { saveDocument, getAllDocuments, deleteDocument } from '../../db/documentStore';
import { FileUp, BookOpen, Trash2, Search, X, CheckCircle, FileText } from 'lucide-react';

interface DocumentRAGModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeAssetSymbol?: string;
}

export const DocumentRAGModal: React.FC<DocumentRAGModalProps> = ({
  isOpen,
  onClose,
  activeAssetSymbol
}) => {
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string; documentTitle: string; relevanceScore: number }[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen]);

  const loadDocuments = async () => {
    const docs = await getAllDocuments();
    setDocuments(docs);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const chunks = chunkDocumentText(text);

      const doc: RAGDocument = {
        id: `doc-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        assetSymbol: activeAssetSymbol,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'text/plain',
        uploadedAt: Date.now(),
        chunks
      };

      await saveDocument(doc);
      await loadDocuments();
    } catch (err) {
      console.error('Failed to parse uploaded document:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    const res = queryLocalDocuments(query, documents, 4);
    setResults(res);
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    await loadDocuments();
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-background-secondary border border-background-border rounded-xl shadow-2xl p-5 flex flex-col gap-4 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-background-border pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Local Document Research & RAG
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                100% In-Browser Vector Chunking & Document Intelligence
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload & Search Area */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* File Upload Button */}
          <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-mono font-medium cursor-pointer transition-colors shadow-md shadow-brand-500/20">
            <FileUp className="w-4 h-4" />
            <span>{uploading ? 'Chunking...' : 'Upload Report / PDF / TXT'}</span>
            <input
              type="file"
              accept=".txt,.md,.json,.csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {/* Search Input */}
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Query annual reports (e.g., 'revenue growth', 'NPL recovery', 'debt schedule')..."
              className="flex-1 px-3 py-2 rounded-lg bg-background-card border border-background-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-sans"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-2 rounded-lg bg-background-elevated hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 border border-background-border"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Query</span>
            </button>
          </div>
        </div>

        {/* Content Body: Search Results & Stored Documents */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Query Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-brand-400 uppercase">
                Relevant Extracted Passages ({results.length})
              </h4>
              <div className="space-y-2">
                {results.map((res, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-background-card border border-brand-500/30 text-xs text-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-brand-400">
                      <span>Source: {res.documentTitle}</span>
                      <span>Score: {res.relevanceScore}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{res.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Library */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
              Ingested Local Documents ({documents.length})
            </h4>

            {documents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono border border-dashed border-background-border rounded-xl">
                No local documents uploaded yet. Upload an annual report or whitepaper to query.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg bg-background-card border border-background-border flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-brand-400 flex-shrink-0" />
                      <div className="truncate">
                        <span className="text-xs font-bold text-white block truncate">{doc.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {doc.chunks.length} chunks • {(doc.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors flex-shrink-0"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
