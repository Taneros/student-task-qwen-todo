// src/context/FilterContext.jsx
import React from 'react';

const FilterContext = React.createContext(null);

/**
 * FilterProvider component for filter state management
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = React.useState({
    search: '',
    status: 'all',
    dueDate: 'all',
    sortBy: 'created',
    sortOrder: 'desc'
  });

  const value = React.useMemo(() => ({
    filters,
    setFilters,
  }), [filters]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

/**
 * Custom hook to use FilterContext
 * @returns {{filters: Object, setFilters: Function}}
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useFilters = () => {
  const context = React.useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};