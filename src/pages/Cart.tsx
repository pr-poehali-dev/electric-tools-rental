
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart, ArrowRight, CreditCard, Truck, Store, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ordersApi } from '@/lib/api';

const Cart = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Состояние формы заказа
  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    phone: '',
    delivery: 'pickup', // 'pickup' или 'delivery'
    address: '',
    comment: '',
    days: 1, // Количество дней аренды
  });
  
  // При изменении какого-либо поля формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // При изменении способа доставки
  const handleDeliveryChange = (value: string) => {
    setFormData(prev => ({ ...prev, delivery: value }));
  };
  
  // Стоимость доставки
  const deliveryCost = formData.delivery === 'delivery' ? 300 : 0;
  
  // Общая стоимость заказа
  const totalOrderPrice = (totalPrice * formData.days) + deliveryCost;
  
  // Отправка заказа
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте товары в корзину перед оформлением заказа",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Подготавливаем данные для заказа
      const orderData = {
        customer: formData.customer,
        email: formData.email,
        phone: formData.phone,
        delivery: formData.delivery === 'pickup' ? 'Самовывоз' : 'Доставка',
        address: formData.address,
        comment: formData.comment,
        total: totalOrderPrice,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          days: parseInt(formData.days.toString())
        }))
      };
      
      // Отправляем заказ
      const order = await ordersApi.create(orderData);
      
      // Очищаем корзину
      clearCart();
      
      // Показываем сообщение об успехе
      toast({
        title: "Заказ успешно оформлен",
        description: `Номер вашего заказа: #${order.id}`,
      });
      
      // Перенаправляем на главную
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при оформлении заказа';
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Корзина</h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold mb-2">Ваша корзина пуста</h2>
              <p className="text-gray-600 mb-6">Добавьте инструменты в корзину, чтобы оформить заказ</p>
              <Button onClick={() => navigate('/catalog')}>
                Перейти в каталог
              </Button>
            </div>
          ) : (
            <div className="lg:flex gap-8">
              {/* Список товаров в корзине */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Товары в корзине</h2>
                  </div>
                  
                  <div className="divide-y">
                    {cartItems.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                  
                  <div className="p-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Сумма за день:</span>
                      <span className="font-semibold">{totalPrice} ₽</span>
                    </div>
                  </div>
                </div>
                
                {/* Количество дней аренды */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <Label htmlFor="days" className="font-medium">Количество дней аренды:</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      id="days"
                      name="days"
                      type="number"
                      min="1"
                      max="30"
                      value={formData.days}
                      onChange={handleInputChange}
                      className="w-24"
                    />
                    <div className="ml-4 text-sm text-gray-600">
                      {formData.days >= 3 && formData.days < 7 && (
                        <span className="text-primary">Скидка 10% при аренде от 3 дней!</span>
                      )}
                      {formData.days >= 7 && formData.days < 14 && (
                        <span className="text-primary">Скидка 15% при аренде от 7 дней!</span>
                      )}
                      {formData.days >= 14 && (
                        <span className="text-primary">Скидка 20% при аренде от 14 дней!</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Способ доставки */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <Label className="font-medium mb-3 block">Способ получения:</Label>
                  <RadioGroup value={formData.delivery} onValueChange={handleDeliveryChange}>
                    <div className="flex items-start space-x-2 mb-3">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="pickup" className="font-medium flex items-center">
                          <Store className="h-4 w-4 mr-2" />
                          Самовывоз
                        </Label>
                        <p className="text-sm text-gray-500">
                          Бесплатно. Пункт выдачи: г. Москва, ул. Строителей, д. 10
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="delivery" className="font-medium flex items-center">
                          <Truck className="h-4 w-4 mr-2" />
                          Доставка курьером
                        </Label>
                        <p className="text-sm text-gray-500">
                          300 ₽. Доставка в пределах города в день заказа при оформлении до 12:00
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  {formData.delivery === 'delivery' && (
                    <div className="mt-4">
                      <Label htmlFor="address">Адрес доставки:</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="Укажите полный адрес доставки"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Форма оформления заказа */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                  <h2 className="text-lg font-semibold mb-4">Оформление заказа</h2>
                  
                  <form onSubmit={handleSubmitOrder}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="customer">ФИО:</Label>
                        <Input
                          id="customer"
                          name="customer"
                          placeholder="Иванов Иван Иванович"
                          value={formData.customer}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email:</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="example@mail.ru"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Телефон:</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+7 (999) 123-45-67"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="comment">Комментарий к заказу:</Label>
                        <Textarea
                          id="comment"
                          name="comment"
                          placeholder="Дополнительная информация по заказу"
                          value={formData.comment}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      {/* Итоговая сумма */}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Сумма за аренду:</span>
                          <span>{totalPrice} ₽ × {formData.days} {formData.days === 1 ? 'день' : formData.days < 5 ? 'дня' : 'дней'}</span>
                        </div>
                        {deliveryCost > 0 && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Доставка:</span>
                            <span>{deliveryCost} ₽</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold mt-2">
                          <span>Итого:</span>
                          <span>{totalOrderPrice} ₽</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Оформление...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Оформить заказ
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Нажимая на кнопку "Оформить заказ", вы соглашаетесь с условиями аренды и даете согласие на обработку персональных данных.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
