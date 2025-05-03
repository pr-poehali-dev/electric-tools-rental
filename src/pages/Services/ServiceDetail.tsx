
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  User, 
  ArrowLeft,
  Loader2,
  CalendarDays
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { servicesApi, bookingsApi } from '@/lib/api';
import { BookingService } from '@/types/types';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [service, setService] = useState<BookingService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для диалога бронирования
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  
  // Загрузка данных об услуге
  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const serviceId = parseInt(id);
        const serviceData = await servicesApi.getById(serviceId);
        
        if (!serviceData) {
          setError('Услуга не найдена');
          return;
        }
        
        setService(serviceData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить информацию об услуге';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchService();
  }, [id]);
  
  // Форматирование продолжительности
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} минут`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}${remainingMinutes > 0 ? ` ${remainingMinutes} минут` : ''}`;
    }
  };
  
  // Загрузка доступных слотов времени при выборе даты
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) {
        setAvailableTimeSlots([]);
        return;
      }
      
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const slots = await bookingsApi.getAvailableSlots(formattedDate);
        setAvailableTimeSlots(slots);
        setSelectedTime(undefined); // Сбрасываем выбранное время
      } catch (err) {
        console.error('Failed to fetch available time slots:', err);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить доступные слоты времени",
          variant: "destructive"
        });
      }
    };
    
    fetchAvailableSlots();
  }, [selectedDate, toast]);
  
  // Отправка бронирования
  const handleBooking = async () => {
    if (!service || !user || !selectedDate || !selectedTime) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите дату и время",
        variant: "destructive"
      });
      return;
    }
    
    setIsBookingSubmitting(true);
    
    try {
      const bookingData = {
        userId: user.id,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime
      };
      
      const booking = await bookingsApi.create(bookingData);
      
      toast({
        title: "Бронирование успешно",
        description: `Услуга "${service.name}" забронирована на ${format(selectedDate, 'dd MMMM', { locale: ru })} в ${selectedTime}`
      });
      
      setIsBookingDialogOpen(false);
      
      // Перенаправляем на страницу профиля с открытой вкладкой бронирований
      navigate('/profile');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при бронировании';
      toast({
        title: "Ошибка бронирования",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsBookingSubmitting(false);
    }
  };
  
  // Если данные загружаются, показываем спиннер
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Загрузка информации об услуге...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Если произошла ошибка, показываем сообщение
  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <Alert variant="destructive">
              <AlertDescription>{error || 'Услуга не найдена'}</AlertDescription>
            </Alert>
            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/services')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Вернуться к списку услуг
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
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Хлебные крошки */}
          <div className="text-sm mb-6">
            <Link to="/" className="text-gray-500 hover:text-primary">Главная</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/services" className="text-gray-500 hover:text-primary">Услуги</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{service.name}</span>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="md:flex">
              {/* Изображение услуги */}
              <div className="md:w-1/2">
                <div className="h-64 md:h-full overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Информация об услуге */}
              <div className="md:w-1/2 p-6">
                <div className="mb-2">
                  <Badge variant="outline" className="bg-gray-100">
                    {service.category}
                  </Badge>
                  {!service.available && (
                    <Badge variant="destructive" className="ml-2">
                      Недоступно
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold mb-4">{service.name}</h1>
                
                <div className="text-3xl font-bold mb-4 text-primary">
                  {service.price} ₽
                </div>
                
                <p className="text-gray-700 mb-6">{service.description}</p>
                
                <div className="flex items-center mb-4 text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Длительность: {formatDuration(service.duration)}</span>
                </div>
                
                {service.available ? (
                  isAuthenticated ? (
                    <Button 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => setIsBookingDialogOpen(true)}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      Забронировать
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Alert>
                        <AlertDescription>
                          Для бронирования услуги необходимо войти в систему
                        </AlertDescription>
                      </Alert>
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => navigate('/login')}
                      >
                        <User className="h-4 w-4" />
                        Войти для бронирования
                      </Button>
                    </div>
                  )
                ) : (
                  <Button disabled className="w-full">
                    Услуга временно недоступна
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Дополнительная информация об услуге */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Профессиональный сервис</h3>
                    <p className="text-gray-600 text-sm">
                      Все услуги оказываются опытными специалистами с многолетним стажем работы
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Гибкое расписание</h3>
                    <p className="text-gray-600 text-sm">
                      Выбирайте удобное для вас время из доступных слотов
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Индивидуальный подход</h3>
                    <p className="text-gray-600 text-sm">
                      Каждый клиент получает персональное внимание и решение своих задач
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Диалог бронирования */}
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Бронирование услуги</DialogTitle>
                <DialogDescription>
                  Выберите удобные дату и время для услуги "{service.name}"
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-6">
                {/* Календарь */}
                <div>
                  <div className="text-sm font-medium mb-2">Выберите дату:</div>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="border rounded-md p-2"
                      disabled={(date) => {
                        // Запрещаем выбор прошедших дат и дат более чем на 30 дней вперед
                        const now = new Date();
                        now.setHours(0, 0, 0, 0);
                        const maxDate = new Date();
                        maxDate.setDate(maxDate.getDate() + 30);
                        return date < now || date > maxDate;
                      }}
                      locale={ru}
                    />
                  </div>
                </div>
                
                {/* Выбор времени */}
                {selectedDate && (
                  <div>
                    <div className="text-sm font-medium mb-2">Выберите время:</div>
                    {availableTimeSlots.length > 0 ? (
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-md">
                        <CalendarDays className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Нет доступных слотов на эту дату</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Информация об услуге */}
                {selectedDate && selectedTime && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm font-medium mb-2">Детали бронирования:</div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Услуга:</span>
                        <span>{service.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Дата:</span>
                        <span>{format(selectedDate, 'dd MMMM yyyy', { locale: ru })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Время:</span>
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Продолжительность:</span>
                        <span>{formatDuration(service.duration)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t mt-2">
                        <span>Стоимость:</span>
                        <span className="text-primary">{service.price} ₽</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsBookingDialogOpen(false)}
                  disabled={isBookingSubmitting}
                >
                  Отмена
                </Button>
                <Button 
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || isBookingSubmitting}
                >
                  {isBookingSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Бронирование...
                    </>
                  ) : (
                    'Забронировать'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;
