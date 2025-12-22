import { useState, useCallback, useEffect } from 'react';
import type { JohnnyDecimalSystem, Area, Category, Item } from '@/types/johnnyDecimal';

const STORAGE_KEY = 'johnny-decimal-systems';
const ACTIVE_INDEX_KEY = 'johnny-decimal-active-index';

function loadFromStorage(): { systems: JohnnyDecimalSystem[]; activeIndex: number } {
  try {
    const systemsData = localStorage.getItem(STORAGE_KEY);
    const activeIndexData = localStorage.getItem(ACTIVE_INDEX_KEY);
    return {
      systems: systemsData ? JSON.parse(systemsData) : [],
      activeIndex: activeIndexData ? parseInt(activeIndexData, 10) : 0
    };
  } catch {
    return { systems: [], activeIndex: 0 };
  }
}

export function useJohnnyDecimal() {
  const [systems, setSystems] = useState<JohnnyDecimalSystem[]>(() => loadFromStorage().systems);
  const [activeSystemIndex, setActiveSystemIndex] = useState(() => loadFromStorage().activeIndex);

  const activeSystem = systems[activeSystemIndex] || null;

  // Persist systems to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
    } catch (e) {
      console.warn('Failed to save systems to localStorage:', e);
    }
  }, [systems]);

  // Persist active index to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_INDEX_KEY, String(activeSystemIndex));
    } catch (e) {
      console.warn('Failed to save active index to localStorage:', e);
    }
  }, [activeSystemIndex]);

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

  const updateCategory = useCallback((areaId: string, categoryId: string, updates: Partial<Pick<Category, 'description' | 'tags' | 'items'>>) => {
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

  const addItem = useCallback((areaId: string, categoryId: string, item: Item) => {
    setSystems(prev => prev.map((system, idx) => {
      if (idx !== activeSystemIndex) return system;
      return {
        ...system,
        areas: system.areas.map(area => {
          if (area.id !== areaId) return area;
          return {
            ...area,
            categories: area.categories.map(cat => {
              if (cat.id !== categoryId) return cat;
              const items = cat.items || [];
              return { ...cat, items: [...items, item] };
            })
          };
        })
      };
    }));
  }, [activeSystemIndex]);

  const updateItem = useCallback((areaId: string, categoryId: string, itemId: string, updates: Partial<Item>) => {
    setSystems(prev => prev.map((system, idx) => {
      if (idx !== activeSystemIndex) return system;
      return {
        ...system,
        areas: system.areas.map(area => {
          if (area.id !== areaId) return area;
          return {
            ...area,
            categories: area.categories.map(cat => {
              if (cat.id !== categoryId) return cat;
              return {
                ...cat,
                items: (cat.items || []).map(item =>
                  item.id === itemId ? { ...item, ...updates } : item
                )
              };
            })
          };
        })
      };
    }));
  }, [activeSystemIndex]);

  const removeItem = useCallback((areaId: string, categoryId: string, itemId: string) => {
    setSystems(prev => prev.map((system, idx) => {
      if (idx !== activeSystemIndex) return system;
      return {
        ...system,
        areas: system.areas.map(area => {
          if (area.id !== areaId) return area;
          return {
            ...area,
            categories: area.categories.map(cat => {
              if (cat.id !== categoryId) return cat;
              return {
                ...cat,
                items: (cat.items || []).filter(item => item.id !== itemId)
              };
            })
          };
        })
      };
    }));
  }, [activeSystemIndex]);

  const exportSystem = useCallback(() => {
    if (!activeSystem) return;
    const blob = new Blob([JSON.stringify(activeSystem, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeSystem.name}.json`;
      a.click();
    } finally {
      URL.revokeObjectURL(url);
    }
  }, [activeSystem]);

  const clearAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_INDEX_KEY);
    setSystems([]);
    setActiveSystemIndex(0);
  }, []);

  return {
    systems,
    activeSystem,
    activeSystemIndex,
    setActiveSystemIndex,
    loadSystem,
    updateArea,
    updateCategory,
    addItem,
    updateItem,
    removeItem,
    exportSystem,
    clearAllData
  };
}
