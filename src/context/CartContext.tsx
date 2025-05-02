
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tool, CartItem } from '@/types/types';
import { useToast } from '@/components/ui/use-toast';

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (tool: Tool, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Загрузка корзины из localStorage при инициализации
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse stored cart:', error);
      }
    }
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Добавление товара в корзину
  const addToCart = (tool: Tool, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === tool.id);
      
      if (existingItem) {
        // Обновляем количество, если товар уже в корзине
        return prevItems.map(item => 
          item.id === tool.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Добавляем новый товар
        return [...prevItems, { ...tool, quantity }];
      }
    });
    
    toast({
      title: "Товар добавлен в корзину",
      description: `${tool.name} (${quantity} шт.)`,
    });
  };
  
  // Удаление товара из корзины
  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Товар удален из корзины",
    });
  };
  
  // Обновление количества товара
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
    
    toast({
      title: "Корзина очищена",
    });
  };
  
  // Рассчет общего количества товаров
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Рассчет общей стоимости
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
