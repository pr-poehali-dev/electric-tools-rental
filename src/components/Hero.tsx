
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-gray-900 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=1600&auto=format&fit=crop')"
        }}
      />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Профессиональные инструменты в аренду</h1>
          <p className="text-lg md:text-xl mb-8">
            Не тратьте деньги на покупку дорогостоящего оборудования. Возьмите электроинструмент в аренду для вашего проекта.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/catalog">
              <Button size="lg" className="font-semibold">
                Каталог инструментов
              </Button>
            </Link>
            <Link to="/contacts">
              <Button variant="outline" size="lg" className="font-semibold text-white border-white hover:bg-white hover:text-gray-900">
                Связаться с нами
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
