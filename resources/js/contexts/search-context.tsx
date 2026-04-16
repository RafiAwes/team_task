import { createContext, useContext, useState, ReactNode } from 'react';

interface Filters {
    priorities: string[];
    assignees: number[];
}

interface FilterContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filters: Filters;
    togglePriority: (priority: string) => void;
    toggleAssignee: (assigneeId: number) => void;
    clearFilters: () => void;
    isFiltered: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({
        priorities: [],
        assignees: [],
    });

    const togglePriority = (priority: string) => {
        setFilters(prev => ({
            ...prev,
            priorities: prev.priorities.includes(priority)
                ? prev.priorities.filter(p => p !== priority)
                : [...prev.priorities, priority],
        }));
    };

    const toggleAssignee = (id: number) => {
        setFilters(prev => ({
            ...prev,
            assignees: prev.assignees.includes(id)
                ? prev.assignees.filter(a => a !== id)
                : [...prev.assignees, id],
        }));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilters({ priorities: [], assignees: [] });
    };

    const isFiltered = searchQuery !== '' || filters.priorities.length > 0 || filters.assignees.length > 0;

    return (
        <FilterContext.Provider value={{ 
            searchQuery, 
            setSearchQuery, 
            filters, 
            togglePriority, 
            toggleAssignee, 
            clearFilters,
            isFiltered
        }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}
