import { useState, useCallback } from 'react';
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

// Extract prefix from system name (e.g., "d1-Prive" → "d1")
function extractSystemPrefix(systemName: string): string {
  const match = systemName.match(/^([a-zA-Z]\d+)/);
  return match ? match[1] : '';
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

  // Handle keydown in category description - parse "Name [XX]" to add items
  const handleCategoryDescriptionKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    areaId: string,
    category: Category
  ) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setEditingId(null);
      return;
    }

    if (e.key === 'Enter') {
      const textarea = e.currentTarget;
      const value = textarea.value;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPos);

      // Get the current line (text from last newline to cursor)
      const lastNewline = textBeforeCursor.lastIndexOf('\n');
      const currentLine = textBeforeCursor.substring(lastNewline + 1);
      const itemMatch = currentLine.match(/^(.+?)\s*\[(\d+)\]$/);

      if (itemMatch) {
        e.preventDefault();
        const itemName = itemMatch[1].trim();
        const itemNumber = itemMatch[2].padStart(2, '0');
        const prefix = extractSystemPrefix(system.name);
        const fullId = prefix
          ? `${prefix}.${category.id}.${itemNumber}`
          : `${category.id}.${itemNumber}`;

        onAddItem(areaId, category.id, { id: fullId, name: itemName });

        // Remove the line from description
        const newValue = value.substring(0, lastNewline + 1) + value.substring(cursorPos);
        onUpdateCategory(areaId, category.id, { description: newValue.replace(/\s+$/g, '') });
      }
    }
  }, [system.name, onAddItem, onUpdateCategory]);

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
                        onKeyDown={e => {
                          if (e.key === 'Escape') {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingId(null);
                          }
                        }}
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
                            onKeyDown={e => handleCategoryDescriptionKeyDown(e, area.id, category)}
                            placeholder="Category description... (type 'Name [XX]' + Enter to add item)"
                            className="min-h-[50px] text-sm"
                          />
                          <TagInput
                            tags={category.tags}
                            onChange={tags => onUpdateCategory(area.id, category.id, { tags })}
                          />
                          <div className="pt-2 border-t" data-item-list-active="true">
                            <ItemList
                              items={category.items || []}
                              categoryId={category.id}
                              systemPrefix={extractSystemPrefix(system.name)}
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
