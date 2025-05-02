
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, FilterX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toolCategories } from '@/data/mockTools';

interface FiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
}

export interface FilterOptions {
  search: string;
  categories: string[];
  priceRange: [number, number];
  onlyAvailable: boolean;
}

const Filters = ({ onFilterChange, maxPrice }: FiltersProps) => {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    onFilterChange({
      search,
      categories,
      priceRange,
      onlyAvailable,
    });
  }, [search, categories, priceRange, onlyAvailable]);

  const handleCategoryChange = (category: string) => {
    setCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1] || maxPrice]);
  };

  const resetFilters = () => {
    setSearch('');
    setCategories([]);
    setPriceRange([0, maxPrice]);
    setOnlyAvailable(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Поиск инструментов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Категории</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {toolCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={categories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Цена в день</h3>
        <div className="px-2">
          <Slider
            value={[priceRange[0], priceRange[1]]}
            min={0}
            max={maxPrice}
            step={50}
            onValueChange={handlePriceChange}
            className="mb-6"
          />
          <div className="flex justify-between text-sm">
            <span>{priceRange[0]} ₽</span>
            <span>{priceRange[1]} ₽</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="available"
            checked={onlyAvailable}
            onCheckedChange={() => setOnlyAvailable(!onlyAvailable)}
          />
          <Label htmlFor="available" className="cursor-pointer">
            Только в наличии
          </Label>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={resetFilters}
      >
        <FilterX className="h-4 w-4" />
        Сбросить фильтры
      </Button>
    </div>
  );
};

export default Filters;
