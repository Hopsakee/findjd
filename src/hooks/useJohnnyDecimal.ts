import { useState, useCallback } from 'react';
import type { JohnnyDecimalSystem, Area, Category } from '@/types/johnnyDecimal';

export function useJohnnyDecimal() {
  const [systems, setSystems] = useState<JohnnyDecimalSystem[]>([]);
  const [activeSystemIndex, setActiveSystemIndex] = useState(0);

  const activeSystem = systems[activeSystemIndex] || null;

  const loadSystem = useCallback((system: JohnnyDecimalSystem) => {
    setSystems(prev => {
      const existingIndex = prev.findIndex(s => s.name === system.name);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = system;
        return updated;
      }
      return [...prev, system];
    });
  }, []);

  const updateArea = useCallback((areaId: string, updates: Partial<Pick<Area, 'description' | 'tags'>>) => {
    setSystems(prev => prev.map((system, idx) => {
      if (idx !== activeSystemIndex) return system;
      return {
        ...system,
        areas: system.areas.map(area => 
          area.id === areaId ? { ...area, ...updates } : area
        )
      };
    }));
  }, [activeSystemIndex]);

  const updateCategory = useCallback((areaId: string, categoryId: string, updates: Partial<Pick<Category, 'description' | 'tags'>>) => {
    setSystems(prev => prev.map((system, idx) => {
      if (idx !== activeSystemIndex) return system;
      return {
        ...system,
        areas: system.areas.map(area => {
          if (area.id !== areaId) return area;
          return {
            ...area,
            categories: area.categories.map(cat =>
              cat.id === categoryId ? { ...cat, ...updates } : cat
            )
          };
        })
      };
    }));
  }, [activeSystemIndex]);

  const exportSystem = useCallback(() => {
    if (!activeSystem) return;
    const blob = new Blob([JSON.stringify(activeSystem, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSystem.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeSystem]);

  return {
    systems,
    activeSystem,
    activeSystemIndex,
    setActiveSystemIndex,
    loadSystem,
    updateArea,
    updateCategory,
    exportSystem
  };
}
