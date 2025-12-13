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

  const normalizeSystem = (data: any): JohnnyDecimalSystem => {
    return {
      name: data.name || 'Unnamed',
      areas: (data.areas || []).map((area: any) => ({
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
  };

  const processFile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Handle domains wrapper format
      if (Array.isArray(data.domains)) {
        data.domains.forEach((domain: any) => {
          const system = normalizeSystem(domain);
          onImport(system);
        });
        toast({
          title: 'Systems loaded',
          description: `Loaded ${data.domains.length} systems`
        });
        return;
      }

      // Handle direct system format
      if (data.name && Array.isArray(data.areas)) {
        const system = normalizeSystem(data);
        onImport(system);
        toast({
          title: 'System loaded',
          description: `"${system.name}" with ${system.areas.length} areas`
        });
        return;
      }

      throw new Error('Invalid format');
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
