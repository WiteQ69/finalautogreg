'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCarStore } from '@/store/car-store';

export function CarFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const { filterCriteria, setFilterCriteria } = useCarStore();

  const handleSearchChange = (value: string) => {
    setFilterCriteria({ ...filterCriteria, searchQuery: value });
  };

  const clearFilters = () => {
    setFilterCriteria({});
  };

  const hasActiveFilters = Object.keys(filterCriteria).length > 0;

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Szukaj samochodów..."
            value={filterCriteria.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtry</span>
          {hasActiveFilters && (
            <span className="bg-zinc-900 text-white text-xs px-2 py-1 rounded-full">
              {Object.keys(filterCriteria).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Wyczyść
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {isOpen && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-zinc-500">
              <p>Zaawansowane filtry będą dostępne wkrótce</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}