
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockTools } from '@/data/mockTools';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronLeft, Plus, Minus, Calendar, Truck, Shield, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';

const ToolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  // Находим инструмент по id
  const tool = mockTools.find(tool => tool.id === Number(id));
  
  // Если инструмент не найден, показываем сообщение
  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-2xl font-semibold mb-4">Инструмент не найден</h2>
            <p className="text-gray-500 mb-6">Возможно, он был удален или перемещен.</p>
            <Button onClick={() => navigate('/catalog')}>Вернуться в каталог</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(tool, quantity);
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };
  
  // Находим похожие инструменты (из той же категории)
  const similarTools = mockTools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Навигация */}
          <div className="mb-6">
            <Link 
              to="/catalog" 
              className="inline-flex items-center text-gray-600 hover:text-primary transition"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Вернуться в каталог
            </Link>
          </div>
          
          {/* Основная информация о товаре */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Изображение товара */}
              <div className="flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src={tool.image} 
                  alt={tool.name} 
                  className="max-h-[400px] object-contain"
                />
              </div>
              
              {/* Информация о товаре */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{tool.name}</h1>
                <div className="mb-4">
                  <span className="text-gray-500">Категория: </span>
                  <Link to={`/catalog?category=${encodeURIComponent(tool.category)}`} className="text-primary hover:underline">
                    {tool.category}
                  </Link>
                </div>
                
                <Separator className="my-4" />
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Описание</h3>
                  <p className="text-gray-700">{tool.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="text-2xl font-bold mb-2">{tool.price} ₽/день</div>
                  <div className={`text-sm font-medium mb-4 ${tool.available ? 'text-green-600' : 'text-red-500'}`}>
                    {tool.available ? 'В наличии' : 'Нет в наличии'}
                  </div>
                </div>
                
                {tool.available && (
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-16 text-center">{quantity}</div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
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
