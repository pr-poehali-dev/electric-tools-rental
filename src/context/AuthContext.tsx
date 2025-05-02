
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/types';

interface AuthContextProps {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Демо пользователь для тестирования (в реальном приложении это было бы в базе данных)
const demoUser: User = {
  id: 1,
  email: 'admin@example.com',
  password: 'admin123', // в реальном приложении храним хеш, а не сам пароль
  role: 'admin',
  name: 'Администратор',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // Проверяем наличие сохраненной сессии при загрузке
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);
  
  // Проверка на админа
  const isAdmin = !!user && user.role === 'admin';
  
  // Проверка аутентификации
  const isAuthenticated = !!user;
  
  // Функция входа
  const login = async (email: string, password: string): Promise<boolean> => {
    // В реальном приложении здесь был бы запрос к API
    
    // Проверяем демо-данные
    if (email === demoUser.email && password === demoUser.password) {
      // Не храним пароль в состоянии
      const { password: _, ...userWithoutPassword } = demoUser;
      setUser(userWithoutPassword as User);
      
      // Сохраняем пользователя в localStorage
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      
      return true;
    }
    
    return false;
  };
  
  // Функция выхода
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
