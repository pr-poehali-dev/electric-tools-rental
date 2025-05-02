
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType } from '@/types/types';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (amount: number) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b">
      <div className="sm:w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <Link to={`/tool/${item.id}`} className="text-lg font-medium hover:text-primary transition">
          {item.name}
        </Link>
        <div className="text-sm text-gray-500 mb-2">{item.category}</div>
        <div className="font-semibold mb-2">{item.price} ₽/день</div>
        
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-r-none"
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div className="h-8 px-3 flex items-center justify-center border-y">
              {item.quantity}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-l-none"
              onClick={() => handleQuantityChange(1)}
              disabled={item.quantity >= 10}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="font-semibold">
            {item.price * item.quantity} ₽
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-red-500"
            onClick={() => removeFromCart(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
