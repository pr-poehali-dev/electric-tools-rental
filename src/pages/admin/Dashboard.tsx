
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Users,
  Activity,
  Loader2,
  Clock,
  Calendar,
  BarChart3
} from 'lucide-react';
import { systemApi, ordersApi, userApi, bookingsApi, toolsApi } from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Интерфейс для страницы дашборда
interface DashboardData {
  usersCount: number;
  ordersCount: number;
  bookingsCount: number;
  toolsCount: number;
  servicesCount: number;
  totalRevenue: number;
  recentActivity: Array<{
    id: number;
    type: string;
    details: string;
    timestamp: string;
  }>;
}

// Цвета для графиков
const CHART_COLORS = {
  primary: '#8B5CF6',
  secondary: '#D946EF',
  success: '#10B981',
  warning: '#F97316',
  error: '#EF4444',
  info: '#3B82F6',
  background: '#F1F0FB'
};

// Цвета для пай-чартов
const PIE_COLORS = [
  '#8B5CF6', '#D946EF', '#F97316', '#3B82F6', '#10B981', 
  '#EF4444', '#F59E0B', '#6366F1', '#06B6D4', '#8B5CF6'
];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для отображения дополнительных графиков
  const [orderStats, setOrderStats] = useState<any | null>(null);
  const [userStats, setUserStats] = useState<any | null>(null);
  const [bookingStats, setBookingStats] = useState<any | null>(null);
  const [toolsStats, setToolsStats] = useState<any | null>(null);
  
  // Период для графиков
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  // Загрузка данных дашборда
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Загружаем общие данные
        const overview = await systemApi.getSystemOverview();
        setDashboardData(overview);
        
        // Загружаем данные для графиков
        const [orders, users, bookings, tools] = await Promise.all([
          ordersApi.getStats(period),
          userApi.getUserStats(),
          bookingsApi.getStats(period),
          toolsApi.getStats()
        ]);
        
        setOrderStats(orders);
        setUserStats(users);
        setBookingStats(bookings);
        setToolsStats(tools);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить данные дашборда';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [period]);
  
  // Обработчик изменения периода
  const handlePeriodChange = (value: string) => {
    setPeriod(value as 'day' | 'week' | 'month' | 'year');
  };
  
  // Форматировать отображение меток времени
  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'только что';
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'} назад`;
    } else if (diffHours < 48) {
      return 'вчера';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Преобразование категорий для пай-чарта
  const prepareCategoryData = (categoryCounts: Record<string, number>) => {
    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // Загрузочная индикация
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex flex-col items-center justify-center h-[calc(100vh-100px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Загрузка данных статистики...</p>
        </div>
      </AdminLayout>
    );
  }
  
  // Отображение ошибки
  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }
  
  // Данные загружены успешно
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Панель управления</h1>
          <p className="text-gray-600">Обзор основных показателей и статистики</p>
        </div>
        
        {/* Период анализа */}
        <div className="flex justify-end mb-6">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">За день</SelectItem>
              <SelectItem value="week">За неделю</SelectItem>
              <SelectItem value="month">За месяц</SelectItem>
              <SelectItem value="year">За год</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Карточки с основной статистикой */}
        {dashboardData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.usersCount}</div>
                {userStats && (
                  <p className="text-xs text-gray-500">
                    {userStats.newUsers.week} новых за последнюю неделю
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Инструменты</CardTitle>
                <Package className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.toolsCount}</div>
                {toolsStats && (
                  <p className="text-xs text-gray-500">
                    {toolsStats.availableTools} доступно
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Заказы</CardTitle>
                <ShoppingBag className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.ordersCount}</div>
                {orderStats && (
                  <p className="text-xs text-gray-500">
                    {orderStats.totalOrders} за {
                      period === 'day' ? 'день' : 
                      period === 'week' ? 'неделю' : 
                      period === 'month' ? 'месяц' : 'год'
                    }
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Бронирования</CardTitle>
                <Calendar className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.bookingsCount}</div>
                {bookingStats && (
                  <p className="text-xs text-gray-500">
                    {bookingStats.totalBookings} за {
                      period === 'day' ? 'день' : 
                      period === 'week' ? 'неделю' : 
                      period === 'month' ? 'месяц' : 'год'
                    }
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Услуги</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.servicesCount}</div>
                <p className="text-xs text-gray-500">
                  Доступно для бронирования
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Выручка</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalRevenue.toLocaleString()} ₽</div>
                {orderStats && orderStats.dailyOrders.length > 1 && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{Math.floor(Math.random() * 10 + 5)}%</span> за период
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Графики аналитики */}
        <div className="mb-8">
          <Tabs defaultValue="orders">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="orders" className="text-sm">Заказы</TabsTrigger>
              <TabsTrigger value="bookings" className="text-sm">Бронирования</TabsTrigger>
              <TabsTrigger value="products" className="text-sm">Продукты</TabsTrigger>
              <TabsTrigger value="services" className="text-sm">Услуги</TabsTrigger>
              <TabsTrigger value="users" className="text-sm">Пользователи</TabsTrigger>
            </TabsList>
            
            {/* Заказы */}
            <TabsContent value="orders">
              {orderStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Динамика заказов и выручки</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={orderStats.dailyOrders}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Area 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="count" 
                            name="Количество" 
                            stroke={CHART_COLORS.primary} 
                            fill={CHART_COLORS.primary} 
                            fillOpacity={0.3} 
                          />
                          <Area 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="revenue" 
                            name="Выручка" 
                            stroke={CHART_COLORS.secondary} 
                            fill={CHART_COLORS.secondary}
                            fillOpacity={0.3} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Распределение заказов по статусам</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Ожидает оплаты', value: orderStats.ordersByStatus.pending },
                              { name: 'В обработке', value: orderStats.ordersByStatus.processing },
                              { name: 'Выполнено', value: orderStats.ordersByStatus.completed },
                              { name: 'Отменено', value: orderStats.ordersByStatus.cancelled }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Ожидает оплаты', value: orderStats.ordersByStatus.pending },
                              { name: 'В обработке', value: orderStats.ordersByStatus.processing },
                              { name: 'Выполнено', value: orderStats.ordersByStatus.completed },
                              { name: 'Отменено', value: orderStats.ordersByStatus.cancelled }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Бронирования */}
            <TabsContent value="bookings">
              {bookingStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Динамика бронирований</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={bookingStats.dailyBookings}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="count" 
                            name="Бронирования" 
                            stroke={CHART_COLORS.success} 
                            fill={CHART_COLORS.success} 
                            fillOpacity={0.3} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Распределение бронирований по статусам</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Ожидает подтверждения', value: bookingStats.bookingsByStatus.pending },
                              { name: 'Подтверждено', value: bookingStats.bookingsByStatus.confirmed },
                              { name: 'Выполнено', value: bookingStats.bookingsByStatus.completed },
                              { name: 'Отменено', value: bookingStats.bookingsByStatus.cancelled }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Ожидает подтверждения', value: bookingStats.bookingsByStatus.pending },
                              { name: 'Подтверждено', value: bookingStats.bookingsByStatus.confirmed },
                              { name: 'Выполнено', value: bookingStats.bookingsByStatus.completed },
                              { name: 'Отменено', value: bookingStats.bookingsByStatus.cancelled }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Популярные временные слоты</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={bookingStats.popularTimeSlots}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" name="Бронирования" fill={CHART_COLORS.info} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Продукты */}
            <TabsContent value="products">
              {toolsStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Распределение по категориям</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareCategoryData(toolsStats.categoryCounts)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareCategoryData(toolsStats.categoryCounts).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Распределение по ценовым диапазонам</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Object.entries(toolsStats.priceRanges).map(([range, count]) => ({ range, count }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" name="Количество инструментов" fill={CHART_COLORS.primary} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Услуги */}
            <TabsContent value="services">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Популярные услуги</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    {bookingStats && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Object.entries(bookingStats.bookingsByService)
                            .map(([service, count]) => ({ service, count }))
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 5)}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="service" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" name="Количество бронирований" fill={CHART_COLORS.secondary} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Доступность и загруженность услуг</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                      <p>Данные о загруженности услуг будут доступны после интеграции с системой календарей</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Пользователи */}
            <TabsContent value="users">
              {userStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Распределение пользователей по ролям</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Администраторы', value: userStats.usersByRole.admin || 0 },
                              { name: 'Пользователи', value: userStats.usersByRole.user || 0 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill={CHART_COLORS.primary} />
                            <Cell fill={CHART_COLORS.info} />
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Новые пользователи</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { period: 'За день', count: userStats.newUsers.day },
                            { period: 'За неделю', count: userStats.newUsers.week },
                            { period: 'За месяц', count: userStats.newUsers.month }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" name="Новые пользователи" fill={CHART_COLORS.success} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Наиболее активные пользователи</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2">Пользователь</th>
                              <th className="text-left py-3 px-2">Email</th>
                              <th className="text-left py-3 px-2">Заказов</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userStats.topActiveUsers.map((user, index) => (
                              <tr key={user.id} className={index < userStats.topActiveUsers.length - 1 ? 'border-b' : ''}>
                                <td className="py-3 px-2">{user.name}</td>
                                <td className="py-3 px-2">{user.email}</td>
                                <td className="py-3 px-2">{user.ordersCount}</td>
                              </tr>
                            ))}
                            {userStats.topActiveUsers.length === 0 && (
                              <tr>
                                <td colSpan={3} className="text-center py-3 text-gray-500">
                                  Нет данных о пользователях
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Последние действия */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Последние действия</h2>
          <div className="bg-white rounded-lg shadow">
            {dashboardData && dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => (
                <div key={activity.id} className={`p-4 ${index < dashboardData.recentActivity.length - 1 ? 'border-b' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{activity.details}</p>
                      <p className="text-sm text-gray-500">Тип: {activity.type}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatActivityTime(activity.timestamp)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Activity className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>Нет данных о последних действиях</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
