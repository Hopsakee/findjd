export interface Category {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export interface Area {
  id: string;
  name: string;
  description: string;
  tags: string[];
  categories: Category[];
}

export interface JohnnyDecimalSystem {
  name: string;
  areas: Area[];
}

export interface SearchResult {
  type: 'area' | 'category';
  area: Area;
  category?: Category;
  score: number;
  matchedTerms: string[];
}
