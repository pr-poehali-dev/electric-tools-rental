
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import Filters, { FilterOptions } from '@/components/Filters';
import { mockTools } from '@/data/mockTools';
import { Tool } from '@/types/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: '',
    categories: [],
    priceRange: [0, 2000],
    onlyAvailable: false,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState('default');
  
  // Найдем максимальную цену инструмента для слайдера
  const maxPrice = useMemo(() => {
    return Math.max(...mockTools.map(tool => tool.price));
  }, []);

  // Инициализация фильтров из URL параметров
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilterOptions(prev => ({
        ...prev,
        categories: [categoryParam],
      }));
    }
  }, []);

  // Фильтрация инструментов
  const filteredTools = useMemo(() => {
    return mockTools.filter(tool => {
      // Поиск по имени и описанию
      const searchMatch = 
        tool.name.toLowerCase().includes(filterOptions.search.toLowerCase()) ||
        tool.description.toLowerCase().includes(filterOptions.search.toLowerCase());
      
      // Фильтр по категориям
      const categoryMatch = 
        filterOptions.categories.length === 0 || 
        filterOptions.categories.includes(tool.category);
      
      // Фильтр по цене
      const priceMatch = 
        tool.price >= filterOptions.priceRange[0] && 
        tool.price <= filterOptions.priceRange[1];
      
      // Фильтр по наличию
      const availabilityMatch = 
        !filterOptions.onlyAvailable || tool.available;
      
      return searchMatch && categoryMatch && priceMatch && availabilityMatch;
    });
  }, [filterOptions, mockTools]);

  // Сортировка инструментов
  const sortedTools = useMemo(() => {
    switch (sortOption) {
      case 'price-asc':
        return [...filteredTools].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filteredTools].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...filteredTools].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...filteredTools].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filteredTools;
    }
  }, [sortOption, filteredTools]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
    
    // Обновим URL параметры при изменении категории
    if (newFilters.categories.length > 0) {
      setSearchParams({ category: newFilters.categories[0] });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Каталог инструментов</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Сайдбар с фильтрами */}
            <div className="w-full md:w-1/4">
              <Filters onFilterChange={handleFilterChange} maxPrice={maxPrice} />
            </div>
            
            {/* Основной контент */}
            <div className="w-full md:w-3/4">
              <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-gray-500">
                  Найдено инструментов: <span className="font-semibold">{sortedTools.length}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                  <Select
                    value={sortOption}
                    onValueChange={setSortOption}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Сортировать по" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">По умолчанию</SelectItem>
                      <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                      <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                      <SelectItem value="name-asc">Название: А-Я</SelectItem>
                      <SelectItem value="name-desc">Название: Я-А</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className="h-9 w-9"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className="h-9 w-9"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {sortedTools.length > 0 ? (
                <div className={viewMode === 'grid' ? 
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : 
                  "space-y-4"
                }>
                  {sortedTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <h2 className="text-xl font-semibold mb-2">Ничего не найдено</h2>
                  <p className="text-gray-500">
                    Попробуйте изменить параметры поиска или фильтрации
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Catalog;
