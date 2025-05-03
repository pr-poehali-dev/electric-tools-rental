
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { systemApi } from '@/lib/api';
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
  Download, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Clock,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface APILog {
  timestamp: string;
  method: string;
  endpoint: string;
  success: boolean;
  message: string;
}

interface Activity {
  id: number;
  type: string;
  details: string;
  userId: number;
  timestamp: string;
}

const APILogs = () => {
  const [logs, setLogs] = useState<APILog[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'activity'>('logs');
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Загрузка логов и активности при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Загружаем логи и активность параллельно
        const [logsData, activityData] = await Promise.all([
          systemApi.getLogs(200),
          systemApi.getActivity(50)
        ]);
        
        setLogs(logsData);
        setActivities(activityData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить данные';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Обновление данных
  const refreshData = async () => {
    setIsRefreshing(true);
    
    try {
      // Загружаем только данные для активной вкладки
      if (activeTab === 'logs') {
        const logsData = await systemApi.getLogs(200);
        setLogs(logsData);
      } else {
        const activityData = await systemApi.getActivity(50);
        setActivities(activityData);
      }
      
      toast({
        title: "Данные обновлены",
        description: "Последние данные успешно загружены"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить данные';
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Экспорт логов в CSV
  const exportLogsToCSV = () => {
    // Формируем заголовки CSV
    const headers = ['Время', 'Метод', 'Endpoint', 'Статус', 'Сообщение'];
    
    // Формируем строки данных
    const dataRows = logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.method,
      log.endpoint,
      log.success ? 'Успешно' : 'Ошибка',
      log.message
    ]);
    
    // Соединяем все в одну строку
    const csvContent = [
      headers.join(','),
      ...dataRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Создаем Blob и ссылку для скачивания
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Настраиваем ссылку
    link.setAttribute('href', url);
    link.setAttribute('download', `api_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    
    // Добавляем ссылку в DOM, эмулируем клик и удаляем
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Экспорт выполнен",
      description: "Логи успешно экспортированы в CSV"
    });
  };
  
  // Фильтрация логов
  const filteredLogs = logs.filter(log => {
    const matchesQuery = 
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMethod = methodFilter ? log.method === methodFilter : true;
    const matchesStatus = statusFilter !== null ? log.success === statusFilter : true;
    
    return matchesQuery && matchesMethod && matchesStatus;
  });
  
  // Фильтрация активности
  const filteredActivities = activities.filter(activity => 
    activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Форматирование метода API запроса
  const formatMethod = (method: string) => {
    switch (method) {
      case 'GET':
        return <span className="font-mono text-blue-600">{method}</span>;
      case 'POST':
        return <span className="font-mono text-green-600">{method}</span>;
      case 'PUT':
        return <span className="font-mono text-orange-600">{method}</span>;
      case 'DELETE':
        return <span className="font-mono text-red-600">{method}</span>;
      default:
        return <span className="font-mono">{method}</span>;
    }
  };
  
  // Форматирование статуса
  const formatStatus = (success: boolean) => {
    return success ? (
      <div className="flex items-center text-green-600">
        <CheckCircle2 className="h-4 w-4 mr-1" />
        <span>Успешно</span>
      </div>
    ) : (
      <div className="flex items-center text-red-600">
        <XCircle className="h-4 w-4 mr-1" />
        <span>Ошибка</span>
      </div>
    );
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    setSearchQuery('');
    setMethodFilter(null);
    setStatusFilter(null);
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Мониторинг API</h1>
            <p className="text-gray-600">Отслеживание запросов API и активности системы</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={refreshData}
              disabled={isRefreshing || isLoading}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Обновление...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Обновить
                </>
              )}
            </Button>
            
            {activeTab === 'logs' && (
              <Button 
                className="flex items-center gap-2"
                onClick={exportLogsToCSV}
                disabled={logs.length === 0}
              >
                <Download className="h-4 w-4" />
                Экспорт в CSV
              </Button>
            )}
          </div>
        </div>
        
        {/* Вкладки */}
        <div className="mb-6">
          <div className="border-b">
            <div className="flex space-x-4">
              <button
                className={`py-2 px-4 border-b-2 ${
                  activeTab === 'logs' 
                    ? 'border-primary text-primary font-medium' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('logs')}
              >
                Логи API
              </button>
              <button
                className={`py-2 px-4 border-b-2 ${
                  activeTab === 'activity' 
                    ? 'border-primary text-primary font-medium' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('activity')}
              >
                Активность системы
              </button>
            </div>
          </div>
        </div>
        
        {/* Поиск и фильтры */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Поиск */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10"
                placeholder={activeTab === 'logs' ? "Поиск по endpoint или сообщению..." : "Поиск по деталям или типу активности..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Фильтры для логов */}
            {activeTab === 'logs' && (
              <>
                <div>
                  <Select 
                    value={methodFilter || ''} 
                    onValueChange={(value) => setMethodFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Все методы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все методы</SelectItem>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select 
                    value={statusFilter === null ? '' : statusFilter ? 'success' : 'error'} 
                    onValueChange={(value) => {
                      if (value === '') {
                        setStatusFilter(null);
                      } else {
                        setStatusFilter(value === 'success');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Все статусы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все статусы</SelectItem>
                      <SelectItem value="success">Успешные</SelectItem>
                      <SelectItem value="error">Ошибки</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {/* Заполнитель для выравнивания при показе вкладки активности */}
            {activeTab === 'activity' && (
              <div className="md:col-span-2">
                <Button 
                  variant="outline" 
                  className="float-right"
                  onClick={resetFilters}
                  disabled={!searchQuery}
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
          
          {/* Кнопка сброса фильтров для логов */}
          {activeTab === 'logs' && (
            <div className="mt-2 flex justify-end">
              <Button 
                variant="outline" 
                onClick={resetFilters}
                disabled={!searchQuery && !methodFilter && statusFilter === null}
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
        
        {/* Ошибка загрузки */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Содержимое вкладки: Логи API */}
        {activeTab === 'logs' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-gray-600">Загрузка логов...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Время</TableHead>
                      <TableHead>Метод</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Сообщение</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">
                            {formatDate(log.timestamp)}
                          </TableCell>
                          <TableCell>{formatMethod(log.method)}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.endpoint}
                          </TableCell>
                          <TableCell>{formatStatus(log.success)}</TableCell>
                          <TableCell>
                            <div className="max-w-[300px] truncate" title={log.message}>
                              {log.message}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          {searchQuery || methodFilter || statusFilter !== null 
                            ? 'Логи не найдены. Попробуйте изменить параметры фильтрации.'
                            : 'Логи отсутствуют.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
        
        {/* Содержимое вкладки: Активность системы */}
        {activeTab === 'activity' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-gray-600">Загрузка активности...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Время</TableHead>
                      <TableHead>Тип активности</TableHead>
                      <TableHead>Детали</TableHead>
                      <TableHead>ID пользователя</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-mono text-xs">
                            {formatDate(activity.timestamp)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>{activity.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{activity.details}</TableCell>
                          <TableCell>{activity.userId}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          {searchQuery 
                            ? 'Активность не найдена. Попробуйте изменить параметры поиска.'
                            : 'Данные об активности отсутствуют.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default APILogs;
