
import { Tool } from '@/types/types';
import { mockTools } from '@/data/mockTools';

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
};

// Инициализируем localStorage при импорте модуля
initializeLocalStorage();

// API для работы с инструментами
export const toolsApi = {
  // Получить все инструменты
  async getAll(): Promise<Tool[]> {
    await delay(500); // Имитация задержки сети
    
    try {
      const data = localStorage.getItem('api_tools');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка при получении инструментов:', error);
      throw new Error('Не удалось получить список инструментов');
    }
  },
  
  // Получить инструмент по ID
  async getById(id: number): Promise<Tool | null> {
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
  },
  
  // Добавить новый инструмент
  async create(tool: Omit<Tool, 'id'>): Promise<Tool> {
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
      
      return newTool;
    } catch (error) {
      console.error('Ошибка при создании инструмента:', error);
      throw new Error('Не удалось создать новый инструмент');
    }
  },
  
  // Обновить инструмент
  async update(id: number, updates: Partial<Tool>): Promise<Tool> {
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
      
      return updatedTool;
    } catch (error) {
      console.error(`Ошибка при обновлении инструмента ${id}:`, error);
      throw new Error(`Не удалось обновить инструмент ${id}`);
    }
  },
  
  // Удалить инструмент
  async delete(id: number): Promise<boolean> {
    await delay(600);
    
    try {
      const data = localStorage.getItem('api_tools');
      if (!data) throw new Error('Данные не найдены');
      
      const tools: Tool[] = JSON.parse(data);
      const filteredTools = tools.filter(tool => tool.id !== id);
      
      if (filteredTools.length === tools.length) {
        // Инструмент не найден
        return false;
      }
      
      localStorage.setItem('api_tools', JSON.stringify(filteredTools));
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении инструмента ${id}:`, error);
      throw new Error(`Не удалось удалить инструмент ${id}`);
    }
  }
};

// Типы для заказов
export interface Order {
  id: number;
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
    await delay(600);
    
    try {
      const data = localStorage.getItem('api_orders');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
      throw new Error('Не удалось получить список заказов');
    }
  },
  
  // Получить заказ по ID
  async getById(id: number): Promise<Order | null> {
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
  },
  
  // Создать новый заказ
  async create(order: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> {
    await delay(800);
    
    try {
      const data = localStorage.getItem('api_orders');
      const orders: Order[] = data ? JSON.parse(data) : [];
      
      // Генерируем новый ID
      const newId = orders.length > 0 
        ? Math.max(...orders.map(o => o.id)) + 1 
        : 10000; // Начинаем с 10000 для заказов
      
      // Текущая дата в формате YYYY-MM-DD
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Создаем новый заказ
      const newOrder: Order = {
        ...order,
        id: newId,
        date: currentDate,
        status: 'pending',
      };
      
      // Добавляем в "базу данных"
      orders.push(newOrder);
      localStorage.setItem('api_orders', JSON.stringify(orders));
      
      return newOrder;
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      throw new Error('Не удалось создать новый заказ');
    }
  },
  
  // Обновить статус заказа
  async updateStatus(id: number, status: Order['status']): Promise<Order> {
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
      
      return orders[index];
    } catch (error) {
      console.error(`Ошибка при обновлении статуса заказа ${id}:`, error);
      throw new Error(`Не удалось обновить статус заказа ${id}`);
    }
  }
};

// API для аутентификации (упрощенная версия)
export const authApi = {
  // Фиктивные данные пользователя для демонстрации
  demoUser: {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123', // В реальности пароли не хранятся в открытом виде
    name: 'Администратор',
    role: 'admin' as const,
  },
  
  // Авторизация
  async login(email: string, password: string) {
    await delay(800);
    
    // Проверка демо учетных данных
    if (email === this.demoUser.email && password === this.demoUser.password) {
      // Не возвращаем пароль в ответе
      const { password: _, ...userWithoutPassword } = this.demoUser;
      return {
        success: true,
        user: userWithoutPassword,
        token: 'demo_jwt_token' // В реальности здесь был бы JWT токен
      };
    }
    
    return {
      success: false,
      message: 'Неверный email или пароль'
    };
  }
};
