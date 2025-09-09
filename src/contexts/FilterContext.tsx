import { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
  entity: string;
  exercise: string;
  startMonth: string;
  endMonth: string;
  function: string;
  publicEquipment: string;
  costElement: string;
  compareExercises: boolean;
  comparisonExercises: string[];
}

interface FilterContextType {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  entity: '',
  exercise: '2024',
  startMonth: '01',
  endMonth: '12',
  function: '',
  publicEquipment: '',
  costElement: '',
  compareExercises: false,
  comparisonExercises: []
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}