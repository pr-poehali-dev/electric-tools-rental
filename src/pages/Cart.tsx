
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronLeft, ChevronRight, Trash2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const Cart = () => {
  const { cartItems, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
    deliveryDate: '',
    rentDays: '1'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // В реальном приложении здесь была бы отправка заказа на сервер
    
    // Имитация успешного заказа
    setOrderPlaced(true);
    
    toast({
      title: "Заказ успешно оформлен!",
      description: "Мы свяжемся с вами в ближайшее время для подтверждения",
    });
    
    // Очистка корзины
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 3000);
  };
  
  // Расчет итоговой стоимости аренды
  const rentDays = parseInt(formData.rentDays) || 1;
  const subtotal = totalPrice * rentDays;
  const deliveryFee = 300; // Фиксированная стоимость доставки
  const total = subtotal + deliveryFee;
  
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Заказ успешно оформлен!</h2>
              <p className="text-gray-600 mb-6">
                Спасибо за ваш заказ. Наш менеджер свяжется с вами в ближайшее время 
                для подтверждения деталей заказа и уточнения времени доставки.
              </p>
              <Button onClick={() => navigate('/')}>
                Вернуться на главную
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
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Корзина</h1>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Товары в корзине */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-medium">Товары ({totalItems})</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-500 hover:text-red-500"
                      onClick={clearCart}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Очистить корзину
                    </Button>
                  </div>
                  
                  <div className="divide-y">
                    {cartItems.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Link to="/catalog">
                    <Button variant="outline" className="flex items-center">
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Продолжить покупки
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Форма оформления заказа */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-medium">Оформление заказа</h2>
                  </div>
                  
                  <form onSubmit={handlePlaceOrder} className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="name">ФИО</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Иванов Иван Иванович"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+7 (999) 123-45-67"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.ru"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Адрес доставки</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryDate">Дата доставки</Label>
                      <Input
                        id="deliveryDate"
                        name="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="rentDays">Срок аренды (дней)</Label>
                      <Input
                        id="rentDays"
                        name="rentDays"
                        type="number"
                        min="1"
                        max="30"
                        value={formData.rentDays}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="comment">Комментарий к заказу</Label>
                      <Textarea
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleInputChange}
                        placeholder="Дополнительная информация по заказу..."
                        rows={3}
                      />
                    </div>
                  </form>
                </div>
                
                {/* Сводка заказа */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-medium">Итого</h2>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Подытог за {rentDays} {rentDays === 1 ? 'день' : rentDays < 5 ? 'дня' : 'дней'}</span>
                      <span>{subtotal} ₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Доставка</span>
                      <span>{deliveryFee} ₽</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Итого</span>
                      <span>{total} ₽</span>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full mt-4 flex items-center justify-center"
                      onClick={handlePlaceOrder}
                    >
                      Оформить заказ
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingCart className="h-16 w-16 text-gray-300" />
              </div>
              <h2 className="text-xl font-medium mb-2">Ваша корзина пуста</h2>
              <p className="text-gray-500 mb-6">
                Похоже, вы еще не добавили товары в корзину
              </p>
              <Link to="/catalog">
                <Button>Перейти в каталог</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
