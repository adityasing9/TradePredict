import { getDB } from './index';
import { AIAnalystReport } from '../types/ai';

export async function saveReport(report: AIAnalystReport): Promise<void> {
  const db = await getDB();
  await db.put('reports', report);
}

export async function getLatestReportForAsset(assetId: string): Promise<AIAnalystReport | undefined> {
  const db = await getDB();
  const reports = await db.getAllFromIndex('reports', 'by-asset', assetId);
  if (reports.length === 0) return undefined;
  return reports.sort((a, b) => b.generatedAt - a.generatedAt)[0];
}

export async function getAllReports(): Promise<AIAnalystReport[]> {
  const db = await getDB();
  const all = await db.getAll('reports');
  return all.sort((a, b) => b.generatedAt - a.generatedAt);
}

export async function deleteReport(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('reports', id);
}
