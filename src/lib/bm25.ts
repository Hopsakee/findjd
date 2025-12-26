import type { Area, Category, JohnnyDecimalSystem, SearchResult } from '@/types/johnnyDecimal';

const k1 = 1.5;
const b = 0.75;

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(t => t.length > 0);
}

function getDocumentText(area: Area, category?: Category, item?: { id: string; name: string }): string {
  if (item && category) {
    return `${item.name} ${item.id} ${category.name} ${category.description} ${category.tags.join(' ')} ${area.name}`;
  }
  if (category) {
    return `${category.name} ${category.description} ${category.tags.join(' ')} ${area.name} ${area.description} ${area.tags.join(' ')}`;
  }
  return `${area.name} ${area.description} ${area.tags.join(' ')}`;
}

interface DocEntry {
  type: 'area' | 'category' | 'item';
  areaId: string;
  categoryId?: string;
  itemId?: string;
  text: string;
}

function buildCorpus(system: JohnnyDecimalSystem): DocEntry[] {
  const entries: DocEntry[] = [];

  for (const area of system.areas) {
    entries.push({
      type: 'area',
      areaId: area.id,
      text: getDocumentText(area)
    });

    for (const category of area.categories) {
      entries.push({
        type: 'category',
        areaId: area.id,
        categoryId: category.id,
        text: getDocumentText(area, category)
      });

      for (const item of category.items || []) {
        entries.push({
          type: 'item',
          areaId: area.id,
          categoryId: category.id,
          itemId: item.id,
          text: getDocumentText(area, category, item)
        });
      }
    }
  }

  return entries;
}

function calculateIDF(term: string, tokenizedDocs: string[][]): number {
  // Check for partial matches (any token containing the search term)
  const docsWithTerm = tokenizedDocs.filter(doc => doc.some(t => t.includes(term))).length;
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
    // Count partial matches (tokens that contain the search term)
    const matchingTokens = docTokens.filter(t => t.includes(term));
    const termFreq = matchingTokens.length;
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

  const entries = buildCorpus(system);
  const tokenizedDocs = entries.map(e => tokenize(e.text));
  const queryTerms = tokenize(query);

  if (queryTerms.length === 0) return [];

  const avgDocLength = tokenizedDocs.reduce((sum, doc) => sum + doc.length, 0) / tokenizedDocs.length;

  const idfScores = new Map<string, number>();
  for (const term of queryTerms) {
    idfScores.set(term, calculateIDF(term, tokenizedDocs));
  }

  const scoredResults: SearchResult[] = [];

  entries.forEach((entry, idx) => {
    const { score, matchedTerms } = calculateBM25Score(
      queryTerms,
      tokenizedDocs[idx],
      avgDocLength,
      idfScores
    );

    if (score > 0) {
      const area = system.areas.find(a => a.id === entry.areaId)!;
      const category = entry.categoryId 
        ? area.categories.find(c => c.id === entry.categoryId)
        : undefined;
      const item = entry.itemId && category
        ? category.items?.find(i => i.id === entry.itemId)
        : undefined;

      scoredResults.push({
        type: entry.type,
        area,
        category,
        item,
        score,
        matchedTerms
      });
    }
  });

  return scoredResults.sort((a, b) => b.score - a.score);
}
