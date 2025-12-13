import type { Area, Category, JohnnyDecimalSystem, SearchResult } from '@/types/johnnyDecimal';

const k1 = 1.5;
const b = 0.75;

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(t => t.length > 0);
}

function getDocumentText(area: Area, category?: Category): string {
  if (category) {
    return `${category.name} ${category.description} ${category.tags.join(' ')} ${area.name}`;
  }
  return `${area.name} ${area.description} ${area.tags.join(' ')}`;
}

function buildCorpus(system: JohnnyDecimalSystem): { docs: string[]; results: SearchResult[] } {
  const docs: string[] = [];
  const results: SearchResult[] = [];

  for (const area of system.areas) {
    docs.push(getDocumentText(area));
    results.push({ type: 'area', area, score: 0, matchedTerms: [] });

    for (const category of area.categories) {
      docs.push(getDocumentText(area, category));
      results.push({ type: 'category', area, category, score: 0, matchedTerms: [] });
    }
  }

  return { docs, results };
}

function calculateIDF(term: string, tokenizedDocs: string[][]): number {
  const docsWithTerm = tokenizedDocs.filter(doc => doc.includes(term)).length;
  if (docsWithTerm === 0) return 0;
  return Math.log((tokenizedDocs.length - docsWithTerm + 0.5) / (docsWithTerm + 0.5) + 1);
}

function calculateBM25Score(
  queryTerms: string[],
  docTokens: string[],
  avgDocLength: number,
  idfScores: Map<string, number>
): { score: number; matchedTerms: string[] } {
  let score = 0;
  const matchedTerms: string[] = [];
  const docLength = docTokens.length;

  for (const term of queryTerms) {
    const termFreq = docTokens.filter(t => t === term).length;
    if (termFreq === 0) continue;

    matchedTerms.push(term);
    const idf = idfScores.get(term) || 0;
    const numerator = termFreq * (k1 + 1);
    const denominator = termFreq + k1 * (1 - b + b * (docLength / avgDocLength));
    score += idf * (numerator / denominator);
  }

  return { score, matchedTerms };
}

export function searchSystem(system: JohnnyDecimalSystem, query: string): SearchResult[] {
  if (!query.trim()) return [];

  const { docs, results } = buildCorpus(system);
  const tokenizedDocs = docs.map(tokenize);
  const queryTerms = tokenize(query);

  if (queryTerms.length === 0) return [];

  const avgDocLength = tokenizedDocs.reduce((sum, doc) => sum + doc.length, 0) / tokenizedDocs.length;

  const idfScores = new Map<string, number>();
  for (const term of queryTerms) {
    idfScores.set(term, calculateIDF(term, tokenizedDocs));
  }

  const scoredResults = results.map((result, idx) => {
    const { score, matchedTerms } = calculateBM25Score(
      queryTerms,
      tokenizedDocs[idx],
      avgDocLength,
      idfScores
    );
    return { ...result, score, matchedTerms };
  });

  return scoredResults
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
