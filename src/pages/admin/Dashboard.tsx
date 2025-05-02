
import AdminLayout from '@/components/admin/AdminLayout';
import { mockTools } from '@/data/mockTools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  // Вычисляем некоторую статистику для демонстрации
  const totalTools = mockTools.length;
  const availableTools = mockTools.filter(tool => tool.available).length;
  const totalRevenue = 15850; // Демо-данные
  const totalOrders = 24; // Демо-данные
  const totalCustomers = 18; // Демо-данные
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Панель управления</h1>
          <p className="text-gray-600">Обзор основных показателей и статистики</p>
        </div>
        
        {/* Карточки со статистикой */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Всего инструментов</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTools}</div>
              <p className="text-xs text-gray-500">
                {availableTools} доступно, {totalTools - availableTools} недоступно
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Выручка за месяц</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₽</div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+12%</span> по сравнению с прошлым месяцем
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Заказы</CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-gray-500">
                18 завершено, 6 в процессе
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Клиенты</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-gray-500">
                5 новых за последнюю неделю
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Популярные категории</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Дрели и перфораторы</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Шуруповерты</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Шлифовальные машины</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Последние действия */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Последние действия</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Добавлен новый инструмент</p>
                  <p className="text-sm text-gray-500">Шуруповерт Bosch GSR 18V-50</p>
                </div>
                <span className="text-xs text-gray-500">2 часа назад</span>
              </div>
            </div>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Новый заказ #12345</p>
                  <p className="text-sm text-gray-500">Клиент: Иван Петров</p>
                </div>
                <span className="text-xs text-gray-500">5 часов назад</span>
              </div>
            </div>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Обновлена цена</p>
                  <p className="text-sm text-gray-500">Перфоратор Bosch GBH 2-26</p>
                </div>
                <span className="text-xs text-gray-500">вчера</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Завершен заказ #12340</p>
                  <p className="text-sm text-gray-500">Клиент: Елена Сидорова</p>
                </div>
                <span className="text-xs text-gray-500">вчера</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
