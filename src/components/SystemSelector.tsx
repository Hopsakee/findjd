import type { JohnnyDecimalSystem } from '@/types/johnnyDecimal';

interface SystemSelectorProps {
  systems: JohnnyDecimalSystem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function SystemSelector({ systems, activeIndex, onSelect }: SystemSelectorProps) {
  if (systems.length <= 1) return null;

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {systems.map((system, idx) => (
        <button
          key={system.name}
          onClick={() => onSelect(idx)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            idx === activeIndex
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {system.name}
        </button>
      ))}
    </div>
  );
}
