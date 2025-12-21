import { useState } from 'react';
import { ChevronRight, Folder, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { TagInput } from '@/components/TagInput';
import { ItemList } from '@/components/ItemList';
import type { JohnnyDecimalSystem, Area, Category, Item } from '@/types/johnnyDecimal';

interface SystemTreeProps {
  system: JohnnyDecimalSystem;
  onUpdateArea: (areaId: string, updates: Partial<Pick<Area, 'description' | 'tags'>>) => void;
  onUpdateCategory: (areaId: string, categoryId: string, updates: Partial<Pick<Category, 'description' | 'tags'>>) => void;
  onAddItem: (areaId: string, categoryId: string, item: Item) => void;
  onUpdateItem: (areaId: string, categoryId: string, itemId: string, updates: Partial<Item>) => void;
  onRemoveItem: (areaId: string, categoryId: string, itemId: string) => void;
}

export function SystemTree({ system, onUpdateArea, onUpdateCategory, onAddItem, onUpdateItem, onRemoveItem }: SystemTreeProps) {
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleArea = (areaId: string) => {
    setExpandedAreas(prev => {
      const next = new Set(prev);
      if (next.has(areaId)) {
        next.delete(areaId);
      } else {
        next.add(areaId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-1">
      {system.areas.map(area => {
        const isExpanded = expandedAreas.has(area.id);
        const isEditing = editingId === `area-${area.id}`;

        return (
          <div key={area.id} className="border rounded-lg overflow-hidden bg-card">
            <button
              onClick={() => toggleArea(area.id)}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
            >
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              <Folder className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-muted-foreground">{area.id}</span>
              <span className="font-medium text-sm">{area.name}</span>
            </button>

            {isExpanded && (
              <div className="border-t">
                {/* Area edit section */}
                <div className="px-4 py-2 bg-muted/20 border-b">
                  <button
                    onClick={() => setEditingId(isEditing ? null : `area-${area.id}`)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {isEditing ? 'Close' : 'Edit area'}
                  </button>
                  {isEditing && (
                    <div className="mt-2 space-y-2">
                      <Textarea
                        value={area.description}
                        onChange={e => onUpdateArea(area.id, { description: e.target.value })}
                        placeholder="Area description..."
                        className="min-h-[50px] text-sm"
                      />
                      <TagInput
                        tags={area.tags}
                        onChange={tags => onUpdateArea(area.id, { tags })}
                      />
                    </div>
                  )}
                </div>

                {/* Categories */}
                {area.categories.map(category => {
                  const isCatEditing = editingId === `cat-${area.id}-${category.id}`;

                  return (
                    <div key={category.id} className="border-b last:border-b-0">
                      <button
                        onClick={() => setEditingId(isCatEditing ? null : `cat-${area.id}-${category.id}`)}
                        className="w-full px-4 py-2 pl-12 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-xs text-muted-foreground">{category.id}</span>
                        <span className="text-sm">{category.name}</span>
                      </button>

                      {isCatEditing && (
                        <div className="px-4 py-2 pl-12 bg-muted/30 space-y-2">
                          <Textarea
                            value={category.description}
                            onChange={e => onUpdateCategory(area.id, category.id, { description: e.target.value })}
                            placeholder="Category description..."
                            className="min-h-[50px] text-sm"
                          />
                          <TagInput
                            tags={category.tags}
                            onChange={tags => onUpdateCategory(area.id, category.id, { tags })}
                          />
                          <div className="pt-2 border-t">
                            <ItemList
                              items={category.items || []}
                              categoryId={category.id}
                              onAdd={item => onAddItem(area.id, category.id, item)}
                              onUpdate={(itemId, updates) => onUpdateItem(area.id, category.id, itemId, updates)}
                              onRemove={itemId => onRemoveItem(area.id, category.id, itemId)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
