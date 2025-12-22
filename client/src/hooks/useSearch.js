import { useMemo } from 'react';

export const useSearch = (items, searchQuery, getSearchText) => {
    return useMemo(() => {
        if (!searchQuery) return items;
        
        const search = searchQuery.toLowerCase();
        return items.filter(item => {
            const searchText = getSearchText(item).toLowerCase();
            return searchText.includes(search);
        });
    }, [items, searchQuery, getSearchText]);
};

