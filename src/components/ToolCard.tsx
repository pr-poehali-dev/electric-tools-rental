
import { Link } from 'react-router-dom';
import { Tool } from '@/types/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(tool, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/tool/${tool.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={tool.image} 
            alt={tool.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {!tool.available && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Нет в наличии
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/tool/${tool.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-primary transition">{tool.name}</h3>
        </Link>
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-500">{tool.category}</span>
          <span className="font-bold text-lg">{tool.price} ₽/день</span>
        </div>
        
        <div className="flex justify-between items-center">
          <Link to={`/tool/${tool.id}`}>
            <Button variant="outline" size="sm">Подробнее</Button>
          </Link>
          
          <Button 
            onClick={handleAddToCart} 
            disabled={!tool.available || isAdded}
            variant="default" 
            size="sm" 
            className="flex items-center gap-1"
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4" />
                <span>Добавлено</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>В корзину</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
