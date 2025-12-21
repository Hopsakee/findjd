import { useState, useRef, useEffect } from 'react';
import { Plus, X, Pencil, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Item } from '@/types/johnnyDecimal';

interface ItemListProps {
  items: Item[];
  categoryId: string;
  systemPrefix?: string; // e.g., "d1" from system name
  onAdd: (item: Item) => void;
  onUpdate: (itemId: string, updates: Partial<Item>) => void;
  onRemove: (itemId: string) => void;
}

// Parse "Name [XX]" format and return { name, number } or null
function parseQuickAdd(input: string): { name: string; number: string } | null {
  const match = input.trim().match(/^(.+?)\s*\[(\d+)\]$/);
  if (match) {
    return { name: match[1].trim(), number: match[2] };
  }
  return null;
}

export function ItemList({ items, categoryId, systemPrefix, onAdd, onUpdate, onRemove }: ItemListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [quickAddValue, setQuickAddValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const quickAddRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort items by ID numerically
  const sortedItems = [...items].sort((a, b) => {
    const aNum = parseInt(a.id.split('.').pop() || '0');
    const bNum = parseInt(b.id.split('.').pop() || '0');
    return aNum - bNum;
  });

  // Keyboard shortcut: 'n' or 'a' to focus quick add when container has focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if no input is focused
      const activeEl = document.activeElement;
      const isInputFocused = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
      
      if (!isInputFocused && (e.key === 'n' || e.key === 'a')) {
        // Check if this ItemList container or its parent is in view/focused context
        if (containerRef.current?.closest('[data-item-list-active="true"]')) {
          e.preventDefault();
          quickAddRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdd = () => {
    if (newId.trim() && newName.trim()) {
      onAdd({ id: newId.trim(), name: newName.trim() });
      setNewId('');
      setNewName('');
      setIsAdding(false);
    }
  };

  const handleQuickAdd = () => {
    const parsed = parseQuickAdd(quickAddValue);
    if (parsed) {
      // Build full ID: systemPrefix.categoryId.number (e.g., d1.22.03)
      const paddedNumber = parsed.number.padStart(2, '0');
      const fullId = systemPrefix 
        ? `${systemPrefix}.${categoryId}.${paddedNumber}`
        : `${categoryId}.${paddedNumber}`;
      
      onAdd({ id: fullId, name: parsed.name });
      setQuickAddValue('');
    }
  };

  const handleQuickAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuickAdd();
    } else if (e.key === 'Escape') {
      setQuickAddValue('');
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewId('');
      setNewName('');
    }
  };

  const handleStartEdit = (item: Item) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdate(editingId, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditName('');
    }
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          Items
        </label>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
      </div>

      {/* Quick add input - always visible */}
      <div className="flex items-center gap-2">
        <Input
          ref={quickAddRef}
          value={quickAddValue}
          onChange={e => setQuickAddValue(e.target.value)}
          onKeyDown={handleQuickAddKeyDown}
          placeholder={`Item name [${String(sortedItems.length + 1).padStart(2, '0')}]`}
          className="flex-1 h-7 text-xs"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleQuickAdd}
          className="h-7 w-7 p-0"
          disabled={!parseQuickAdd(quickAddValue)}
        >
          <Check className="h-3 w-3" />
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Format: Name [XX] → creates {systemPrefix ? `${systemPrefix}.` : ''}{categoryId}.XX
      </p>

      {/* Add new item form (manual) */}
      {isAdding && (
        <div className="flex items-center gap-2">
          <Input
            value={newId}
            onChange={e => setNewId(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`${categoryId}.XX`}
            className="w-24 h-7 text-xs font-mono"
            autoFocus
          />
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Name"
            className="flex-1 h-7 text-xs"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAdd}
            className="h-7 w-7 p-0"
            disabled={!newId.trim() || !newName.trim()}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAdding(false);
              setNewId('');
              setNewName('');
            }}
            className="h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Items list */}
      {sortedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sortedItems.map(item => (
            <div
              key={item.id}
              className="group inline-flex items-center gap-1.5 bg-muted/50 border rounded px-2 py-1 text-xs"
            >
              {editingId === item.id ? (
                <>
                  <Input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    onBlur={handleSaveEdit}
                    className="h-5 w-24 text-xs px-1"
                    autoFocus
                  />
                  <span className="font-mono text-muted-foreground">({item.id})</span>
                </>
              ) : (
                <>
                  <span className="font-medium">{item.name}</span>
                  <span className="font-mono text-muted-foreground">({item.id})</span>
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="opacity-0 group-hover:opacity-100 hover:text-foreground text-muted-foreground transition-opacity"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-destructive text-muted-foreground transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {sortedItems.length === 0 && !isAdding && (
        <p className="text-xs text-muted-foreground italic">No items yet</p>
      )}
    </div>
  );
}
