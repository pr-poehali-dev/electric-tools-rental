
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
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
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Search,
  Loader2
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
import { useToast } from '@/components/ui/use-toast';
import { ordersApi, Order } from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Примеры заказов для инициализации
const mockOrders = [
  {
    id: 12345,
    customer: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    date: '2023-05-15',
    total: 1500,
    status: 'completed',
    items: [
      { id: 1, name: 'Перфоратор Bosch GBH 2-26', quantity: 1, price: 500, days: 3 },
    ],
    delivery: 'Самовывоз',
    address: '',
    comment: 'Перезвоните за час до доставки'
  },
  {
    id: 12346,
    customer: 'Елена Сидорова',
    email: 'elena@example.com',
    phone: '+7 (999) 234-56-78',
    date: '2023-05-20',
    total: 2100,
    status: 'processing',
    items: [
      { id: 2, name: 'Шуруповерт Makita DDF482', quantity: 1, price: 400, days: 5 },
      { id: 4, name: 'Болгарка DeWALT DWE4257', quantity: 1, price: 450, days: 5 },
    ],
    delivery: 'Доставка',
    address: 'г. Москва, ул. Примерная, д. 1, кв. 1',
    comment: ''
  },
];

// Инициализация демо заказов в localStorage
const initializeDemoOrders = async () => {
  try {
    const orders = await ordersApi.getAll();
    if (orders.length === 0) {
      // Добавляем демо заказы только если их нет
      mockOrders.forEach(async (order) => {
        const { id, date, status, ...orderData } = order;
        // @ts-ignore - игнорируем несоответствие типов для демо-данных
        await ordersApi.create(orderData);
      });
    }
  } catch (error) {
    console.error('Ошибка при инициализации демо заказов:', error);
  }
};

// Статусы заказов
const statusData = {
  pending: { label: 'Ожидает оплаты', color: 'bg-yellow-500', icon: Clock },
  processing: { label: 'В обработке', color: 'bg-blue-500', icon: Clock },
  completed: { label: 'Выполнен', color: 'bg-green-500', icon: CheckCircle2 },
  cancelled: { label: 'Отменен', color: 'bg-red-500', icon: XCircle },
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewOrderDialog, setViewOrderDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Инициализация и загрузка заказов
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Инициализируем демо заказы
        await initializeDemoOrders();
        
        // Загружаем заказы
        const data = await ordersApi.getAll();
        setOrders(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить заказы';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, []);
  
  // Поиск по заказам
  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchQuery) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.phone.includes(searchQuery)
  );
  
  // Открыть диалог просмотра заказа
  const openViewDialog = (order: Order) => {
    setCurrentOrder(order);
    setViewOrderDialog(true);
  };
  
  // Обновить статус заказа
  const updateOrderStatus = async (status: Order['status']) => {
    if (!currentOrder) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedOrder = await ordersApi.updateStatus(currentOrder.id, status);
      
      // Обновляем локальное состояние
      setOrders(orders.map(order => 
        order.id === currentOrder.id ? updatedOrder : order
      ));
      
      setCurrentOrder(updatedOrder);
      
      const statusText = statusData[status].label.toLowerCase();
      
      toast({
        title: "Статус заказа обновлен",
        description: `Заказ #${currentOrder.id} теперь ${statusText}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить статус заказа';
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
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Управление заказами</h1>
          <p className="text-gray-600">Просмотр и обработка заказов клиентов</p>
        </div>
        
        {/* Поиск */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Поиск по номеру, клиенту или контактам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Ошибка загрузки */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Таблица заказов */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Загрузка заказов...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№ заказа</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Сумма (₽)</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const statusInfo = statusData[order.status];
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>
                          <div>{order.customer}</div>
                          <div className="text-xs text-gray-500">{order.email}</div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="text-right">{order.total}</TableCell>
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
                            onClick={() => openViewDialog(order)}
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
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchQuery ? 'Заказы не найдены' : 'Список заказов пуст'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Диалог просмотра заказа */}
        {currentOrder && (
          <Dialog open={viewOrderDialog} onOpenChange={setViewOrderDialog}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Заказ #{currentOrder.id}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Информация о клиенте</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="font-medium">{currentOrder.customer}</div>
                      <div className="text-sm text-gray-500">{currentOrder.email}</div>
                      <div className="text-sm text-gray-500">{currentOrder.phone}</div>
                    </div>
                    
                    <div>
                      <div className="font-medium">Доставка:</div>
                      <div className="text-sm text-gray-700">{currentOrder.delivery}</div>
                      {currentOrder.address && (
                        <div className="text-sm text-gray-700 mt-1">{currentOrder.address}</div>
                      )}
                    </div>
                    
                    {currentOrder.comment && (
                      <div>
                        <div className="font-medium">Комментарий:</div>
                        <div className="text-sm text-gray-700">{currentOrder.comment}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Статус заказа</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`h-3 w-3 rounded-full ${
                          statusData[currentOrder.status].color
                        }`} 
                      />
                      <span className="font-medium">
                        {statusData[currentOrder.status].label}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Изменить статус:</div>
                      <Select 
                        value={currentOrder.status} 
                        onValueChange={updateOrderStatus}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Ожидает оплаты</SelectItem>
                          <SelectItem value="processing">В обработке</SelectItem>
                          <SelectItem value="completed">Выполнен</SelectItem>
                          <SelectItem value="cancelled">Отменен</SelectItem>
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
                    <CardTitle className="text-base">Товары в заказе</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Наименование</TableHead>
                          <TableHead className="text-center">Кол-во</TableHead>
                          <TableHead className="text-center">Дней</TableHead>
                          <TableHead className="text-right">Цена (₽/день)</TableHead>
                          <TableHead className="text-right">Сумма (₽)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-center">{item.days}</TableCell>
                            <TableCell className="text-right">{item.price}</TableCell>
                            <TableCell className="text-right">
                              {item.price * item.quantity * item.days}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-4 pt-4 border-t flex justify-between">
                      <span className="font-medium">Итого:</span>
                      <span className="font-bold">{currentOrder.total} ₽</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setViewOrderDialog(false)}>Закрыть</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersManagement;
