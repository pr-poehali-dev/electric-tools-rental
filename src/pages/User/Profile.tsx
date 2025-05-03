
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Calendar, 
  LogOut, 
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { ordersApi, bookingsApi } from '@/lib/api';
import { Order } from '@/lib/api';
import { Booking } from '@/types/types';

const Profile = () => {
  const { user, logout, updateProfile, changePassword, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [localError, setLocalError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  
  // Состояние формы профиля
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Состояние формы для изменения пароля
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Индикаторы отправки форм
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Заполняем форму при получении данных пользователя
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    } else {
      // Если пользователь не аутентифицирован, перенаправляем на страницу входа
      navigate('/login');
    }
  }, [user, navigate]);
  
  // При изменении глобальной ошибки обновляем локальную
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);
  
  // Загрузка заказов пользователя
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoadingOrders(true);
      
      try {
        const userOrders = await ordersApi.getUserOrders(user.id);
        setOrders(userOrders);
      } catch (err) {
        console.error('Failed to load orders:', err);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить историю заказов",
          variant: "destructive"
        });
      } finally {
        setIsLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, [user, toast]);
  
  // Загрузка бронирований пользователя
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      setIsLoadingBookings(true);
      
      try {
        const userBookings = await bookingsApi.getUserBookings(user.id);
        setBookings(userBookings);
      } catch (err) {
        console.error('Failed to load bookings:', err);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить историю бронирований",
          variant: "destructive"
        });
      } finally {
        setIsLoadingBookings(false);
      }
    };
    
    fetchBookings();
  }, [user, toast]);
  
  // Обработчик изменения полей формы профиля
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Обработчик изменения полей формы пароля
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Обновление профиля
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsUpdatingProfile(true);
    
    try {
      const success = await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone || undefined
      });
      
      if (success) {
        toast({
          title: "Профиль обновлен",
          description: "Ваши данные успешно сохранены",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при обновлении профиля';
      setLocalError(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  // Изменение пароля
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setLocalError('Новый пароль и подтверждение не совпадают');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const success = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (success) {
        toast({
          title: "Пароль изменен",
          description: "Ваш пароль был успешно обновлен",
        });
        
        // Очищаем форму после успешного изменения
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при изменении пароля';
      setLocalError(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  // Функция для отображения статуса заказа
  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Ожидает оплаты</span>;
      case 'processing':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">В обработке</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Выполнен</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Отменен</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Неизвестно</span>;
    }
  };
  
  // Функция для отображения статуса бронирования
  const getBookingStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Ожидает подтверждения</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Подтверждено</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Выполнено</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Отменено</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Неизвестно</span>;
    }
  };
  
  // Отмена бронирования
  const handleCancelBooking = async (bookingId: number) => {
    try {
      await bookingsApi.cancel(bookingId);
      
      // Обновляем список бронирований
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
      
      toast({
        title: "Бронирование отменено",
        description: "Ваше бронирование было успешно отменено",
      });
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Не удалось отменить бронирование",
        variant: "destructive"
      });
    }
  };
  
  // Выход из системы
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return null; // useEffect перенаправит на страницу входа
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Информация о пользователе */}
            <Card className="md:w-1/3">
              <CardHeader>
                <CardTitle>Личный кабинет</CardTitle>
                <CardDescription>Управление личными данными и заказами</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                {user.phone && <p className="text-gray-500">{user.phone}</p>}
                <p className="text-sm text-gray-400 mt-2">
                  Клиент с {new Date(user.createdAt).toLocaleDateString()}
                </p>
                
                <Button 
                  variant="outline" 
                  className="mt-6 flex items-center gap-2 w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Выйти из аккаунта
                </Button>
              </CardContent>
            </Card>
            
            {/* Основной контент */}
            <div className="md:w-2/3">
              <Tabs defaultValue="orders">
                <TabsList className="mb-6">
                  <TabsTrigger value="orders" className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Мои заказы
                  </TabsTrigger>
                  <TabsTrigger value="bookings" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Мои бронирования
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Настройки
                  </TabsTrigger>
                </TabsList>
                
                {/* Заказы */}
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>История заказов</CardTitle>
                      <CardDescription>
                        Просмотр всех ваших заказов и их статусов
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingOrders ? (
                        <div className="flex justify-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.map(order => (
                            <div 
                              key={order.id} 
                              className="bg-white border rounded p-4 hover:shadow-sm transition"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <div>
                                  <h3 className="font-medium">Заказ #{order.id}</h3>
                                  <p className="text-sm text-gray-500">
                                    от {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getOrderStatusBadge(order.status)}
                                </div>
                              </div>
                              
                              <div className="mt-3 text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Сумма заказа:</span>
                                  <span className="font-medium">{order.total} ₽</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Количество позиций:</span>
                                  <span>{order.items.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Способ получения:</span>
                                  <span>{order.delivery}</span>
                                </div>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-3 text-primary"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                Подробнее
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          <ShoppingBag className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                          <p>У вас еще нет заказов</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => navigate('/catalog')}
                          >
                            Перейти в каталог
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Бронирования */}
                <TabsContent value="bookings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Мои бронирования</CardTitle>
                      <CardDescription>
                        Управление бронированиями услуг и консультаций
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingBookings ? (
                        <div className="flex justify-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : bookings.length > 0 ? (
                        <div className="space-y-4">
                          {bookings.map(booking => (
                            <div 
                              key={booking.id} 
                              className="bg-white border rounded p-4 hover:shadow-sm transition"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <div>
                                  <h3 className="font-medium">{booking.serviceName}</h3>
                                  <p className="text-sm text-gray-500">
                                    {booking.date} в {booking.time}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getBookingStatusBadge(booking.status)}
                                </div>
                              </div>
                              
                              <div className="mt-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Стоимость:</span>
                                  <span className="font-medium">{booking.servicePrice} ₽</span>
                                </div>
                              </div>
                              
                              {booking.status === 'pending' && (
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="mt-3"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Отменить
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                          <p>У вас еще нет бронирований</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => navigate('/services')}
                          >
                            Забронировать услугу
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Настройки */}
                <TabsContent value="settings">
                  <div className="space-y-6">
                    {/* Изменение профиля */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Личные данные</CardTitle>
                        <CardDescription>
                          Обновите вашу персональную информацию
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {localError && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{localError}</AlertDescription>
                          </Alert>
                        )}
                        
                        <form onSubmit={handleUpdateProfile}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Имя</Label>
                              <Input
                                id="name"
                                name="name"
                                value={profileForm.name}
                                onChange={handleProfileChange}
                                placeholder="Иван Иванов"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                disabled
                                placeholder="example@mail.ru"
                              />
                              <p className="text-xs text-gray-500">Изменение email невозможно</p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phone">Телефон</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={profileForm.phone}
                                onChange={handleProfileChange}
                                placeholder="+7 (999) 123-45-67"
                              />
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full flex items-center gap-2"
                              disabled={isUpdatingProfile}
                            >
                              {isUpdatingProfile ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Обновление...
                
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4" />
                                  Сохранить изменения
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                    
                    {/* Изменение пароля */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Изменение пароля</CardTitle>
                        <CardDescription>
                          Обновите ваш пароль для повышения безопасности
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleChangePassword}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">Текущий пароль</Label>
                              <Input
                                id="current-password"
                                name="currentPassword"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="new-password">Новый пароль</Label>
                              <Input
                                id="new-password"
                                name="newPassword"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
                              <Input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                required
                              />
                              {passwordForm.newPassword !== passwordForm.confirmPassword && 
                               passwordForm.confirmPassword && (
                                <p className="text-xs text-red-500">Пароли не совпадают</p>
                              )}
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full flex items-center gap-2"
                              disabled={isChangingPassword || 
                                passwordForm.newPassword !== passwordForm.confirmPassword}
                            >
                              {isChangingPassword ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Обновление...
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4" />
                                  Изменить пароль
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
