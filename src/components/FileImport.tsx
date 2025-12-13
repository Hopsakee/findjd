import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { JohnnyDecimalSystem } from '@/types/johnnyDecimal';

interface FileImportProps {
  onImport: (system: JohnnyDecimalSystem) => void;
}

export function FileImport({ onImport }: FileImportProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateSystem = (data: unknown): data is JohnnyDecimalSystem => {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    if (typeof obj.name !== 'string') return false;
    if (!Array.isArray(obj.areas)) return false;
    return true;
  };

  const processFile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!validateSystem(data)) {
        throw new Error('Invalid JSON format');
      }

      // Ensure all fields have defaults
      const system: JohnnyDecimalSystem = {
        name: data.name,
        areas: data.areas.map((area: any) => ({
          id: area.id || '',
          name: area.name || '',
          description: area.description || '',
          tags: area.tags || [],
          categories: (area.categories || []).map((cat: any) => ({
            id: cat.id || '',
            name: cat.name || '',
            description: cat.description || '',
            tags: cat.tags || []
          }))
        }))
      };

      onImport(system);
      toast({
        title: 'System loaded',
        description: `"${system.name}" with ${system.areas.length} areas`
      });
    } catch (error) {
      toast({
        title: 'Import failed',
        description: 'Invalid JSON file format',
        variant: 'destructive'
      });
    }
  }, [onImport, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/json' || file?.name.endsWith('.json')) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}
    >
      <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-3">
        Drop a JSON file here or
      </p>
      <Button variant="outline" size="sm" asChild>
        <label className="cursor-pointer">
          Browse files
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </Button>
    </div>
  );
}
