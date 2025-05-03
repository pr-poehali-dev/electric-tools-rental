
import { Tool, User, BookingService, Booking, Address, CartItem } from '@/types/types';
import { mockTools } from '@/data/mockTools';
import { mockServices } from '@/data/mockServices';

// Базовые настройки API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.instrumentpro.com';
const API_TIMEOUT = 15000; // 15 секунд

// Системные сообщения
const API_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Пожалуйста, проверьте подключение к интернету.',
  TIMEOUT: 'Превышено время ожидания ответа от сервера.',
  SERVER_ERROR: 'Ошибка сервера. Пожалуйста, попробуйте позже.',
  NOT_FOUND: 'Запрашиваемые данные не найдены.',
  UNAUTHORIZED: 'Необходима авторизация для выполнения этого действия.',
  FORBIDDEN: 'У вас нет прав для выполнения этого действия.',
  VALIDATION_ERROR: 'Ошибка валидации данных.'
};

// Фиктивная задержка для имитации сетевых запросов
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Инициализация данных в localStorage при первом запуске
const initializeLocalStorage = () => {
  if (!localStorage.getItem('api_tools')) {
    localStorage.setItem('api_tools', JSON.stringify(mockTools));
  }
  
  if (!localStorage.getItem('api_orders')) {
    localStorage.setItem('api_orders', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('api_users')) {
    const demoUsers = [
      {
        id: 1,
        email: 'admin@example.com',
        name: 'Администратор',
        role: 'admin',
        createdAt: '2023-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        email: 'user@example.com',
        name: 'Тестовый пользователь',
        phone: '+7 (999) 123-45-67',
        role: 'user',
        createdAt: '2023-01-02T00:00:00.000Z'
      }
    ];
    localStorage.setItem('api_users', JSON.stringify(demoUsers));
  }
  
  if (!localStorage.getItem('api_auth')) {
    const demoAuth = {
      'admin@example.com': 'admin123',
      'user@example.com': 'user123'
    };
    localStorage.setItem('api_auth', JSON.stringify(demoAuth));
  }
  
  if (!localStorage.getItem('api_services')) {
    localStorage.setItem('api_services', JSON.stringify(mockServices));
  }
  
  if (!localStorage.getItem('api_bookings')) {
    localStorage.setItem('api_bookings', JSON.stringify([]));
  }

  if (!localStorage.getItem('api_logs')) {
    localStorage.setItem('api_logs', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('api_activity')) {
    const demoActivity = [
      {
        id: 1,
        type: 'tool_added',
        details: 'Добавлен новый инструмент: Шуруповерт Bosch GSR 18V-50',
        userId: 1,
        timestamp: new Date(Date.now() - 7200000).toISOString() // 2 часа назад
      },
      {
        id: 2,
        type: 'order_created',
        details: 'Новый заказ #12345 от клиента: Иван Петров',
        userId: 2,
        timestamp: new Date(Date.now() - 18000000).toISOString() // 5 часов назад
      },
      {
        id: 3,
        type: 'tool_updated',
        details: 'Обновлена цена: Перфоратор Bosch GBH 2-26',
        userId: 1,
        timestamp: new Date(Date.now() - 86400000).toISOString() // вчера
      },
      {
        id: 4,
        type: 'order_completed',
        details: 'Завершен заказ #12340 от клиента: Елена Сидорова',
        userId: 1,
        timestamp: new Date(Date.now() - 90000000).toISOString() // вчера
      }
    ];
    localStorage.setItem('api_activity', JSON.stringify(demoActivity));
  }
};

// Инициализируем localStorage при импорте модуля
initializeLocalStorage();

// Логирование API-запросов
const logApiCall = (method: string, endpoint: string, success: boolean, message?: string) => {
  try {
    const logs = JSON.parse(localStorage.getItem('api_logs') || '[]');
    logs.unshift({
      timestamp: new Date().toISOString(),
      method,
      endpoint,
      success,
      message: message || (success ? 'Успешно' : 'Ошибка')
    });
    
    // Ограничиваем количество логов для предотвращения переполнения localStorage
    if (logs.length > 1000) {
      logs.length = 1000;
    }
    
    localStorage.setItem('api_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Error logging API call:', error);
  }
};

// Добавление активности
const addActivity = (activity: {
  type: string;
  details: string;
  userId: number;
}) => {
  try {
    const activities = JSON.parse(localStorage.getItem('api_activity') || '[]');
    
    const newActivity = {
      id: activities.length > 0 ? Math.max(...activities.map((a: any) => a.id)) + 1 : 1,
      ...activity,
      timestamp: new Date().toISOString()
    };
    
    activities.unshift(newActivity);
    
    // Ограничиваем количество записей
    if (activities.length > 100) {
      activities.length = 100;
    }
    
    localStorage.setItem('api_activity', JSON.stringify(activities));
    
    return newActivity;
  } catch (error) {
    console.error('Error adding activity:', error);
    return null;
  }
};

// Базовая функция для выполнения API-запросов
const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  mockFunction?: () => Promise<T>
): Promise<T> => {
  // Для демонстрации используем mock-функции вместо реальных запросов
  if (mockFunction) {
    try {
      const result = await mockFunction();
      logApiCall(method, endpoint, true);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      logApiCall(method, endpoint, false, errorMessage);
      throw error;
    }
  }
  
  // Здесь был бы реальный API-запрос с использованием fetch или axios
  // Для демонстрации генерируем ошибку
  logApiCall(method, endpoint, false, 'Реальный API не реализован');
  throw new Error('API не реализован');
};

// API для работы с инструментами
export const toolsApi = {
  // Получить все инструменты
  async getAll(): Promise<Tool[]> {
    return apiRequest('GET', '/api/tools', null, async () => {
      await delay(500); // Имитация задержки сети
      
      try {
        const data = localStorage.getItem('api_tools');
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Ошибка при получении инструментов:', error);
        throw new Error('Не удалось получить список инструментов');
      }
    });
  },
  
  // Получить инструмент по ID
  async getById(id: number): Promise<Tool | null> {
    return apiRequest('GET', `/api/tools/${id}`, null, async () => {
      await delay(300);
      
      try {
        const data = localStorage.getItem('api_tools');
        if (!data) return null;
        
        const tools: Tool[] = JSON.parse(data);
        return tools.find(tool => tool.id === id) || null;
      } catch (error) {
        console.error(`Ошибка при получении инструмента ${id}:`, error);
        throw new Error(`Не удалось получить информацию об инструменте ${id}`);
      }
    });
  },
  
  // Добавить новый инструмент
  async create(tool: Omit<Tool, 'id'>): Promise<Tool> {
    return apiRequest('POST', '/api/tools', tool, async () => {
      await delay(700);
      
      try {
        const data = localStorage.getItem('api_tools');
        const tools: Tool[] = data ? JSON.parse(data) : [];
        
        // Генерируем новый ID
        const newId = tools.length > 0 ? Math.max(...tools.map(t => t.id)) + 1 : 1;
        
        // Создаем новый инструмент
        const newTool: Tool = {
          ...tool,
          id: newId
        };
        
        // Добавляем в "базу данных"
        tools.push(newTool);
        localStorage.setItem('api_tools', JSON.stringify(tools));
        
        // Добавляем активность
        addActivity({
          type: 'tool_added',
          details: `Добавлен новый инструмент: ${newTool.name}`,
          userId: 1 // В реальном приложении это был бы ID текущего пользователя
        });
        
        return newTool;
      } catch (error) {
        console.error('Ошибка при создании инструмента:', error);
        throw new Error('Не удалось создать новый инструмент');
      }
    });
  },
  
  // Обновить инструмент
  async update(id: number, updates: Partial<Tool>): Promise<Tool> {
    return apiRequest('PUT', `/api/tools/${id}`, updates, async () => {
      await delay(500);
      
      try {
        const data = localStorage.getItem('api_tools');
        if (!data) throw new Error('Данные не найдены');
        
        const tools: Tool[] = JSON.parse(data);
        const index = tools.findIndex(tool => tool.id === id);
        
        if (index === -1) {
          throw new Error(`Инструмент с ID ${id} не найден`);
        }
        
        // Обновляем инструмент
        const updatedTool = {
          ...tools[index],
          ...updates
        };
        
        tools[index] = updatedTool;
        localStorage.setItem('api_tools', JSON.stringify(tools));
        
        // Добавляем активность
        addActivity({
          type: 'tool_updated',
          details: `Обновлен инструмент: ${updatedTool.name}`,
          userId: 1
        });
        
        return updatedTool;
      } catch (error) {
        console.error(`Ошибка при обновлении инструмента ${id}:`, error);
        throw new Error(`Не удалось обновить инструмент ${id}`);
      }
    });
  },
  
  // Удалить инструмент
  async delete(id: number): Promise<boolean> {
    return apiRequest('DELETE', `/api/tools/${id}`, null, async () => {
      await delay(600);
      
      try {
        const data = localStorage.getItem('api_tools');
        if (!data) throw new Error('Данные не найдены');
        
        const tools: Tool[] = JSON.parse(data);
        const toolToDelete = tools.find(tool => tool.id === id);
        const filteredTools = tools.filter(tool => tool.id !== id);
        
        if (filteredTools.length === tools.length) {
          // Инструмент не найден
          return false;
        }
        
        localStorage.setItem('api_tools', JSON.stringify(filteredTools));
        
        // Добавляем активность
        if (toolToDelete) {
          addActivity({
            type: 'tool_deleted',
            details: `Удален инструмент: ${toolToDelete.name}`,
            userId: 1
          });
        }
        
        return true;
      } catch (error) {
        console.error(`Ошибка при удалении инструмента ${id}:`, error);
        throw new Error(`Не удалось удалить инструмент ${id}`);
      }
    });
  },
  
  // Массовое обновление доступности инструментов
  async bulkUpdateAvailability(ids: number[], available: boolean): Promise<boolean> {
    return apiRequest('PUT', '/api/tools/bulk-update', { ids, available }, async () => {
      await delay(800);
      
      try {
        const data = localStorage.getItem('api_tools');
        if (!data) throw new Error('Данные не найдены');
        
        const tools: Tool[] = JSON.parse(data);
        
        // Обновляем каждый инструмент из списка
        let updated = false;
        const updatedTools = tools.map(tool => {
          if (ids.includes(tool.id)) {
            updated = true;
            return { ...tool, available };
          }
          return tool;
        });
        
        if (!updated) {
          throw new Error('Ни один инструмент не был обновлен');
        }
        
        localStorage.setItem('api_tools', JSON.stringify(updatedTools));
        
        // Добавляем активность
        addActivity({
          type: 'tools_bulk_updated',
          details: `Массовое обновление доступности ${ids.length} инструментов`,
          userId: 1
        });
        
        return true;
      } catch (error) {
        console.error('Ошибка при массовом обновлении инструментов:', error);
        throw new Error('Не удалось обновить инструменты');
      }
    });
  },
  
  // Получить статистику по инструментам
  async getStats(): Promise<{ 
    totalTools: number;
    availableTools: number;
    categoryCounts: Record<string, number>;
    priceRanges: Record<string, number>;
  }> {
    return apiRequest('GET', '/api/tools/stats', null, async () => {
      await delay(600);
      
      try {
        const data = localStorage.getItem('api_tools');
        if (!data) throw new Error('Данные не найдены');
        
        const tools: Tool[] = JSON.parse(data);
        
        // Подсчет инструментов по категориям
        const categoryCounts: Record<string, number> = {};
        tools.forEach(tool => {
          categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
        });
        
        // Подсчет инструментов по ценовым диапазонам
        const priceRanges: Record<string, number> = {
          'до 1000 ₽': 0,
          '1000-5000 ₽': 0,
          '5000-10000 ₽': 0,
          'более 10000 ₽': 0
        };
        
        tools.forEach(tool => {
          if (tool.price < 1000) {
            priceRanges['до 1000 ₽']++;
          } else if (tool.price < 5000) {
            priceRanges['1000-5000 ₽']++;
          } else if (tool.price < 10000) {
            priceRanges['5000-10000 ₽']++;
          } else {
            priceRanges['более 10000 ₽']++;
          }
        });
        
        return {
          totalTools: tools.length,
          availableTools: tools.filter(tool => tool.available).length,
          categoryCounts,
          priceRanges
        };
      } catch (error) {
        console.error('Ошибка при получении статистики по инструментам:', error);
        throw new Error('Не удалось получить статистику по инструментам');
      }
    });
  }
};

// Типы для заказов
export interface Order {
  id: number;
  userId?: number;
  customer: string;
  email: string;
  phone: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  delivery: string;
  address: string;
  comment: string;
  paymentMethod?: 'cash' | 'card' | 'online';
  createdAt: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  days: number;
}

// API для работы с заказами
export const ordersApi = {
  // Получить все заказы
  async getAll(): Promise<Order[]> {
    return apiRequest('GET', '/api/orders', null, async () => {
      await delay(600);
      
      try {
        const data = localStorage.getItem('api_orders');
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        throw new Error('Не удалось получить список заказов');
      }
    });
  },
  
  // Получить заказы пользователя
  async getUserOrders(userId: number): Promise<Order[]> {
    return apiRequest('GET', `/api/users/${userId}/orders`, null, async () => {
      await delay(500);
      
      try {
        const data = localStorage.getItem('api_orders');
        if (!data) return [];
        
        const orders: Order[] = JSON.parse(data);
        return orders.filter(order => order.userId === userId);
      } catch (error) {
        console.error(`Ошибка при получении заказов пользователя ${userId}:`, error);
        throw new Error('Не удалось получить заказы пользователя');
      }
    });
  },
  
  // Получить заказ по ID
  async getById(id: number): Promise<Order | null> {
    return apiRequest('GET', `/api/orders/${id}`, null, async () => {
      await delay(300);
      
      try {
        const data = localStorage.getItem('api_orders');
        if (!data) return null;
        
        const orders: Order[] = JSON.parse(data);
        return orders.find(order => order.id === id) || null;
      } catch (error) {
        console.error(`Ошибка при получении заказа ${id}:`, error);
        throw new Error(`Не удалось получить информацию о заказе ${id}`);
      }
    });
  },
  
  // Создать новый заказ
  async create(order: Omit<Order, 'id' | 'date' | 'status' | 'createdAt'>): Promise<Order> {
    return apiRequest('POST', '/api/orders', order, async () => {
      await delay(800);
      
      try {
        const data = localStorage.getItem('api_orders');
        const orders: Order[] = data ? JSON.parse(data) : [];
        
        // Генерируем новый ID
        const newId = orders.length > 0 
          ? Math.max(...orders.map(o => o.id)) + 1 
          : 10000; // Начинаем с 10000 для заказов
        
        // Текущая дата в формате ISO
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        
        // Создаем новый заказ
        const newOrder: Order = {
          ...order,
          id: newId,
          date: currentDate,
          status: 'pending',
          createdAt: now.toISOString()
        };
        
        // Добавляем в "базу данных"
        orders.push(newOrder);
        localStorage.setItem('api_orders', JSON.stringify(orders));
        
        // Добавляем активность
        addActivity({
          type: 'order_created',
          details: `Новый заказ #${newOrder.id} от клиента: ${newOrder.customer}`,
          userId: newOrder.userId || 1
        });
        
        return newOrder;
      } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        throw new Error('Не удалось создать новый заказ');
      }
    });
  },
  
  // Обновить статус заказа
  async updateStatus(id: number, status: Order['status']): Promise<Order> {
    return apiRequest('PUT', `/api/orders/${id}/status`, { status }, async () => {
      await delay(400);
      
      try {
        const data = localStorage.getItem('api_orders');
        if (!data) throw new Error('Данные не найдены');
        
        const orders: Order[] = JSON.parse(data);
        const index = orders.findIndex(order => order.id === id);
        
        if (index === -1) {
          throw new Error(`Заказ с ID ${id} не найден`);
        }
        
        // Обновляем статус
        orders[index].status = status;
        localStorage.setItem('api_orders', JSON.stringify(orders));
        
        // Добавляем активность
        const activityType = `order_${status}`;
        addActivity({
          type: activityType,
          details: `Заказ #${id} изменил статус на "${status}"`,
          userId: 1
        });
        
        return orders[index];
      } catch (error) {
        console.error(`Ошибка при обновлении статуса заказа ${id}:`, error);
        throw new Error(`Не удалось обновить статус заказа ${id}`);
      }
    });
  },
  
  // Получить статистику по заказам
  async getStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<string, number>;
    dailyOrders: Array<{ date: string; count: number; revenue: number }>;
  }> {
    return apiRequest('GET', `/api/orders/stats?period=${period}`, null, async () => {
      await delay(700);
      
      try {
        const data = localStorage.getItem('api_orders');
        if (!data) throw new Error('Данные не найдены');
        
        const orders: Order[] = JSON.parse(data);
        
        // Начальная дата для фильтрации заказов
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
          case 'day':
            startDate.setDate(now.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        // Фильтруем заказы по периоду
        const filteredOrders = orders.filter(order => 
          new Date(order.createdAt) >= startDate && new Date(order.createdAt) <= now
        );
        
        // Подсчет заказов по статусам
        const ordersByStatus: Record<string, number> = {
          pending: 0,
          processing: 0,
          completed: 0,
          cancelled: 0
        };
        
        filteredOrders.forEach(order => {
          ordersByStatus[order.status]++;
        });
        
        // Общая выручка
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        
        // Средняя стоимость заказа
        const averageOrderValue = filteredOrders.length > 0 
          ? totalRevenue / filteredOrders.length 
          : 0;
        
        // Группировка заказов по дням
        const dailyOrdersMap = new Map<string, { count: number; revenue: number }>();
        
        // Заполнение дней в зависимости от выбранного периода
        const daysToGenerate = period === 'day' ? 24 : // По часам для дня
          period === 'week' ? 7 : // По дням для недели
          period === 'month' ? 30 : // По дням для месяца
          12; // По месяцам для года
        
        // Генерация пустых данных для всех дней в периоде
        if (period === 'day') {
          // По часам для дня
          for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            dailyOrdersMap.set(`${hour}:00`, { count: 0, revenue: 0 });
          }
        } else if (period === 'week' || period === 'month') {
          // По дням для недели или месяца
          for (let i = 0; i < daysToGenerate; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (daysToGenerate - 1 - i));
            const dateString = date.toISOString().split('T')[0];
            dailyOrdersMap.set(dateString, { count: 0, revenue: 0 });
          }
        } else {
          // По месяцам для года
          for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - (11 - i));
            const monthString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            dailyOrdersMap.set(monthString, { count: 0, revenue: 0 });
          }
        }
        
        // Заполнение данными из заказов
        filteredOrders.forEach(order => {
          const orderDate = new Date(order.createdAt);
          
          let key: string;
          
          if (period === 'day') {
            // Группировка по часам
            key = `${orderDate.getHours().toString().padStart(2, '0')}:00`;
          } else if (period === 'week' || period === 'month') {
            // Группировка по дням
            key = orderDate.toISOString().split('T')[0];
          } else {
            // Группировка по месяцам
            key = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
          }
          
          if (dailyOrdersMap.has(key)) {
            const current = dailyOrdersMap.get(key)!;
            dailyOrdersMap.set(key, {
              count: current.count + 1,
              revenue: current.revenue + order.total
            });
          } else {
            dailyOrdersMap.set(key, {
              count: 1,
              revenue: order.total
            });
          }
        });
        
        // Преобразование Map в массив
        const dailyOrders = Array.from(dailyOrdersMap.entries()).map(([date, data]) => ({
          date,
          count: data.count,
          revenue: data.revenue
        }));
        
        return {
          totalOrders: filteredOrders.length,
          totalRevenue,
          averageOrderValue,
          ordersByStatus,
          dailyOrders
        };
      } catch (error) {
        console.error('Ошибка при получении статистики по заказам:', error);
        throw new Error('Не удалось получить статистику по заказам');
      }
    });
  }
};

// API для аутентификации и управления пользователями
export const userApi = {
  // Регистрация нового пользователя
  async register(userData: { email: string, password: string, name: string, phone?: string }): Promise<User> {
    return apiRequest('POST', '/api/auth/register', userData, async () => {
      await delay(800);
      
      try {
        // Проверка существования пользователя с таким email
        const authData = localStorage.getItem('api_auth');
        const usersData = localStorage.getItem('api_users');
        
        if (!authData || !usersData) {
          throw new Error('Ошибка базы данных');
        }
        
        const auth = JSON.parse(authData);
        const users: User[] = JSON.parse(usersData);
        
        if (auth[userData.email]) {
          throw new Error('Пользователь с таким email уже существует');
        }
        
        // Генерируем ID для нового пользователя
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        // Создаем нового пользователя
        const newUser: User = {
          id: newId,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        
        // Сохраняем пользователя
        users.push(newUser);
        localStorage.setItem('api_users', JSON.stringify(users));
        
        // Сохраняем учетные данные
        auth[userData.email] = userData.password;
        localStorage.setItem('api_auth', JSON.stringify(auth));
        
        // Добавляем активность
        addActivity({
          type: 'user_registered',
          details: `Зарегистрирован новый пользователь: ${newUser.name}`,
          userId: newUser.id
        });
        
        // Возвращаем данные пользователя (без пароля)
        return newUser;
      } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Не удалось зарегистрировать пользователя');
      }
    });
  },
  
  // Авторизация пользователя
  async login(email: string, password: string): Promise<{ user: User, token: string }> {
    return apiRequest('POST', '/api/auth/login', { email, password }, async () => {
      await delay(600);
      
      try {
        const authData = localStorage.getItem('api_auth');
        const usersData = localStorage.getItem('api_users');
        
        if (!authData || !usersData) {
          throw new Error('Ошибка базы данных');
        }
        
        const auth = JSON.parse(authData);
        const users: User[] = JSON.parse(usersData);
        
        // Проверка учетных данных
        if (!auth[email] || auth[email] !== password) {
          throw new Error('Неверный email или пароль');
        }
        
        // Находим пользователя
        const user = users.find(u => u.email === email);
        
        if (!user) {
          throw new Error('Пользователь не найден');
        }
        
        // Генерируем токен (в реальном приложении это был бы JWT)
        const token = `token_${Date.now()}_${user.id}`;
        
        // Добавляем активность
        addActivity({
          type: 'user_login',
          details: `Пользователь ${user.name} вошел в систему`,
          userId: user.id
        });
        
        return { user, token };
      } catch (error) {
        console.error('Ошибка при входе в систему:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Не удалось войти в систему');
      }
    });
  },
  
  // Получить текущего пользователя по токену
  async getCurrentUser(token: string): Promise<User | null> {
    return apiRequest('GET', '/api/auth/me', { token }, async () => {
      await delay(300);
      
      try {
        // В реальном приложении здесь была бы проверка JWT
        // Для демо просто извлекаем ID из токена
        const matches = token.match(/token_\d+_(\d+)/);
        if (!matches) return null;
        
        const userId = parseInt(matches[1]);
        
        const usersData = localStorage.getItem('api_users');
        if (!usersData) return null;
        
        const users: User[] = JSON.parse(usersData);
        return users.find(u => u.id === userId) || null;
      } catch (error) {
        console.error('Ошибка при получении текущего пользователя:', error);
        return null;
      }
    });
  },
  
  // Получить всех пользователей (только для админов)
  async getAllUsers(): Promise<User[]> {
    return apiRequest('GET', '/api/admin/users', null, async () => {
      await delay(500);
      
      try {
        const usersData = localStorage.getItem('api_users');
        if (!usersData) return [];
        
        return JSON.parse(usersData);
      } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
        throw new Error('Не удалось получить список пользователей');
      }
    });
  },
  
  // Обновить профиль пользователя
  async updateProfile(userId: number, updates: Partial<User>): Promise<User> {
    return apiRequest('PUT', `/api/users/${userId}`, updates, async () => {
      await delay(600);
      
      try {
        const usersData = localStorage.getItem('api_users');
        if (!usersData) throw new Error('Данные не найдены');
        
        const users: User[] = JSON.parse(usersData);
        const index = users.findIndex(u => u.id === userId);
        
        if (index === -1) {
          throw new Error('Пользователь не найден');
        }
        
        // Обновляем пользователя
        users[index] = {
          ...users[index],
          ...updates
        };
        
        localStorage.setItem('api_users', JSON.stringify(users));
        
        // Добавляем активность
        addActivity({
          type: 'user_updated',
          details: `Обновлен профиль пользователя: ${users[index].name}`,
          userId: users[index].id
        });
        
        return users[index];
      } catch (error) {
        console.error(`Ошибка при обновлении профиля пользователя ${userId}:`, error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Не удалось обновить профиль');
      }
    });
  },
  
  // Изменить пароль
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    return apiRequest('PUT', `/api/users/${userId}/password`, { currentPassword, newPassword }, async () => {
      await delay(700);
      
      try {
        const authData = localStorage.getItem('api_auth');
        const usersData = localStorage.getItem('api_users');
        
        if (!authData || !usersData) {
          throw new Error('Ошибка базы данных');
        }
        
        const auth = JSON.parse(authData);
        const users: User[] = JSON.parse(usersData);
        
        const user = users.find(u => u.id === userId);
        
        if (!user) {
          throw new Error('Пользователь не найден');
        }
        
        // Проверяем текущий пароль
        if (auth[user.email] !== currentPassword) {
          throw new Error('Неверный текущий пароль');
        }
        
        // Обновляем пароль
        auth[user.email] = newPassword;
        localStorage.setItem('api_auth', JSON.stringify(auth));
        
        // Добавляем активность
        addActivity({
          type: 'password_changed',
          details: `Пользователь ${user.name} изменил пароль`,
          userId: user.id
        });
        
        return true;
      } catch (error) {
        console.error(`Ошибка при изменении пароля:`, error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Не удалось изменить пароль');
      }
    });
  },
  
  // Получить статистику по пользователям
  async getUserStats(): Promise<{
    totalUsers: number;
    newUsers: {
      day: number;
      week: number;
      month: number;
    },
    usersByRole: Record<string, number>;
    topActiveUsers: Array<{ 
      id: number; 
      name: string; 
      email: string; 
      ordersCount: number 
    }>;
  }> {
    return apiRequest('GET', '/api/admin/users/stats', null, async () => {
      await delay(600);
      
      try {
        const usersData = localStorage.getItem('api_users');
        const ordersData = localStorage.getItem('api_orders');
        
        if (!usersData) throw new Error('Данные пользователей не найдены');
        
        const users: User[] = JSON.parse(usersData);
        const orders: Order[] = ordersData ? JSON.parse(ordersData) : [];
        
        // Текущая дата для расчета новых пользователей
        const now = new Date();
        const dayAgo = new Date(now);
        dayAgo.setDate(now.getDate() - 1);
        
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        
        // Подсчет новых пользователей
        const newUsers = {
          day: users.filter(user => new Date(user.createdAt) >= dayAgo).length,
          week: users.filter(user => new Date(user.createdAt) >= weekAgo).length,
          month: users.filter(user => new Date(user.createdAt) >= monthAgo).length
        };
        
        // Подсчет пользователей по ролям
        const usersByRole: Record<string, number> = {};
        users.forEach(user => {
          usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
        });
        
        // Подсчет количества заказов для каждого пользователя
        const userOrderCounts: Record<number, number> = {};
        orders.forEach(order => {
          if (order.userId) {
            userOrderCounts[order.userId] = (userOrderCounts[order.userId] || 0) + 1;
          }
        });
        
        // Получение топ-5 активных пользователей
        const topActiveUsers = users
          .map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            ordersCount: userOrderCounts[user.id] || 0
          }))
          .sort((a, b) => b.ordersCount - a.ordersCount)
          .slice(0, 5);
        
        return {
          totalUsers: users.length,
          newUsers,
          usersByRole,
          topActiveUsers
        };
      } catch (error) {
        console.error('Ошибка при получении статистики по пользователям:', error);
        throw new Error('Не удалось получить статистику по пользователям');
      }
    });
  }
};

// API для работы с услугами
export const servicesApi = {
  // Получить все услуги
  async getAll(): Promise<BookingService[]> {
    return apiRequest('GET', '/api/services', null, async () => {
      await delay(400);
      
      try {
        const data = localStorage.getItem('api_services');
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        throw new Error('Не удалось получить список услуг');
      }
    });
  },
  
  // Получить услугу по ID
  async getById(id: number): Promise<BookingService | null> {
    return apiRequest('GET', `/api/services/${id}`, null, async () => {
      await delay(300);
      
      try {
        const data = localStorage.getItem('api_services');
        if (!data) return null;
        
        const services: BookingService[] = JSON.parse(data);
        return services.find(service => service.id === id) || null;
      } catch (error) {
        console.error(`Ошибка при получении услуги ${id}:`, error);
        throw new Error(`Не удалось получить информацию об услуге ${id}`);
      }
    });
  },
  
  // Добавить новую услугу (для админов)
  async create(service: Omit<BookingService, 'id'>): Promise<BookingService> {
    return apiRequest('POST', '/api/admin/services', service, async () => {
      await delay(600);
      
      try {
        const data = localStorage.getItem('api_services');
        const services: BookingService[] = data ? JSON.parse(data) : [];
        
        // Генерируем новый ID
        const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
        
        // Создаем новую услугу
        const newService: BookingService = {
          ...service,
          id: newId
        };
        
        // Добавляем в "базу данных"
        services.push(newService);
        localStorage.setItem('api_services', JSON.stringify(services));
        
        // Добавляем активность
        addActivity({
          type: 'service_added',
          details: `Добавлена новая услуга: ${newService.name}`,
          userId: 1
        });
        
        return newService;
      } catch (error) {
        console.error('Ошибка при создании услуги:', error);
        throw new Error('Не удалось создать новую услугу');
      }
    });
  },
  
  // Обновить услугу (для админов)
  async update(id: number, updates: Partial<BookingService>): Promise<BookingService> {
    return apiRequest('PUT', `/api/admin/services/${id}`, updates, async () => {
      await delay(500);
      
      try {
        const data = localStorage.getItem('api_services');
        if (!data) throw new Error('Данные не найдены');
        
        const services: BookingService[] = JSON.parse(data);
        const index = services.findIndex(service => service.id === id);
        
        if (index === -1) {
          throw new Error(`Услуга с ID ${id} не найдена`);
        }
        
        // Обновляем услугу
        const updatedService = {
          ...services[index],
          ...updates
        };
        
        services[index] = updatedService;
        localStorage.setItem('api_services', JSON.stringify(services));
        
        // Добавляем активность
        addActivity({
          type: 'service_updated',
          details: `Обновлена услуга: ${updatedService.name}`,
          userId: 1
        });
        
        return updatedService;
      } catch (error) {
        console.error(`Ошибка при обновлении услуги ${id}:`, error);
        throw new Error(`Не удалось обновить услугу ${id}`);
      }
    });
  },
  
  // Удалить услугу (для админов)
  async delete(id: number): Promise<boolean> {
    return apiRequest('DELETE', `/api/admin/services/${id}`, null, async () => {
      await delay(600);
      
      try {
        const data = localStorage.getItem('api_services');
        if (!data) throw new Error('Данные не найдены');
        
        const services: BookingService[] = JSON.parse(data);
        const serviceToDelete = services.find(service => service.id === id);
        const filteredServices = services.filter(service => service.id !== id);
        
        if (filteredServices.length === services.length) {
          // Услуга не найдена
          return false;
        }
        
        localStorage.setItem('api_services', JSON.stringify(filteredServices));
        
        // Добавляем активность
        if (serviceToDelete) {
          addActivity({
            type: 'service_deleted',
            details: `Удалена услуга: ${serviceToDelete.name}`,
            userId: 1
          });
        }
        
        return true;
      } catch (error) {
        console.error(`Ошибка при удалении услуги ${id}:`, error);
        throw new Error(`Не удалось удалить услугу ${id}`);
      }
    });
  },
  
  // Массовое обновление доступности услуг
  async bulkUpdateAvailability(ids: number[], available: boolean): Promise<boolean> {
    return apiRequest('PUT', '/api/admin/services/bulk-update', { ids, available }, async () => {
      await delay(700);
      
      try {
        const data = localStorage.getItem('api_services');
        if (!data) throw new Error('Данные не найдены');
        
        const services: BookingService[] = JSON.parse(data);
        
        // Обновляем каждую услугу из списка
        let updated = false;
        const updatedServices = services.map(service => {
          if (ids.includes(service.id)) {
            updated = true;
            return { ...service, available };
          }
          return service;
        });
        
        if (!updated) {
          throw new Error('Ни одна услуга не была обновлена');
        }
        
        localStorage.setItem('api_services', JSON.stringify(updatedServices));
        
        // Добавляем активность
        addActivity({
          type: 'services_bulk_updated',
          details: `Массовое обновление доступности ${ids.length} услуг`,
          userId: 1
        });
        
        return true;
      } catch (error) {
        console.error('Ошибка при массовом обновлении услуг:', error);
        throw new Error('Не удалось обновить услуги');
      }
    });
  },
  
  // Получить статистику по услугам
  async getStats(): Promise<{
    totalServices: number;
    availableServices: number;
    categoryCounts: Record<string, number>;
    avgDuration: number;
    priceRanges: Record<string, number>;
  }> {
    return apiRequest('GET', '/api/admin/services/stats', null, async () => {
      await delay(500);
      
      try {
        const data = localStorage.getItem('api_services');
        if (!data) throw new Error('Данные не найдены');
        
        const services: BookingService[] = JSON.parse(data);
        
        // Подсчет услуг по категориям
        const categoryCounts: Record<string, number> = {};
        services.forEach(service => {
          categoryCounts[service.category] = (categoryCounts[service.category] || 0) + 1;
        });
        
        // Средняя продолжительность
        const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
        const avgDuration = services.length > 0 ? totalDuration / services.length : 0;
        
        // Подсчет услуг по ценовым диапазонам
        const priceRanges: Record<string, number> = {
          'до 1000 ₽': 0,
          '1000-2000 ₽': 0,
          '2000-3000 ₽': 0,
          'более 3000 ₽': 0
        };
        
        services.forEach(service => {
          if (service.price < 1000) {
            priceRanges['до 1000 ₽']++;
          } else if (service.price < 2000) {
            priceRanges['1000-2000 ₽']++;
          } else if (service.price < 3000) {
            priceRanges['2000-3000 ₽']++;
          } else {
            priceRanges['более 3000 ₽']++;
          }
        });
        
        return {
          totalServices: services.length,
          availableServices: services.filter(service => service.available).length,
          categoryCounts,
          avgDuration,
          priceRanges
        };
      } catch (error) {
        console.error('Ошибка при получении статистики по услугам:', error);
        throw new Error('Не удалось получить статистику по услугам');
      }
    });
  }
};

// API для работы с бронированиями
export const bookingsApi = {
  // Получить все бронирования (для админов)
  async getAll(): Promise<Booking[]> {
    return apiRequest('GET', '/api/admin/bookings', null, async () => {
      await delay(500);
      
      try {
        const data = localStorage.getItem('api_bookings');
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Ошибка при получении бронирований:', error);
        throw new Error('Не удалось получить список бронирований');
      }
    });
  },
  
  // Получить бронирования пользователя
  async getUserBookings(userId: number): Promise<Booking[]> {
    return apiRequest('GET', `/api/users/${userId}/bookings`, null, async () => {
      await delay(400);
      
      try {
        const data = localStorage.getItem('api_bookings');
        if (!data) return [];
        
        const bookings: Booking[] = JSON.parse(data);
        return bookings.filter(booking => booking.userId === userId);
      } catch (error) {
        console.error(`Ошибка при получении бронирований пользователя ${userId}:`, error);
        throw new Error('Не удалось получить бронирования пользователя');
      }
    });
  },
  
  // Получить бронирование по ID
  async getById(id: number): Promise<Booking | null> {
    return apiRequest('GET', `/api/bookings/${id}`, null, async () => {
      await delay(300);
      
      try {
        const data = localStorage.getItem('api_bookings');
        if (!data) return null;
        
        const bookings: Booking[] = JSON.parse(data);
        return bookings.find(booking => booking.id === id) || null;
      } catch (error) {
        console.error(`Ошибка при получении бронирования ${id}:`, error);
        throw new Error(`Не удалось получить информацию о бронировании ${id}`);
      }
    });
  },
  
  // Создать новое бронирование
  async create(booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> {
    return apiRequest('POST', '/api/bookings', booking, async () => {
      await delay(700);
      
      try {
        const data = localStorage.getItem('api_bookings');
        const bookings: Booking[] = data ? JSON.parse(data) : [];
        
        // Генерируем новый ID
        const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
        
        // Текущая дата в формате ISO
        const createdAt = new Date().toISOString();
        
        // Создаем новое бронирование
        const newBooking: Booking = {
          ...booking,
          id: newId,
          status: 'pending',
          createdAt
        };
        
        // Проверяем доступность времени
        const existingBookings = bookings.filter(b => 
          b.date === booking.date && 
          b.time === booking.time && 
          b.status !== 'cancelled'
        );
        
        if (existingBookings.length > 0) {
          throw new Error('Выбранное время уже занято');
        }
        
        // Добавляем в "базу данных"
        bookings.push(newBooking);
        localStorage.setItem('api_bookings', JSON.stringify(bookings));
        
        // Добавляем активность
        addActivity({
          type: 'booking_created',
          details: `Создано новое бронирование: ${newBooking.serviceName} на ${newBooking.date} ${newBooking.time}`,
          userId: newBooking.userId
        });
        
        return newBooking;
      } catch (error) {
        console.error('Ошибка при создании бронирования:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Не удалось создать новое бронирование');
      }
    });
  },
  
  // Обновить статус бронирования
  async updateStatus(id: number, status: Booking['status']): Promise<Booking> {
    return apiRequest('PUT', `/api/bookings/${id}/status`, { status }, async () => {
      await delay(400);
      
      try {
        const data = localStorage.getItem('api_bookings');
        if (!data) throw new Error('Данные не найдены');
        
        const bookings: Booking[] = JSON.parse(data);
        const index = bookings.findIndex(booking => booking.id === id);
        
        if (index === -1) {
          throw new Error(`Бронирование с ID ${id} не найдено`);
        }
        
        // Обновляем статус
        bookings[index].status = status;
        localStorage.setItem('api_bookings', JSON.stringify(bookings));
        
        // Добавляем активность
        const activityType = `booking_${status}`;
        addActivity({
          type: activityType,
          details: `Бронирование #${id} изменило статус на "${status}"`,
          userId: bookings[index].userId
        });
        
        return bookings[index];
      } catch (error) {
        console.error(`Ошибка при обновлении статуса бронирования ${id}:`, error);
        throw new Error(`Не удалось обновить статус бронирования ${id}`);
      }
    });
  },
  
  // Отменить бронирование
  async cancel(id: number): Promise<Booking> {
    return this.updateStatus(id, 'cancelled');
  },
  
  // Получить доступные слоты для бронирования на определенную дату
  async getAvailableSlots(date: string): Promise<string[]> {
    return apiRequest('GET', `/api/bookings/available-slots?date=${date}`, null, async () => {
      await delay(400);
      
      try {
        // Получаем все бронирования на эту дату
        const data = localStorage.getItem('api_bookings');
        const bookings: Booking[] = data ? JSON.parse(data) : [];
        
        const bookedSlots = bookings
          .filter(b => b.date === date && b.status !== 'cancelled')
          .map(b => b.time);
        
        // Генерируем все возможные слоты с 9:00 до 18:00 с шагом 1 час
        const allSlots = [];
        for (let hour = 9; hour < 18; hour++) {
          allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        
        // Возвращаем только доступные слоты
        return allSlots.filter(slot => !bookedSlots.includes(slot));
      } catch (error) {
        console.error(`Ошибка при получении доступных слотов на ${date}:`, error);
        throw new Error('Не удалось получить доступные слоты');
      }
    });
  },
  
  // Получить статистику по бронированиям
  async getStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    totalBookings: number;
    bookingsByStatus: Record<string, number>;
    bookingsByService: Record<string, number>;
    dailyBookings: Array<{ date: string; count: number }>;
    popularTimeSlots: Array<{ time: string; count: number }>;
  }> {
    return apiRequest('GET', `/api/admin/bookings/stats?period=${period}`, null, async () => {
      await delay(600);
      
      try {
        const data = localStorage.getItem('api_bookings');
        if (!data) throw new Error('Данные не найдены');
        
        const bookings: Booking[] = JSON.parse(data);
        
        // Начальная дата для фильтрации бронирований
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
          case 'day':
            startDate.setDate(now.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        // Преобразуем даты в строки для сравнения
        const startDateStr = startDate.toISOString().split('T')[0];
        
        // Фильтруем бронирования по периоду
        const filteredBookings = bookings.filter(booking => 
          booking.date >= startDateStr
        );
        
        // Подсчет бронирований по статусам
        const bookingsByStatus: Record<string, number> = {
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0
        };
        
        filteredBookings.forEach(booking => {
          bookingsByStatus[booking.status]++;
        });
        
        // Подсчет бронирований по услугам
        const bookingsByService: Record<string, number> = {};
        filteredBookings.forEach(booking => {
          bookingsByService[booking.serviceName] = (bookingsByService[booking.serviceName] || 0) + 1;
        });
        
        // Группировка бронирований по дням
        const dailyBookingsMap = new Map<string, number>();
        
        // Заполнение дней в зависимости от выбранного периода
        const daysToGenerate = period === 'day' ? 24 : // По часам для дня
          period === 'week' ? 7 : // По дням для недели
          period === 'month' ? 30 : // По дням для месяца
          12; // По месяцам для года
        
        // Генерация пустых данных для всех дней в периоде
        if (period === 'day') {
          // По часам для дня
          for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            dailyBookingsMap.set(`${hour}:00`, 0);
          }
        } else if (period === 'week' || period === 'month') {
          // По дням для недели или месяца
          for (let i = 0; i < daysToGenerate; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (daysToGenerate - 1 - i));
            const dateString = date.toISOString().split('T')[0];
            dailyBookingsMap.set(dateString, 0);
          }
        } else {
          // По месяцам для года
          for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - (11 - i));
            const monthString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            dailyBookingsMap.set(monthString, 0);
          }
        }
        
        // Заполнение данными из бронирований
        filteredBookings.forEach(booking => {
          const bookingDate = booking.date;
          const bookingTime = booking.time;
          
          let key: string;
          
          if (period === 'day') {
            // Группировка по часам
            key = bookingTime;
          } else if (period === 'week' || period === 'month') {
            // Группировка по дням
            key = bookingDate;
          } else {
            // Группировка по месяцам
            key = bookingDate.substring(0, 7); // YYYY-MM
          }
          
          if (dailyBookingsMap.has(key)) {
            dailyBookingsMap.set(key, dailyBookingsMap.get(key)! + 1);
          } else {
            dailyBookingsMap.set(key, 1);
          }
        });
        
        // Преобразование Map в массив
        const dailyBookings = Array.from(dailyBookingsMap.entries()).map(([date, count]) => ({
          date,
          count
        }));
        
        // Популярные временные слоты
        const timeSlotMap = new Map<string, number>();
        filteredBookings.forEach(booking => {
          timeSlotMap.set(booking.time, (timeSlotMap.get(booking.time) || 0) + 1);
        });
        
        const popularTimeSlots = Array.from(timeSlotMap.entries())
          .map(([time, count]) => ({ time, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        return {
          totalBookings: filteredBookings.length,
          bookingsByStatus,
          bookingsByService,
          dailyBookings,
          popularTimeSlots
        };
      } catch (error) {
        console.error('Ошибка при получении статистики по бронированиям:', error);
        throw new Error('Не удалось получить статистику по бронированиям');
      }
    });
  }
};

// API для работы с логами и активностью системы
export const systemApi = {
  // Получить логи API-запросов
  async getLogs(limit = 100): Promise<Array<{
    timestamp: string;
    method: string;
    endpoint: string;
    success: boolean;
    message: string;
  }>> {
    return apiRequest('GET', `/api/admin/logs?limit=${limit}`, null, async () => {
      await delay(400);
      
      try {
        const data = localStorage.getItem('api_logs');
        const logs = data ? JSON.parse(data) : [];
        return logs.slice(0, limit);
      } catch (error) {
        console.error('Ошибка при получении логов:', error);
        throw new Error('Не удалось получить логи');
      }
    });
  },
  
  // Получить последние действия в системе
  async getActivity(limit = 10): Promise<Array<{
    id: number;
    type: string;
    details: string;
    userId: number;
    timestamp: string;
  }>> {
    return apiRequest('GET', `/api/admin/activity?limit=${limit}`, null, async () => {
      await delay(500);
      
      try {
        const data = localStorage.getItem('api_activity');
        const activities = data ? JSON.parse(data) : [];
        return activities.slice(0, limit);
      } catch (error) {
        console.error('Ошибка при получении активности:', error);
        throw new Error('Не удалось получить активность');
      }
    });
  },
  
  // Получить общую статистику системы
  async getSystemOverview(): Promise<{
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
  }> {
    return apiRequest('GET', '/api/admin/system-overview', null, async () => {
      await delay(800);
      
      try {
        // Получаем все необходимые данные
        const usersData = localStorage.getItem('api_users');
        const ordersData = localStorage.getItem('api_orders');
        const bookingsData = localStorage.getItem('api_bookings');
        const toolsData = localStorage.getItem('api_tools');
        const servicesData = localStorage.getItem('api_services');
        const activityData = localStorage.getItem('api_activity');
        
        // Преобразуем данные
        const users = usersData ? JSON.parse(usersData) : [];
        const orders = ordersData ? JSON.parse(ordersData) : [];
        const bookings = bookingsData ? JSON.parse(bookingsData) : [];
        const tools = toolsData ? JSON.parse(toolsData) : [];
        const services = servicesData ? JSON.parse(servicesData) : [];
        const activities = activityData ? JSON.parse(activityData) : [];
        
        // Расчет общей выручки
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        
        // Получение последних активностей
        const recentActivity = activities
          .slice(0, 5)
          .map(({ id, type, details, timestamp }) => ({
            id,
            type,
            details,
            timestamp
          }));
        
        return {
          usersCount: users.length,
          ordersCount: orders.length,
          bookingsCount: bookings.length,
          toolsCount: tools.length,
          servicesCount: services.length,
          totalRevenue,
          recentActivity
        };
      } catch (error) {
        console.error('Ошибка при получении общей статистики:', error);
        throw new Error('Не удалось получить общую статистику системы');
      }
    });
  }
};
