
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { servicesApi } from '@/lib/api';
import { BookingService } from '@/types/types';
import { Clock, Calendar, Search, Filter, Loader2 } from 'lucide-react';
import { serviceCategories } from '@/data/mockServices';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ServicesIndex = () => {
  const [services, setServices] = useState<BookingService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  
  // Загрузка услуг при монтировании компонента
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await servicesApi.getAll();
        setServices(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить услуги';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Фильтрация и сортировка услуг
  const filteredServices = services
    .filter(service => 
      (selectedCategory ? service.category === selectedCategory : true) &&
      (service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       service.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'duration_asc':
          return a.duration - b.duration;
        case 'duration_desc':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });
  
  // Форматирование продолжительности
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} мин.`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} ч.${remainingMinutes > 0 ? ` ${remainingMinutes} мин.` : ''}`;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl font-bold mb-3">Услуги и консультации</h1>
            <p className="text-gray-600">
              Выберите и забронируйте профессиональные услуги и консультации от наших экспертов
            </p>
          </div>
          
          {/* Фильтры и поиск */}
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Поиск */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Поиск услуг..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Категория */}
                <div>
                  <Select value={selectedCategory || ''} onValueChange={(value) => setSelectedCategory(value || null)}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-500" />
                        <SelectValue placeholder="Все категории" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все категории</SelectItem>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Сортировка */}
                <div>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">По умолчанию</SelectItem>
                      <SelectItem value="price_asc">Цена (по возрастанию)</SelectItem>
                      <SelectItem value="price_desc">Цена (по убыванию)</SelectItem>
                      <SelectItem value="duration_asc">Длительность (по возрастанию)</SelectItem>
                      <SelectItem value="duration_desc">Длительность (по убыванию)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Отображение ошибки */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Список услуг */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Загрузка услуг...</span>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold">
                      {service.category}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Продолжительность: {formatDuration(service.duration)}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-lg font-bold text-primary">{service.price} ₽</div>
                    <Button 
                      variant="default"
                      className="flex items-center gap-2"
                      asChild
                    >
                      <Link to={`/services/${service.id}`}>
                        <Calendar className="h-4 w-4" />
                        Забронировать
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Search className="h-10 w-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Услуги не найдены</h3>
              <p className="text-gray-500 mb-6">Попробуйте изменить параметры поиска или фильтрации</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setSortOption('default');
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServicesIndex;
