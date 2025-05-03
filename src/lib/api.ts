
import { Tool, User, BookingService, Booking, Address, CartItem } from '@/types/types';
import { mockTools } from '@/data/mockTools';
import { mockServices } from '@/data/mockServices';

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
    await delay(600);
    
    try {
      const data = localStorage.getItem('api_orders');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
      throw new Error('Не удалось получить список заказов');
    }
  },
  
  // Получить заказы пользователя
  async getUserOrders(userId: number): Promise<Order[]> {
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
  async create(order: Omit<Order, 'id' | 'date' | 'status' | 'createdAt'>): Promise<Order> {
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

// API для аутентификации и управления пользователями
export const userApi = {
  // Регистрация нового пользователя
  async register(userData: { email: string, password: string, name: string, phone?: string }): Promise<User> {
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
      
      // Возвращаем данные пользователя (без пароля)
      return newUser;
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Не удалось зарегистрировать пользователя');
    }
  },
  
  // Авторизация пользователя
  async login(email: string, password: string): Promise<{ user: User, token: string }> {
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
      
      return { user, token };
    } catch (error) {
      console.error('Ошибка при входе в систему:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Не удалось войти в систему');
    }
  },
  
  // Получить текущего пользователя по токену
  async getCurrentUser(token: string): Promise<User | null> {
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
  },
  
  // Получить всех пользователей (только для админов)
  async getAllUsers(): Promise<User[]> {
    await delay(500);
    
    try {
      const usersData = localStorage.getItem('api_users');
      if (!usersData) return [];
      
      return JSON.parse(usersData);
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      throw new Error('Не удалось получить список пользователей');
    }
  },
  
  // Обновить профиль пользователя
  async updateProfile(userId: number, updates: Partial<User>): Promise<User> {
    await delay(600);
    
    try {
      const usersData = localStorage.getItem('api_users');
      if (!usersData) throw new Error('Данные не найдены');
      
      const users: User[] = JSON.parse(usersData);
      const index = users.findIndex(u => u.id === userId);
      
      if (index === -1) {
        throw new Error('Пользователь не найден');
      }
      
      // Не позволяем обновлять роль через этот метод
      const { role, ...allowedUpdates } = updates;
      
      // Обновляем пользователя
      users[index] = {
        ...users[index],
        ...allowedUpdates
      };
      
      localStorage.setItem('api_users', JSON.stringify(users));
      
      return users[index];
    } catch (error) {
      console.error(`Ошибка при обновлении профиля пользователя ${userId}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Не удалось обновить профиль');
    }
  },
  
  // Изменить пароль
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
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
      
      return true;
    } catch (error) {
      console.error(`Ошибка при изменении пароля:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Не удалось изменить пароль');
    }
  }
};

// API для работы с услугами
export const servicesApi = {
  // Получить все услуги
  async getAll(): Promise<BookingService[]> {
    await delay(400);
    
    try {
      const data = localStorage.getItem('api_services');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка при получении услуг:', error);
      throw new Error('Не удалось получить список услуг');
    }
  },
  
  // Получить услугу по ID
  async getById(id: number): Promise<BookingService | null> {
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
  },
  
  // Добавить новую услугу (для админов)
  async create(service: Omit<BookingService, 'id'>): Promise<BookingService> {
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
      
      return newService;
    } catch (error) {
      console.error('Ошибка при создании услуги:', error);
      throw new Error('Не удалось создать новую услугу');
    }
  },
  
  // Обновить услугу (для админов)
  async update(id: number, updates: Partial<BookingService>): Promise<BookingService> {
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
      
      return updatedService;
    } catch (error) {
      console.error(`Ошибка при обновлении услуги ${id}:`, error);
      throw new Error(`Не удалось обновить услугу ${id}`);
    }
  },
  
  // Удалить услугу (для админов)
  async delete(id: number): Promise<boolean> {
    await delay(600);
    
    try {
      const data = localStorage.getItem('api_services');
      if (!data) throw new Error('Данные не найдены');
      
      const services: BookingService[] = JSON.parse(data);
      const filteredServices = services.filter(service => service.id !== id);
      
      if (filteredServices.length === services.length) {
        // Услуга не найдена
        return false;
      }
      
      localStorage.setItem('api_services', JSON.stringify(filteredServices));
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении услуги ${id}:`, error);
      throw new Error(`Не удалось удалить услугу ${id}`);
    }
  }
};

// API для работы с бронированиями
export const bookingsApi = {
  // Получить все бронирования (для админов)
  async getAll(): Promise<Booking[]> {
    await delay(500);
    
    try {
      const data = localStorage.getItem('api_bookings');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка при получении бронирований:', error);
      throw new Error('Не удалось получить список бронирований');
    }
  },
  
  // Получить бронирования пользователя
  async getUserBookings(userId: number): Promise<Booking[]> {
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
  },
  
  // Получить бронирование по ID
  async getById(id: number): Promise<Booking | null> {
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
  },
  
  // Создать новое бронирование
  async create(booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> {
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
      
      return newBooking;
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Не удалось создать новое бронирование');
    }
  },
  
  // Обновить статус бронирования
  async updateStatus(id: number, status: Booking['status']): Promise<Booking> {
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
      
      return bookings[index];
    } catch (error) {
      console.error(`Ошибка при обновлении статуса бронирования ${id}:`, error);
      throw new Error(`Не удалось обновить статус бронирования ${id}`);
    }
  },
  
  // Отменить бронирование
  async cancel(id: number): Promise<Booking> {
    return this.updateStatus(id, 'cancelled');
  },
  
  // Получить доступные слоты для бронирования на определенную дату
  async getAvailableSlots(date: string): Promise<string[]> {
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
  }
};
