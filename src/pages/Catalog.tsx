
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Filters from '@/components/Filters';
import ToolCard from '@/components/ToolCard';
import { Loader2 } from 'lucide-react';
import { Tool } from '@/types/types';
import { toolsApi } from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Catalog = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  const [availableOnly, setAvailableOnly] = useState(false);
  
  // Загрузка инструментов при монтировании компонента
  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await toolsApi.getAll();
        setTools(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить инструменты';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTools();
  }, []);
  
  // Функция фильтрации и сортировки инструментов
  const getFilteredTools = () => {
    let filtered = [...tools];
    
    // Фильтрация по категории
    if (selectedCategory) {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }
    
    // Фильтрация по доступности
    if (availableOnly) {
      filtered = filtered.filter(tool => tool.available);
    }
    
    // Сортировка
    switch (sortOption) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // По умолчанию оставляем как есть
        break;
    }
    
    return filtered;
  };
  
  // Получаем отфильтрованные и отсортированные инструменты
  const filteredTools = getFilteredTools();
  
  // Получаем уникальные категории
  const categories = [...new Set(tools.map(tool => tool.category))];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Каталог инструментов</h1>
          
          <div className="lg:flex gap-8">
            {/* Фильтры */}
            <aside className="lg:w-1/4">
              <Filters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortOption={sortOption}
                onSortChange={setSortOption}
                availableOnly={availableOnly}
                onAvailableChange={setAvailableOnly}
              />
            </aside>
            
            {/* Список инструментов */}
            <div className="lg:w-3/4 mt-6 lg:mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-gray-600">Загрузка инструментов...</span>
                </div>
              ) : error ? (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600">Инструменты не найдены</p>
                  <p className="text-gray-500 mt-2">Попробуйте изменить параметры фильтрации</p>
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
