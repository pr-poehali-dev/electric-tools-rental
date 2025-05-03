
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Calendar, 
  Truck, 
  Shield, 
  ArrowLeft,
  Phone,
  Loader2
} from 'lucide-react';
import { toolsApi } from '@/lib/api';
import { Tool } from '@/types/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ToolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  
  const [tool, setTool] = useState<Tool | null>(null);
  const [similarTools, setSimilarTools] = useState<Tool[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Загрузка инструмента и похожих инструментов
  useEffect(() => {
    const fetchToolAndSimilar = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Загружаем текущий инструмент
        const toolId = parseInt(id);
        const toolData = await toolsApi.getById(toolId);
        
        if (!toolData) {
          setError('Инструмент не найден');
          return;
        }
        
        setTool(toolData);
        
        // Проверяем, добавлен ли товар в корзину
        setIsAdded(isInCart(toolId));
        
        // Загружаем все инструменты для поиска похожих
        const allTools = await toolsApi.getAll();
        
        // Фильтруем похожие инструменты (той же категории)
        const similar = allTools
          .filter(t => t.id !== toolId && t.category === toolData.category)
          .slice(0, 3); // Максимум 3 похожих инструмента
        
        setSimilarTools(similar);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить информацию об инструменте';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchToolAndSimilar();
  }, [id, isInCart]);
  
  // Изменение количества товара
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };
  
  // Добавление в корзину
  const handleAddToCart = () => {
    if (!tool) return;
    
    addToCart({
      ...tool,
      quantity
    });
    
    setIsAdded(true);
  };
  
  // Если данные загружаются, показываем спиннер
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Загрузка информации об инструменте...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Если произошла ошибка, показываем сообщение
  if (error || !tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <Alert variant="destructive">
              <AlertDescription>{error || 'Инструмент не найден'}</AlertDescription>
            </Alert>
            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/catalog')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Вернуться в каталог
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Хлебные крошки */}
          <div className="text-sm mb-6">
            <Link to="/" className="text-gray-500 hover:text-primary">Главная</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/catalog" className="text-gray-500 hover:text-primary">Каталог</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{tool.name}</span>
          </div>
          
          {/* Основная информация о товаре */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="md:flex">
              {/* Изображение товара */}
              <div className="md:w-1/2">
                <div className="h-64 md:h-full overflow-hidden">
                  <img 
                    src={tool.image} 
                    alt={tool.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Информация о товаре */}
              <div className="md:w-1/2 p-6">
                <div className="mb-2">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {tool.category}
                  </span>
                  {!tool.available && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded ml-2">
                      Нет в наличии
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold mb-4">{tool.name}</h1>
                
                <div className="text-3xl font-bold mb-4 text-primary">
                  {tool.price} ₽<span className="text-base font-normal text-gray-500">/день</span>
                </div>
                
                <p className="text-gray-700 mb-6">{tool.description}</p>
                
                {/* Управление корзиной */}
                {tool.available && (
                  <div className="space-y-4 mb-8">
                    {/* Счетчик количества */}
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-4">Количество:</span>
                      <div className="flex items-center">
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center">{quantity}</span>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= 10}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleAddToCart}
                      disabled={isAdded}
                    >
                      {isAdded ? (
                        <>Добавлено</>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Добавить в корзину
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                {/* Преимущества */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <span className="font-medium">Гибкие сроки аренды</span>
                      <p className="text-gray-500">От нескольких часов до нескольких месяцев</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <span className="font-medium">Доставка в день заказа</span>
                      <p className="text-gray-500">При заказе до 12:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <span className="font-medium">Техническая поддержка</span>
                      <p className="text-gray-500">Оперативная помощь в случае неисправности</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Дополнительная информация */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <Tabs defaultValue="specifications">
              <TabsList className="w-full justify-start p-0 bg-gray-100">
                <TabsTrigger value="specifications" className="px-6 py-3 data-[state=active]:bg-white rounded-none">
                  Характеристики
                </TabsTrigger>
                <TabsTrigger value="rental" className="px-6 py-3 data-[state=active]:bg-white rounded-none">
                  Условия аренды
                </TabsTrigger>
                <TabsTrigger value="delivery" className="px-6 py-3 data-[state=active]:bg-white rounded-none">
                  Доставка
                </TabsTrigger>
              </TabsList>
              <div className="p-6">
                <TabsContent value="specifications">
                  <h3 className="text-lg font-medium mb-4">Технические характеристики</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Производитель</span>
                      <span className="font-medium">{tool.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Модель</span>
                      <span className="font-medium">{tool.name.split(' ').slice(1).join(' ')}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Вес</span>
                      <span className="font-medium">2.5 кг</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Мощность</span>
                      <span className="font-medium">800 Вт</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Комплектация</span>
                      <span className="font-medium">Стандартная</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Требования к питанию</span>
                      <span className="font-medium">220В</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="rental">
                  <h3 className="text-lg font-medium mb-4">Условия аренды инструмента</h3>
                  <ul className="space-y-3 list-disc list-inside text-gray-700">
                    <li>Минимальный срок аренды: 1 день (24 часа)</li>
                    <li>Для оформления потребуется предоставить документ, удостоверяющий личность</li>
                    <li>Залог: от 3000 до 15000 ₽ (зависит от стоимости инструмента)</li>
                    <li>Скидки при аренде от 3 дней: 10%</li>
                    <li>Скидки при аренде от 7 дней: 15%</li>
                    <li>Скидки при аренде от 14 дней: 20%</li>
                    <li>Инструмент предоставляется в исправном состоянии</li>
                    <li>Клиент несет ответственность за сохранность инструмента</li>
                  </ul>
                </TabsContent>
                <TabsContent value="delivery">
                  <h3 className="text-lg font-medium mb-4">Информация о доставке</h3>
                  <ul className="space-y-3 list-disc list-inside text-gray-700">
                    <li>Доставка по городу: от 300 ₽</li>
                    <li>Доставка за пределы города: от 500 ₽ (зависит от расстояния)</li>
                    <li>Самовывоз из пункта выдачи: бесплатно</li>
                    <li>Доставка в день заказа при оформлении до 12:00</li>
                    <li>Возможен выезд специалиста для обучения работе с инструментом (от 1000 ₽)</li>
                  </ul>
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Адрес пункта выдачи:</h4>
                    <p className="text-gray-700">г. Москва, ул. Строителей, д. 10</p>
                    <p className="text-gray-700">Часы работы: пн-пт 9:00-18:00, сб 10:00-15:00</p>
                  </div>
                  <div className="mt-6">
                    <Button className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Связаться с нами
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Похожие инструменты */}
          {similarTools.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Похожие инструменты</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarTools.map(similarTool => (
                  <Link key={similarTool.id} to={`/tool/${similarTool.id}`}>
                    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={similarTool.image} 
                          alt={similarTool.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{similarTool.name}</h3>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-gray-500">{similarTool.category}</span>
                          <span className="font-bold">{similarTool.price} ₽/день</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ToolDetail;
