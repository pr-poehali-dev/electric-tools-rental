
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types/types';

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (id: number) => boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Загрузка корзины из localStorage при инициализации
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse stored cart:', e);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Добавление товара в корзину
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Проверяем, есть ли уже такой товар в корзине
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Если товар уже в корзине, обновляем количество
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      } else {
        // Если товара нет в корзине, добавляем его
        return [...prevItems, item];
      }
    });
  };
  
  // Удаление товара из корзины
  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Обновление количества товара
  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Общее количество товаров в корзине
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Общая стоимость товаров в корзине
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Проверка наличия товара в корзине
  const isInCart = (id: number) => cartItems.some(item => item.id === id);
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart
      }}
    >
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
