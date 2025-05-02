
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ToolCard from '@/components/ToolCard';
import { mockTools, toolCategories } from '@/data/mockTools';
import { Button } from '@/components/ui/button';
import { ArrowRight, Settings, Shield, Clock, Truck } from 'lucide-react';

const Index = () => {
  // Получаем только доступные инструменты для главной страницы
  const availableTools = mockTools.filter(tool => tool.available).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Популярные инструменты */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Популярные инструменты</h2>
              <Link to="/catalog">
                <Button variant="ghost" className="flex items-center">
                  Весь каталог <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Категории */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Категории инструментов</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {toolCategories.slice(0, 10).map((category, index) => (
                <Link 
                  to={`/catalog?category=${encodeURIComponent(category)}`} 
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition hover:border-primary"
                >
                  <div className="text-lg font-medium">{category}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Преимущества */}
        <section className="py-12 bg-primary text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Почему выбирают нас</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Settings className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">Профессиональное оборудование</h3>
                <p>Только качественные инструменты от проверенных производителей</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">Гарантия исправности</h3>
                <p>Регулярное обслуживание и проверка каждого инструмента</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Clock className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">Гибкие сроки аренды</h3>
                <p>От нескольких часов до нескольких месяцев</p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Truck className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">Доставка</h3>
                <p>Привезем и заберем инструмент в удобное для вас время</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA блок */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Готовы начать работу?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Выберите нужный инструмент из нашего каталога или свяжитесь с нами для консультации
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/catalog">
                <Button size="lg">Перейти в каталог</Button>
              </Link>
              <Link to="/contacts">
                <Button variant="outline" size="lg">Связаться с нами</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
