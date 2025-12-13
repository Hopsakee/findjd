import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileImport } from '@/components/FileImport';
import { SystemSelector } from '@/components/SystemSelector';
import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { useJohnnyDecimal } from '@/hooks/useJohnnyDecimal';
import { searchSystem } from '@/lib/bm25';

const Index = () => {
  const [query, setQuery] = useState('');
  const {
    systems,
    activeSystem,
    activeSystemIndex,
    setActiveSystemIndex,
    loadSystem,
    updateArea,
    updateCategory,
    exportSystem
  } = useJohnnyDecimal();

  const results = useMemo(() => {
    if (!activeSystem || !query.trim()) return [];
    return searchSystem(activeSystem, query);
  }, [activeSystem, query]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Johnny Decimal Finder</h1>
          <p className="text-muted-foreground text-sm">Find where to file things fast</p>
        </header>

        {systems.length === 0 ? (
          <FileImport onImport={loadSystem} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <SystemSelector
                systems={systems}
                activeIndex={activeSystemIndex}
                onSelect={setActiveSystemIndex}
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    Add system
                    <input
                      type="file"
                      accept=".json"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          file.text().then(text => {
                            const data = JSON.parse(text);
                            loadSystem(data);
                          });
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </Button>
                <Button variant="outline" size="sm" onClick={exportSystem}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            <SearchInput value={query} onChange={setQuery} />

            {query.trim() && results.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No matches found. Try different terms or add tags to your categories.
              </p>
            )}

            <SearchResults
              results={results}
              onUpdateArea={updateArea}
              onUpdateCategory={updateCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
