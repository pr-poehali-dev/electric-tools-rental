
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { bookingsApi, servicesApi, userApi } from '@/lib/api';
import { Booking, BookingService, User } from '@/types/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Loader2,
  Filter,
  CalendarIcon,
  Calendar as CalendarFull
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Статусы бронирований
const statusData = {
  pending: { label: 'Ожидает подтверждения', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Подтверждено', color: 'bg-blue-500', icon: Clock },
  completed: { label: 'Выполнено', color: 'bg-green-500', icon: CheckCircle2 },
  cancelled: { label: 'Отменено', color: 'bg-red-500', icon: XCircle },
};

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<BookingService[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [viewBookingDialog, setViewBookingDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Загрузка бронирований, услуг и пользователей
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Загружаем данные параллельно
        const [bookingsData, servicesData, usersData] = await Promise.all([
          bookingsApi.getAll(),
          servicesApi.getAll(),
          userApi.getAllUsers()
        ]);
        
        setBookings(bookingsData);
        setServices(servicesData);
        setUsers(usersData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить данные';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Фильтрация бронирований
  const filteredBookings = bookings.filter(booking => {
    // Поиск по ID или имени услуги
    const matchesSearch = 
      booking.id.toString().includes(searchQuery) ||
      booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фильтр по статусу
    const matchesStatus = selectedStatus ? booking.status === selectedStatus : true;
    
    // Фильтр по дате
    const matchesDate = selectedDate
      ? booking.date === format(selectedDate, 'yyyy-MM-dd')
      : true;
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Открыть диалог просмотра бронирования
  const openViewDialog = (booking: Booking) => {
    setCurrentBooking(booking);
    setViewBookingDialog(true);
  };
  
  // Получить данные пользователя по ID
  const getUserById = (userId: number): User | undefined => {
    return users.find(user => user.id === userId);
  };
  
  // Получить данные услуги по ID
  const getServiceById = (serviceId: number): BookingService | undefined => {
    return services.find(service => service.id === serviceId);
  };
  
  // Обновить статус бронирования
  const updateBookingStatus = async (status: Booking['status']) => {
    if (!currentBooking) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedBooking = await bookingsApi.updateStatus(currentBooking.id, status);
      
      // Обновляем локальное состояние
      setBookings(bookings.map(booking => 
        booking.id === currentBooking.id ? updatedBooking : booking
      ));
      
      setCurrentBooking(updatedBooking);
      
      const statusText = statusData[status].label.toLowerCase();
      
      toast({
        title: "Статус бронирования обновлен",
        description: `Бронирование #${currentBooking.id} теперь ${statusText}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить статус бронирования';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Сбросить все фильтры
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus(null);
    setSelectedDate(null);
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Управление бронированиями</h1>
          <p className="text-gray-600">Просмотр и обработка бронирований услуг</p>
        </div>
        
        {/* Фильтры */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Поиск */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Поиск по номеру или услуге..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Фильтр по статусу */}
            <div>
              <Select 
                value={selectedStatus || ''} 
                onValueChange={(value) => setSelectedStatus(value || null)}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Все статусы" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидает подтверждения</SelectItem>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="completed">Выполнено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Фильтр по дате */}
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, 'dd MMMM yyyy', { locale: ru })
                    ) : (
                      "Выберите дату"
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Выберите дату</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={(date) => setSelectedDate(date)}
                      className="rounded-md border"
                      locale={ru}
                    />
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedDate(null)}
                    >
                      Сбросить
                    </Button>
                    <Button type="submit" onClick={() => {}}>
                      Применить
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Кнопка сброса фильтров */}
            <div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={resetFilters}
                disabled={!searchQuery && !selectedStatus && !selectedDate}
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </div>
        
        {/* Ошибка загрузки */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Таблица бронирований */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Загрузка бронирований...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Услуга</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Дата и время</TableHead>
                  <TableHead>Стоимость</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const statusInfo = statusData[booking.status];
                    const StatusIcon = statusInfo.icon;
                    const user = getUserById(booking.userId);
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.serviceName}</div>
                        </TableCell>
                        <TableCell>
                          {user ? (
                            <div>
                              <div>{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          ) : (
                            <div className="text-gray-500">Пользователь не найден</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{booking.date}</div>
                          <div className="text-xs text-gray-500">{booking.time}</div>
                        </TableCell>
                        <TableCell>{booking.servicePrice} ₽</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${statusInfo.color} mr-2`}></div>
                            {statusInfo.label}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openViewDialog(booking)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {(searchQuery || selectedStatus || selectedDate) ? 
                        'Бронирования не найдены' : 
                        'Список бронирований пуст'}
                    </TableCell>
                  
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Диалог просмотра бронирования */}
        {currentBooking && (
          <Dialog open={viewBookingDialog} onOpenChange={setViewBookingDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Бронирование #{currentBooking.id}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Информация о клиенте</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(() => {
                      const user = getUserById(currentBooking.userId);
                      if (!user) return <div className="text-gray-500">Информация о пользователе не найдена</div>;
                      
                      return (
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Статус бронирования</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`h-3 w-3 rounded-full ${
                          statusData[currentBooking.status].color
                        }`} 
                      />
                      <span className="font-medium">
                        {statusData[currentBooking.status].label}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Изменить статус:</div>
                      <Select 
                        value={currentBooking.status} 
                        onValueChange={updateBookingStatus}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Ожидает подтверждения</SelectItem>
                          <SelectItem value="confirmed">Подтверждено</SelectItem>
                          <SelectItem value="completed">Выполнено</SelectItem>
                          <SelectItem value="cancelled">Отменено</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {isSubmitting && (
                        <div className="flex items-center justify-center mt-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                          <span className="text-sm text-gray-500">Обновление...</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Детали бронирования</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const service = getServiceById(currentBooking.serviceId);
                      
                      return (
                        <div className="space-y-4">
                          <div>
                            <div className="font-medium">{currentBooking.serviceName}</div>
                            {service && (
                              <div className="text-sm text-gray-500">{service.description}</div>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center border-t pt-4">
                            <div className="flex items-center gap-2">
                              <CalendarFull className="h-4 w-4 text-gray-500" />
                              <span>Дата и время:</span>
                            </div>
                            <span className="font-medium">
                              {currentBooking.date} в {currentBooking.time}
                            </span>
                          </div>
                          
                          {service && (
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>Продолжительность:</span>
                              </div>
                              <span>
                                {service.duration < 60 
                                  ? `${service.duration} мин.` 
                                  : `${Math.floor(service.duration / 60)} ч. ${service.duration % 60 ? `${service.duration % 60} мин.` : ''}`}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center">
                            <span>Стоимость услуги:</span>
                            <span className="font-bold text-primary">{currentBooking.servicePrice} ₽</span>
                          </div>
                          
                          <div className="text-xs text-gray-500 pt-2">
                            Дата создания: {new Date(currentBooking.createdAt).toLocaleString()}
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setViewBookingDialog(false)}>Закрыть</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default BookingsManagement;
