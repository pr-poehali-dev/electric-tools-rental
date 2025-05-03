
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { User } from '@/types/types';

interface AuthContextProps {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.success && response.user) {
        setUser(response.user as User);
        
        // Сохраняем пользователя в localStorage
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        
        return true;
      } else {
        setError(response.message || 'Ошибка авторизации');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
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
      logout,
      isLoading,
      error
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
