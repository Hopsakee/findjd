import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Folder, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { TagInput } from '@/components/TagInput';
import type { SearchResult, Area, Category } from '@/types/johnnyDecimal';

interface SearchResultsProps {
  results: SearchResult[];
  focusIndex: number;
  onFocusChange: (index: number) => void;
  onUpdateArea: (areaId: string, updates: Partial<Pick<Area, 'description' | 'tags'>>) => void;
  onUpdateCategory: (areaId: string, categoryId: string, updates: Partial<Pick<Category, 'description' | 'tags'>>) => void;
}

function HighlightText({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  
  // Escape special regex characters and match substrings
  const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        terms.some(t => part.toLowerCase().includes(t.toLowerCase())) 
          ? <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{part}</mark>
          : part
      )}
    </>
  );
}

export function SearchResults({ results, focusIndex, onFocusChange, onUpdateArea, onUpdateCategory }: SearchResultsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusIndex >= 0 && itemRefs.current[focusIndex]) {
      itemRefs.current[focusIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      onFocusChange(Math.min(focusIndex + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onFocusChange(Math.max(focusIndex - 1, 0));
    } else if (e.key === 'Enter' && focusIndex >= 0) {
      e.preventDefault();
      const result = results[focusIndex];
      const id = result.type === 'area' 
        ? `area-${result.area.id}` 
        : `cat-${result.area.id}-${result.category!.id}`;
      setExpandedId(expandedId === id ? null : id);
    }
  }, [focusIndex, results, onFocusChange, expandedId]);

  if (results.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="space-y-2 outline-none" 
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {results.map((result, idx) => {
        const id = result.type === 'area' 
          ? `area-${result.area.id}` 
          : `cat-${result.area.id}-${result.category!.id}`;
        const isExpanded = expandedId === id;
        const isFocused = focusIndex === idx;

        return (
          <div
            key={id}
            className={`border rounded-lg overflow-hidden bg-card transition-colors ${isFocused ? 'ring-2 ring-primary' : ''}`}
          >
            <button
              ref={el => itemRefs.current[idx] = el}
              onClick={() => setExpandedId(isExpanded ? null : id)}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
            >
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              
              {result.type === 'area' ? (
                <Folder className="h-4 w-4 text-primary" />
              ) : (
                <FileText className="h-4 w-4 text-muted-foreground" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-muted-foreground">
                    {result.type === 'area' ? result.area.id : `${result.area.id} › ${result.category!.id}`}
                  </span>
                  <span className="font-medium truncate">
                    <HighlightText 
                      text={result.type === 'area' ? result.area.name : result.category!.name} 
                      terms={result.matchedTerms} 
                    />
                  </span>
                </div>
                {result.type === 'category' && (
                  <div className="text-xs text-muted-foreground truncate">
                    {result.area.name}
                  </div>
                )}
              </div>

              <span className="text-xs text-muted-foreground">
                {result.score.toFixed(2)}
              </span>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t bg-muted/30 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Description
                  </label>
                  <Textarea
                    value={result.type === 'area' ? result.area.description : result.category!.description}
                    onChange={e => {
                      if (result.type === 'area') {
                        onUpdateArea(result.area.id, { description: e.target.value });
                      } else {
                        onUpdateCategory(result.area.id, result.category!.id, { description: e.target.value });
                      }
                    }}
                    placeholder="Add a description..."
                    className="min-h-[60px] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Tags
                  </label>
                  <TagInput
                    tags={result.type === 'area' ? result.area.tags : result.category!.tags}
                    onChange={tags => {
                      if (result.type === 'area') {
                        onUpdateArea(result.area.id, { tags });
                      } else {
                        onUpdateCategory(result.area.id, result.category!.id, { tags });
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
